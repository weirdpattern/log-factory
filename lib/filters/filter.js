/**
 * @module log.filter
 */

'use strict';

const utils = require('../common/utils');
const ExtensionPoints = utils.ExtensionPoints;

/*
 * @private
 * @constant
 * @see {@link log.filter#FilterResults}
 */
const FilterResults = {
  'DENY': -1,
  'PASS': 0,
  'ALLOW': 1
};

/*
 * @private
 * @constructor
 * @see {@link log.filter#Filter}
 */
function Filter () {
  utils.extend(this, {
    'next': null
  }, ExtensionPoints.ENUMERABLE | ExtensionPoints.WRITABLE);
}

utils.extend(Filter.prototype, {
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
    utils.guard(TypeError, event != null, 'Argument [event] must be valid');
    return FilterResults.PASS;
  }
}, ExtensionPoints.ENUMERABLE | ExtensionPoints.CONFIGURABLE);

module.exports = {
  /**
   * @public
   * @constructor
   * @memberof log.filter
   * @since 1.0.0
   *
   * Represents a filter inside a channel.
   */
  'Filter': Filter,

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
  'FilterResults': FilterResults
};
