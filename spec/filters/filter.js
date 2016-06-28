/**
 * @author Patricio Trevino
 */

import warn from '../../lib/levels/warn';
import fatal from '../../lib/levels/fatal';
import LevelFilter from '../../lib/filters/level-filter';
import AllowFilter from '../../lib/filters/allow-filter';
import LevelThresholdFilter from '../../lib/filters/level-threshold-filter';
import { LogEvent } from '../../lib/loggers/logger';
import { FilterResults } from '../../lib/filters/filter';

export default function (test, Filter) {
  test('object Filter', (assert) => {
    const filter = new Filter();

    assert.comment('throws with');
    assert.throws(() => { filter.test(void 0); }, 'undefined events');
    assert.throws(() => { filter.test(null); }, 'null events');

    const filter1 = new AllowFilter();
    const filter2 = new LevelThresholdFilter({ 'level': fatal });
    const filter3 = new LevelFilter({ 'levels': warn });

    const warnEvent = new LogEvent('test', warn, 'this is a test');

    filter1.next = filter2;
    filter2.next = filter3;

    let count = 0;
    let f = filter1;
    while (f) {
      assert.equals(f.test(warnEvent), FilterResults.ALLOW, 'chaining filters');
      f = f.next;
      count++;
    }

    assert.equals(count, 3, 'the count number does not match');
  });
}
