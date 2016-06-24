/**
 * @module log.filter
 * @author Patricio Trevino
 */

import util from 'util';
import Filter, { FilterResults } from './filter';
import { ExtensionPoints, extend } from '../common/utils';

/**
 * @public
 * @constructor
 * @memberof log.filter
 * @since 1.0.0
 *
 * Represents a filter that always denies the log event.
 */
export default function DenyFilter () {
  Filter.call(this);
}

util.inherits(DenyFilter, Filter);

extend(DenyFilter.prototype, {
  /*
   * @see {@link log.filter.Filter#test}
   */
  test () {
    return FilterResults.DENY;
  }
}, ExtensionPoints.ENUMERABLE);
