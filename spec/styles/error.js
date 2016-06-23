'use strict';

const style = require('../../lib/styles/style');
const Style = style.Style;
const Foregrounds = style.Foregrounds;
const Backgrounds = style.Backgrounds;
const Modifiers = style.Modifiers;

module.exports = function (test, error) {
  test('style error', (assert) => {
    assert.ok(error instanceof Style, 'error is a style');
    assert.equals(error.foreground, Foregrounds.RED, 'foreground must match');
    assert.equals(error.background, Backgrounds.BLACK, 'background must match');
    assert.equals(error.modifiers, Modifiers.NONE, 'modifiers must match');
  });
};
