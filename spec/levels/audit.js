const Level = require('../../lib/levels/level');
const Foregrounds = require('../../lib/styles/style').Foregrounds;

module.exports = function (test, audit) {
  test('level audit', (assert) => {
    assert.ok(audit instanceof Level, 'audit is a level');
    assert.equals(audit.name, 'Audit', 'name must match');
    assert.equals(audit.weight, 1, 'weight must match');
    assert.equals(audit.style.foreground, Foregrounds.WHITE, 'foreground must match');
  });
};
