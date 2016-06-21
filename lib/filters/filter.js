/**
 * @module log.filter
 */

import { extend, guard, ExtensionPoints } from '../common/utils';

/**
 * @public
 * @constant
 * @memberof log.filter
 * @since 1.0.0
 *
 * Supported filter results.
 * DENY (-1)
 * PASS (0)
 * ALLOW (1)
 */
export const FilterResults = {
  'DENY': -1,
  'PASS': 0,
  'ALLOW': 1
};

/**
 * @public
 * @constructor
 * @memberof log.filter
 * @since 1.0.0
 *
 * Represents a filter inside a channel.
 */
function Filter () {
  extend(this, {
    'next': null
  }, ExtensionPoints.ENUMERABLE | ExtensionPoints.WRITABLE);
}

extend(Filter.prototype, {
  /**
   * @abstract
   * @public
   * @function
   * @memberof log.filter
   * @since 1.0.0
   *
   * Tests the current filter.
   *
   * @param {log.logger.LogEvent} event - the event to be logged.
   * @returns {int} any of the {@link log.filter.FilterResults} values.
   * @throws {TypeError} when [event] is null or undefined.
   */
  test (event) {
    guard(TypeError, event != null, 'Argument [event] must be valid');
    return FilterResults.PASS;
  }
}, ExtensionPoints.ENUMERABLE | ExtensionPoints.CONFIGURABLE);

export default Filter;
