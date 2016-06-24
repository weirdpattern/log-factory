/**
 * @author Patricio Trevino
 */

export default function (test, guard) {
  test('guard function', (assert) => {
    assert.comment('does not throw with');

    assert.doesNotThrow(() => guard(Error, true, 'passing true'), 'true conditions');
    assert.doesNotThrow(() => guard(Error, 1 < 2, 'passing 1 < 2'), 'true conditions');
    assert.doesNotThrow(() => guard(Error, void 0, 'passing void 0'), 'falsy values');
    assert.doesNotThrow(() => guard(Error, null, 'passing null'), 'falsy values');
    assert.doesNotThrow(() => guard(Error, 0, 'passing 0'), 'falsy values');
    assert.doesNotThrow(() => guard(Error, '', 'passing ""'), 'falsy values');
    assert.doesNotThrow(() => guard(Error, NaN, 'passing NaN'), 'falsy values');

    assert.comment('throws with');

    assert.throws(() => guard(Error, false, 'passing false'), 'false conditions');
    assert.throws(() => guard(Error, 1 < 0, 'passing 1 < 0'), 'false conditions');

    assert.comment('throws with well-known errors');
    assert.throws(() => guard(TypeError, false, 'passing false'), TypeError, 'well-known errors');

    function MyError () {}

    MyError.prototype = Object.create(Error.prototype);
    MyError.prototype.constructor = MyError;

    assert.comment('throws with user defined errors');
    assert.throws(() => guard(MyError, false, 'passing false'), MyError, 'user defined errors');

    assert.comment('throws with unknown errors');
    assert.throws(() => guard(void 0, false, 'passing false'), Error, 'unknown errors');
    assert.throws(() => guard(null, false, 'passing false'), Error, 'unknown errors');
    assert.throws(() => guard(1, false, 'passing false'), Error, 'unknown errors');
    assert.throws(() => guard('', false, 'passing false'), Error, 'unknown errors');
    assert.throws(() => guard({}, false, 'passing false'), Error, 'unknown errors');
    assert.throws(() => guard([], false, 'passing false'), Error, 'unknown errors');

    let messageSingleParameter;
    try {
      guard(Error, false, '%s test with replacements', 'AA');
    } catch (err) {
      messageSingleParameter = err.message;
    }

    let messageExceedingParameter;
    try {
      guard(Error, false, '%s %s test with replacements', 'AA');
    } catch (err) {
      messageExceedingParameter = err.message;
    }

    assert.comment('using replace values');
    assert.equals(messageSingleParameter, 'AA test with replacements', 'using replace values');
    assert.equals(messageExceedingParameter, 'AA  test with replacements', 'using exceeding values');
  });
}
