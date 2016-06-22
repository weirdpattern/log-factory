const Level = require('../../lib/levels/level');
const Foregrounds = require('../../lib/styles/style').Foregrounds;

module.exports = function (test, debug) {
  test('level debug', (assert) => {
    assert.ok(debug instanceof Level, 'debug is a level');
    assert.equals(debug.name, 'Debug', 'name must match');
    assert.equals(debug.weight, 1000, 'weight must match');
    assert.equals(debug.style.foreground, Foregrounds.GRAY, 'foreground must match');
  });
};
