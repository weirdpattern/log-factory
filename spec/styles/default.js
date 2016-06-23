'use strict';

const style = require('../../lib/styles/style');
const Style = style.Style;
const Foregrounds = style.Foregrounds;
const Backgrounds = style.Backgrounds;
const Modifiers = style.Modifiers;

module.exports = function (test, defaults) {
  test('style defaults', (assert) => {
    assert.ok(defaults instanceof Style, 'default is a style');
    assert.equals(defaults.foreground, Foregrounds.WHITE, 'foreground must match');
    assert.equals(defaults.background, Backgrounds.BLACK, 'background must match');
    assert.equals(defaults.modifiers, Modifiers.NONE, 'modifiers must match');
  });
};
