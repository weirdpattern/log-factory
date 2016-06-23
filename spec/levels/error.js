'use strict';

const Level = require('../../lib/levels/level');
const Foregrounds = require('../../lib/styles/style').Foregrounds;

module.exports = function (test, error) {
  test('level error', (assert) => {
    assert.ok(error instanceof Level, 'error is a level');
    assert.equals(error.name, 'Error', 'name must match');
    assert.equals(error.weight, 4000, 'weight must match');
    assert.equals(error.style.foreground, Foregrounds.RED, 'foreground must match');
  });
};
