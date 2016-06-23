'use strict';

module.exports = function (test, isPlainObject) {
  test('function isPlainObject', (assert) => {
    assert.comment('undefined values');
    assert.notOk(isPlainObject(void 0), 'undefined values must return false');

    assert.comment('null values');
    assert.notOk(isPlainObject(null), 'null values must return false');

    assert.comment('non object values');
    assert.notOk(isPlainObject(true), 'boolean values must return false');
    assert.notOk(isPlainObject(false), 'boolean values must return false');
    assert.notOk(isPlainObject(NaN), 'NaN values must return false');
    assert.notOk(isPlainObject(0), 'numeric values must return false');
    assert.notOk(isPlainObject(1), 'numeric values must return false');
    assert.notOk(isPlainObject(-1), 'numeric values must return false');
    assert.notOk(isPlainObject('string'), 'string values must return false');
    assert.notOk(isPlainObject([]), 'array values must return false');
    assert.notOk(isPlainObject(new Date()), 'date values must return false');
    assert.notOk(isPlainObject(new Error()), 'error values must return false');
    assert.notOk(isPlainObject(Object('a')), 'object values must return false');

    assert.comment('Object.create(*) values');
    assert.notOk(isPlainObject(Object.create([])), 'numeric must return false');
    assert.notOk(isPlainObject(Object.create(Array)), 'numeric must return false');
    assert.notOk(isPlainObject(Object.create({})), 'objects must return false');
    assert.notOk(isPlainObject(Object.create(Object)), 'objects must return false');
    assert.ok(isPlainObject(Object.create(null)), 'plain objects must return true');

    assert.comment('{} values');
    assert.ok(isPlainObject({}), 'plain objects must return true');
  });
};
