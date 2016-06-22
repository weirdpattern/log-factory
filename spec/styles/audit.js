const style = require('../../lib/styles/style');
const Style = style.Style;
const Foregrounds = style.Foregrounds;
const Backgrounds = style.Backgrounds;
const Modifiers = style.Modifiers;

module.exports = function (test, audit) {
  test('style audit', (assert) => {
    assert.ok(audit instanceof Style, 'audit is a style');
    assert.equals(audit.foreground, Foregrounds.WHITE, 'foreground must match');
    assert.equals(audit.background, Backgrounds.BLACK, 'background must match');
    assert.equals(audit.modifiers, Modifiers.NONE, 'modifiers must match');
  });
};
