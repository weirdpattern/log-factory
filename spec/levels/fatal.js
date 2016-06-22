const Level = require('../../lib/levels/level');
const style = require('../../lib/styles/style');
const Foregrounds = style.Foregrounds;
const Backgrounds = style.Backgrounds;
const Modifiers = style.Modifiers;

module.exports = function (test, fatal) {
  test('level fatal', (assert) => {
    assert.ok(fatal instanceof Level, 'fatal is a level');
    assert.equals(fatal.name, 'Fatal', 'name must match');
    assert.equals(fatal.weight, 5000, 'weight must match');
    assert.equals(fatal.style.foreground, Foregrounds.RED, 'foreground must match');
    assert.equals(fatal.style.background, Backgrounds.BLACK, 'background must match');
    assert.equals(fatal.style.modifiers, Modifiers.BOLD, 'modifier must match');
  });
};
