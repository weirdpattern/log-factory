import Filter, { FilterResults } from '../../lib/filters/filter';

export default function (test, AllowFilter) {
  const allowFilter = new AllowFilter();

  test('filter allow-filter', (assert) => {
    assert.ok(allowFilter instanceof Filter, 'allow-filter is a filter');
    assert.equals(allowFilter.filter, void 0, 'filter must be undefined');
    assert.equals(allowFilter.test(), FilterResults.ALLOW, 'filter must return ALLOW');
  });
}
