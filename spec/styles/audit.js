import Style from '../../lib/styles/Style';
import { Foregrounds, Backgrounds, Modifiers } from '../../lib/styles/style';

export default function (test, audit) {
  test('style audit', (assert) => {
    assert.ok(audit instanceof Style, 'audit is a style');
    assert.equals(audit.foreground, Foregrounds.WHITE, 'foreground must match');
    assert.equals(audit.background, Backgrounds.BLACK, 'background must match');
    assert.equals(audit.modifiers, Modifiers.NONE, 'modifiers must match');
  });
}
