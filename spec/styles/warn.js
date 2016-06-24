/**
 * @author Patricio Trevino
 */

import Style, { Foregrounds, Backgrounds, Modifiers } from '../../lib/styles/style';

export default function (test, warn) {
  test('style warn', (assert) => {
    assert.ok(warn instanceof Style, 'warn is a style');
    assert.equals(warn.foreground, Foregrounds.YELLOW, 'foreground must match');
    assert.equals(warn.background, Backgrounds.BLACK, 'background must match');
    assert.equals(warn.modifiers, Modifiers.NONE, 'modifiers must match');
  });
}
