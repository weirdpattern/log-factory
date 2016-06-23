'use strict';

const style = require('../../lib/styles/style');
const Style = style.Style;
const Foregrounds = style.Foregrounds;
const Backgrounds = style.Backgrounds;
const Modifiers = style.Modifiers;

module.exports = function (test, Level) {
  test('object level', (assert) => {
    assert.comment('general structure');
    assert.ok(typeof Level === 'function', 'must be a function');

    assert.comment('throws with');
    assert.throws(() => new Level(), TypeError, 'name is required');
    assert.throws(() => new Level(1), TypeError, 'name must be a string');
    assert.throws(() => new Level(''), TypeError, 'name must have length');
    assert.throws(() => new Level('1'), TypeError, 'weight is required');
    assert.throws(() => new Level('1', 'a'), TypeError, 'weight must be a number or similar to a number');
    assert.throws(() => new Level('1', 0), TypeError, 'weight must be greater than 0 for non reserved levels');
    assert.throws(() => new Level('1', 1, 4), TypeError, 'style must be a Style if provided');

    assert.comment('restricted names with weight 0');
    assert.equals(new Level('Off', -1).name, 'Off', 'restricted name with -1 weight');

    assert.comment('methods');
    assert.equals(new Level('Test', 5).toString(), 'Test', 'toString returns the name');
    assert.equals(new Level('Test', 5).valueOf(), 5, 'valueOf returns the weight');

    const test = new Level('Test', 5, new Style(Foregrounds.RED, Backgrounds.YELLOW, Modifiers.UNDERLINE));
    assert.equals(test.name, 'Test', 'name matches');
    assert.equals(test.weight, 5, 'weight matches');
    assert.equals(test.style.foreground, Foregrounds.RED, 'foreground matches');
    assert.equals(test.style.background, Backgrounds.YELLOW, 'background matches');
    assert.equals(test.style.modifiers, Modifiers.UNDERLINE, 'modifiers matches');

    test.resetStyle();
    assert.equals(test.name, 'Test', 'name matches');
    assert.equals(test.weight, 5, 'weight matches');
    assert.equals(test.style.foreground, Foregrounds.WHITE, 'foreground matches');
    assert.equals(test.style.background, Backgrounds.BLACK, 'background matches');
    assert.equals(test.style.modifiers, Modifiers.NONE, 'modifiers matches');

    assert.comment('immutability');
    assert.throws(() => { test.name = 'Others'; }, 'name cannot be changed');
    assert.throws(() => { test.weight = 100; }, 'weight cannot be changed');
    assert.doesNotThrow(() => { test.style = void 0; }, 'style can mutate');

    const level1 = new Level('Level 1', 1);
    const level5 = new Level('Level 5', 5);
    const level10 = new Level('Level 10', 10);

    assert.comment('operators');
    assert.ok(level1 < level5, 'level 1 must be lesser than level 5');
    assert.ok(level5 === level5, 'level 5 equals level 5'); // eslint-disable-line
    assert.ok(level10 > level5, 'level 10 must be greater than level 5');
    assert.equals(level10 * level5, 50, 'level10 * level5 is 50');
    assert.equals(level1 + level10, 11, 'level1 + level10 is 11');
    assert.equals(level10 / level5, 2, 'level10 / level5 is 2');
  });
};
