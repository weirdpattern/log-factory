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
 * Represents a filter that always denies the log event.
 */
function DenyFilter () {
  Filter.call(this);
}

util.inherits(DenyFilter, Filter);

extend(DenyFilter.prototype, {
  /**
   * @see {@link log.filter.Filter#test}
   */
  test () {
    return FilterResults.DENY;
  }
}, ExtensionPoints.ENUMERABLE);

export default DenyFilter;
