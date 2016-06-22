import Style, { Foregrounds, Backgrounds, Modifiers } from '../../lib/styles/style';

export default function (test, fatal) {
  test('style fatal', (assert) => {
    assert.ok(fatal instanceof Style, 'fatal is a style');
    assert.equals(fatal.foreground, Foregrounds.RED, 'foreground must match');
    assert.equals(fatal.background, Backgrounds.BLACK, 'background must match');
    assert.equals(fatal.modifiers, Modifiers.BOLD, 'modifiers must match');
  });
}
