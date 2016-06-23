'use strict';

const style = require('../../lib/styles/style');
const Style = style.Style;
const Foregrounds = style.Foregrounds;
const Backgrounds = style.Backgrounds;
const Modifiers = style.Modifiers;

module.exports = function (test, fatal) {
  test('style fatal', (assert) => {
    assert.ok(fatal instanceof Style, 'fatal is a style');
    assert.equals(fatal.foreground, Foregrounds.RED, 'foreground must match');
    assert.equals(fatal.background, Backgrounds.BLACK, 'background must match');
    assert.equals(fatal.modifiers, Modifiers.BOLD, 'modifiers must match');
  });
};
