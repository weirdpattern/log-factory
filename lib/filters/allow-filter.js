/**
 * @module log.filter
 */

import util from 'util';
import Filter, { FilterResults } from './filter';
import { extend, ExtensionPoints } from '../common/utils';

/**
 * @public
 * @constructor
 * @memberof log.filter
 * @since 1.0.0
 *
 * Represents a filter that always allows the log event.
 */
function AllowFilter () {
  Filter.call(this);
}

util.inherits(AllowFilter, Filter);

extend(AllowFilter.prototype, {
  /**
   * @see {@link log.filter.Filter#test}
   */
  test () {
    return FilterResults.ALLOW;
  }
}, ExtensionPoints.ENUMERABLE);

export default AllowFilter;
