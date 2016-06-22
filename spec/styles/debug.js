const style = require('../../lib/styles/style');
const Style = style.Style;
const Foregrounds = style.Foregrounds;
const Backgrounds = style.Backgrounds;
const Modifiers = style.Modifiers;

module.exports = function (test, debug) {
  test('style debug', (assert) => {
    assert.ok(debug instanceof Style, 'debug is a style');
    assert.equals(debug.foreground, Foregrounds.GRAY, 'foreground must match');
    assert.equals(debug.background, Backgrounds.BLACK, 'background must match');
    assert.equals(debug.modifiers, Modifiers.NONE, 'modifiers must match');
  });
};
