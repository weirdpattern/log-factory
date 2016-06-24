/**
 * @author Patricio Trevino
 */

import Level from '../../lib/levels/level';

export default function (test, all) {
  test('level all', (assert) => {
    assert.ok(all instanceof Level, 'off is a level');
    assert.equals(all.name, 'All', 'name must match');
    assert.equals(all.weight, Number.MAX_SAFE_INTEGER, 'weight must match');
    assert.equals(all.style, void 0, 'style must be undefined');
  });
}
