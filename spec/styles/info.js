'use strict';

const style = require('../../lib/styles/style');
const Style = style.Style;
const Foregrounds = style.Foregrounds;
const Backgrounds = style.Backgrounds;
const Modifiers = style.Modifiers;

module.exports = function (test, info) {
  test('style info', (assert) => {
    assert.ok(info instanceof Style, 'info is a style');
    assert.equals(info.foreground, Foregrounds.CYAN, 'foreground must match');
    assert.equals(info.background, Backgrounds.BLACK, 'background must match');
    assert.equals(info.modifiers, Modifiers.NONE, 'modifiers must match');
  });
};
