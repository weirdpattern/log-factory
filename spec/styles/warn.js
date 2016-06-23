'use strict';

const style = require('../../lib/styles/style');
const Style = style.Style;
const Foregrounds = style.Foregrounds;
const Backgrounds = style.Backgrounds;
const Modifiers = style.Modifiers;

module.exports = function (test, warn) {
  test('style warn', (assert) => {
    assert.ok(warn instanceof Style, 'warn is a style');
    assert.equals(warn.foreground, Foregrounds.YELLOW, 'foreground must match');
    assert.equals(warn.background, Backgrounds.BLACK, 'background must match');
    assert.equals(warn.modifiers, Modifiers.NONE, 'modifiers must match');
  });
};
