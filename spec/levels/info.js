/**
 * @author Patricio Trevino
 */

import Level from '../../lib/levels/level';
import { Foregrounds } from '../../lib/styles/style';

export default function (test, info) {
  test('level info', (assert) => {
    assert.ok(info instanceof Level, 'info is a level');
    assert.equals(info.name, 'Info', 'name must match');
    assert.equals(info.weight, 2000, 'weight must match');
    assert.equals(info.style.foreground, Foregrounds.CYAN, 'foreground must match');
  });
}
