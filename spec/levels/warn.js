const Level = require('../../lib/levels/level');
const Foregrounds = require('../../lib/styles/style').Foregrounds;

module.exports = function (test, warn) {
  test('level warn', (assert) => {
    assert.ok(warn instanceof Level, 'warn is a level');
    assert.equals(warn.name, 'Warn', 'name must match');
    assert.equals(warn.weight, 3000, 'weight must match');
    assert.equals(warn.style.foreground, Foregrounds.YELLOW, 'foreground must match');
  });
};
