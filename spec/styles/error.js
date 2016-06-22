import Style, { Foregrounds, Backgrounds, Modifiers } from '../../lib/styles/style';

export default function (test, error) {
  test('style error', (assert) => {
    assert.ok(error instanceof Style, 'error is a style');
    assert.equals(error.foreground, Foregrounds.RED, 'foreground must match');
    assert.equals(error.background, Backgrounds.BLACK, 'background must match');
    assert.equals(error.modifiers, Modifiers.NONE, 'modifiers must match');
  });
}
