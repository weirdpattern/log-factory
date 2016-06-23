'use strict';

const style = require('../../lib/styles/style');
const Foregrounds = style.Foregrounds;
const Backgrounds = style.Backgrounds;
const Modifiers = style.Modifiers;

module.exports = function (test, Style) {
  test('object style', (assert) => {
    assert.comment('general structure');
    assert.ok(typeof Style === 'function', 'must be a function');

    assert.comment('default arguments');
    assert.equals(new Style().foreground, Foregrounds.WHITE, 'foreground must default to WHITE');
    assert.equals(new Style('A').foreground, Foregrounds.WHITE, 'foreground must default to WHITE');
    assert.equals(new Style().background, Backgrounds.BLACK, 'background must default to BLACK');
    assert.equals(new Style('A', 'B').background, Backgrounds.BLACK, 'background must default to BLACK');
    assert.equals(new Style().modifiers, Modifiers.NONE, 'modifiers must default to NONE');
    assert.equals(new Style('A', 'B', 'C').modifiers, Modifiers.NONE, 'modifiers must default to NONE');

    assert.comment('setting arguments');
    assert.equals(new Style(Foregrounds.GREEN).foreground, Foregrounds.GREEN, 'foreground is GREEN');
    assert.equals(new Style(Foregrounds.GREEN, Backgrounds.MAGENTA).background, Backgrounds.MAGENTA,
                  'background is MAGENTA');
    assert.equals(new Style(Foregrounds.GREEN, Backgrounds.MAGENTA, Modifiers.INVERSE).modifiers, Modifiers.INVERSE,
                  'modifiers is INVERSE');

    assert.comment('multi modifiers argument');
    assert.equals(new Style(null, null, Modifiers.INVERSE | Modifiers.BOLD).modifiers & Modifiers.INVERSE,
                  Modifiers.INVERSE, 'modifiers is INVERSE');
    assert.equals(new Style(null, null, Modifiers.INVERSE | Modifiers.BOLD).modifiers & Modifiers.BOLD,
                  Modifiers.BOLD, 'modifiers is BOLD');
    assert.equals(new Style(null, null, [ Modifiers.INVERSE, Modifiers.BOLD ]).modifiers & Modifiers.INVERSE,
                  Modifiers.INVERSE, 'modifiers is INVERSE');
    assert.equals(new Style(null, null, [ Modifiers.INVERSE, Modifiers.BOLD ]).modifiers & Modifiers.BOLD,
                  Modifiers.BOLD, 'modifiers is BOLD');

    assert.comment('string arguments');
    assert.equals(new Style('MAGENTA').foreground, Foregrounds.MAGENTA, 'foreground is MAGENTA');
    assert.equals(new Style('MAGENTA', 'RED').background, Backgrounds.RED, 'background is RED');
    assert.equals(new Style('MAGENTA', 'RED', 'DIM').modifiers, Modifiers.DIM, 'modifiers is DIM');
    assert.equals(new Style('MAGENTA', 'RED', [ 'DIM', 'BOLD' ]).modifiers & Modifiers.DIM, Modifiers.DIM,
                  'modifiers is DIM');
    assert.equals(new Style('MAGENTA', 'RED', [ 'DIM', 'BOLD' ]).modifiers & Modifiers.BOLD, Modifiers.BOLD,
                  'modifiers is BOLD');

    const style = new Style();
    assert.comment('methods');
    assert.equals(style.apply('Test'), 'Test', 'should return the formatted text');
  });
};
