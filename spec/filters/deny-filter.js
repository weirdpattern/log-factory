'use strict';

const filter = require('../../lib/filters/filter');
const Filter = filter.Filter;
const FilterResults = filter.FilterResults;

module.exports = function (test, DenyFilter) {
  const denyFilter = new DenyFilter();

  test('filter deny-filter', (assert) => {
    assert.ok(denyFilter instanceof Filter, 'deny-filter is a filter');
    assert.equals(denyFilter.filter, void 0, 'filter must be undefined');
    assert.equals(denyFilter.test(), FilterResults.DENY, 'filter must return DENY');
  });
};
