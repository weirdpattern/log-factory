import Style from '../../lib/styles/Style';
import { Foregrounds, Backgrounds, Modifiers } from '../../lib/styles/style';

export default function (test, defaults) {
  test('style defaults', (assert) => {
    assert.ok(defaults instanceof Style, 'default is a style');
    assert.equals(defaults.foreground, Foregrounds.WHITE, 'foreground must match');
    assert.equals(defaults.background, Backgrounds.BLACK, 'background must match');
    assert.equals(defaults.modifiers, Modifiers.NONE, 'modifiers must match');
  });
}
