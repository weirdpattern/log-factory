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
 * Represents a filter that always passes the log event.
 */
function PassFilter () {
  Filter.call(this);
}

util.inherits(PassFilter, Filter);

extend(PassFilter.prototype, {
  /**
   * @see {@link log.filter.Filter#test}
   */
  test () {
    return FilterResults.PASS;
  }
}, ExtensionPoints.ENUMERABLE);

export default PassFilter;
