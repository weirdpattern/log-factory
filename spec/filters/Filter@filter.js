const warn = require('../../lib/levels/warn');
const fatal = require('../../lib/levels/fatal');
const LevelFilter = require('../../lib/filters/level-filter');
const AllowFilter = require('../../lib/filters/allow-filter');
const LevelThresholdFilter = require('../../lib/filters/level-threshold-filter');
const FilterResults = require('../../lib/filters/filter').FilterResults;
const LogEvent = require('../../lib/logger').LogEvent;

module.exports = function (test, Filter) {
  test('object Filter', (assert) => {
    const filter = new Filter();

    assert.comment('throws with');
    assert.throws(() => { filter.test(void 0); }, 'undefined events');
    assert.throws(() => { filter.test(null); }, 'null events');

    const filter1 = new AllowFilter();
    const filter2 = new LevelThresholdFilter(fatal);
    const filter3 = new LevelFilter(warn);

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
};
