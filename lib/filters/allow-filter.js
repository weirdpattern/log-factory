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
 * Represents a filter that always allows the log event.
 */
export default function AllowFilter () {
  Filter.call(this, { 'deny': true, 'locked': true });
}

util.inherits(AllowFilter, Filter);

extend(AllowFilter.prototype, {
  /*
   * @see {@link log.filter.Filter#test}
   */
  test () {
    return FilterResults.ALLOW;
  }
}, ExtensionPoints.ENUMERABLE);
