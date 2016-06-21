import Style from '../../lib/styles/Style';
import { Foregrounds, Backgrounds, Modifiers } from '../../lib/styles/style';

export default function (test, debug) {
  test('style debug', (assert) => {
    assert.ok(debug instanceof Style, 'debug is a style');
    assert.equals(debug.foreground, Foregrounds.GRAY, 'foreground must match');
    assert.equals(debug.background, Backgrounds.BLACK, 'background must match');
    assert.equals(debug.modifiers, Modifiers.NONE, 'modifiers must match');
  });
}
