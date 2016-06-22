const filter = require('../../lib/filters/filter');
const Filter = filter.Filter;
const FilterResults = filter.FilterResults;

module.exports = function (test, AllowFilter) {
  const allowFilter = new AllowFilter();

  test('filter allow-filter', (assert) => {
    assert.ok(allowFilter instanceof Filter, 'allow-filter is a filter');
    assert.equals(allowFilter.filter, void 0, 'filter must be undefined');
    assert.equals(allowFilter.test(), FilterResults.ALLOW, 'filter must return ALLOW');
  });
};
