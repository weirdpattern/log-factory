import Filter, { FilterResults } from '../../lib/filters/filter';

export default function (test, DenyFilter) {
  const denyFilter = new DenyFilter();

  test('filter deny-filter', (assert) => {
    assert.ok(denyFilter instanceof Filter, 'deny-filter is a filter');
    assert.equals(denyFilter.filter, void 0, 'filter must be undefined');
    assert.equals(denyFilter.test(), FilterResults.DENY, 'filter must return DENY');
  });
}
