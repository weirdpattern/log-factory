'use strict';

const ExtensionPoints = require('../../lib/common/utils').ExtensionPoints;

module.exports = function (test, extend) {
  test('function extend', (assert) => {
    const closedObject = Object.preventExtensions({});
    const composeObject = Object.create(Object);

    assert.comment('throws with');
    assert.throws(() => extend(void 0, {}), TypeError, 'undefined values');
    assert.throws(() => extend(null, {}), TypeError, 'null values');
    assert.throws(() => extend(closedObject, {}), TypeError, 'objects passed through the preventExtensions method');
    assert.throws(() => extend({}, composeObject), TypeError, 'composed properties object');

    /* istanbul ignore next */
    assert.throws(() => extend({}, {
      'test': {
        'value': 1,
        'get': () => 1
      }
    }, ExtensionPoints.GETTER), TypeError, 'getters with values');

    /* istanbul ignore next */
    assert.throws(() => extend({}, {
      'test': {
        'value': 1,
        'set': (v) => { }
      }
    }, ExtensionPoints.SETTER), TypeError, 'setters with values');

    /* istanbul ignore next */
    assert.throws(() => extend({}, {
      'test': {
        'set': (v) => { }
      }
    }, ExtensionPoints.SETTER), TypeError, 'setters without getters');

    const objectNoProperties = Object.getOwnPropertyDescriptor(
      extend({}, { 'test': 1 }), 'test'
    );

    assert.comment('adds object with default values');
    assert.notOk(objectNoProperties.configurable, 'configurable must be false');
    assert.notOk(objectNoProperties.writable, 'writable must be false');
    assert.notOk(objectNoProperties.enumerable, 'enumerable must be false');
    assert.equals(objectNoProperties.value, 1, 'value must be 1');

    const configurableObject = Object.getOwnPropertyDescriptor(
      extend({}, { 'test': 1 }, ExtensionPoints.CONFIGURABLE), 'test'
    );

    assert.comment('adds configurable properties');
    assert.ok(configurableObject.configurable, 'configurable must be true');
    assert.notOk(configurableObject.writable, 'writable must be false');
    assert.notOk(configurableObject.enumerable, 'enumerable must be false');
    assert.equals(configurableObject.value, 1, 'value must be 1');

    const writableObject = Object.getOwnPropertyDescriptor(
      extend({}, { 'test': 1 }, ExtensionPoints.WRITABLE), 'test'
    );

    assert.comment('adds writable properties');
    assert.ok(writableObject.writable, 'writable must be true');
    assert.notOk(writableObject.configurable, 'configurable must be false');
    assert.notOk(writableObject.enumerable, 'enumerable must be false');
    assert.equals(writableObject.value, 1, 'value must be 1');

    const enumerableObject = Object.getOwnPropertyDescriptor(
      extend({}, { 'test': 1 }, ExtensionPoints.ENUMERABLE), 'test'
    );

    assert.comment('adds enumerable properties');
    assert.ok(enumerableObject.enumerable, 'enumerable must be true');
    assert.notOk(enumerableObject.configurable, 'configurable must be false');
    assert.notOk(enumerableObject.writable, 'writable must be false');
    assert.equals(enumerableObject.value, 1, 'value must be 1');

    /* istanbul ignore next */
    const getterObject = extend({}, {
      'test': {
        'get': () => 1
      }
    }, ExtensionPoints.GETTER);
    const getterObjectDescriptor = Object.getOwnPropertyDescriptor(getterObject, 'test');

    assert.comment('adds getter properties');
    assert.equals(getterObject.test, 1, 'must return 1');
    assert.notOk(getterObjectDescriptor.enumerable, 'enumerable must be true');
    assert.notOk(getterObjectDescriptor.configurable, 'configurable must be false');
    assert.notOk(getterObjectDescriptor.writable, 'writable must be false');
    assert.equals(getterObjectDescriptor.value, void 0, 'value must be undefined');

    let a = 1;

    /* istanbul ignore next */
    const setterObject = extend({}, {
      'test': {
        'get': () => a,
        'set': (v) => {
          a = v;
        }
      }
    }, ExtensionPoints.GETTER);
    const setterObjectDescriptor = Object.getOwnPropertyDescriptor(setterObject, 'test');

    assert.comment('adds getter properties');
    assert.equals(a, 1, 'must return 1');
    assert.equals(setterObject.test, 1, 'must return 1');
    assert.notOk(setterObjectDescriptor.enumerable, 'enumerable must be true');
    assert.notOk(setterObjectDescriptor.configurable, 'configurable must be false');
    assert.notOk(setterObjectDescriptor.writable, 'writable must be false');
    assert.equals(setterObjectDescriptor.value, void 0, 'value must be undefined');

    const enumerableAndWritableObject = Object.getOwnPropertyDescriptor(
      extend({}, { 'test': 1 }, ExtensionPoints.ENUMERABLE | ExtensionPoints.WRITABLE), 'test'
    );

    assert.comment('combinations');
    assert.ok(enumerableAndWritableObject.enumerable, 'enumerable must be true');
    assert.ok(enumerableAndWritableObject.writable, 'writable must be true');
    assert.notOk(enumerableAndWritableObject.configurable, 'configurable must be false');
    assert.equals(enumerableAndWritableObject.value, 1, 'value must be 1');
  });
};
