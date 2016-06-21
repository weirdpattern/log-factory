import Level from '../../lib/levels/level';

export default function (test, off) {
  test('off debug', (assert) => {
    assert.ok(off instanceof Level, 'off is a level');
    assert.equals(off.name, 'Off', 'name must match');
    assert.equals(off.weight, Number.MIN_SAFE_INTEGER, 'weight must match');
    assert.equals(off.style, void 0, 'style must be undefined');
  });
}
