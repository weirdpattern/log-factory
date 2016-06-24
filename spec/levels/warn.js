/**
 * @author Patricio Trevino
 */

import Level from '../../lib/levels/level';
import { Foregrounds } from '../../lib/styles/style';

export default function (test, warn) {
  test('level warn', (assert) => {
    assert.ok(warn instanceof Level, 'warn is a level');
    assert.equals(warn.name, 'Warn', 'name must match');
    assert.equals(warn.weight, 3000, 'weight must match');
    assert.equals(warn.style.foreground, Foregrounds.YELLOW, 'foreground must match');
  });
}
