/**
 * @module log.filter
 */

import util from 'util';
import Level from '../levels/level';
import Filter, { FilterResults } from './filter';
import { extend, guard, ExtensionPoints } from '../common/utils';

/*
 * @private
 * @constant
 *
 * Shorthand hasOwnProperty method.
 */
export const hasOwnProperty = Object.prototype.hasOwnProperty;

/**
 * @public
 * @constructor
 * @memberof log.filter
 * @since 1.0.0
 *
 * Represents a filter that allows events with a level between [min] and [max].
 *
 * @param {log.level.Level} min - the min threshold level to be used.
 * @param {log.level.Level} max - the max threshold level to be used.
 * @param {LevelRangeFilterOptions} [options] - the options to be used with this filter.
 * @throws {TypeError} when [level] is not a valid level.
 */
function LevelRangeFilter (min, max, options) {
  Filter.call(this);

  guard(TypeError, min != null && min instanceof Level, 'Arguments "min" must be of type Level');
  guard(TypeError, max != null && max instanceof Level, 'Arguments "max" must be of type Level');
  guard(RangeError, min <= max, 'Argument "min (%s)" level must be less than the "max (%s)" level',
        min.weight, max.weight);

  const locked = options != null && hasOwnProperty.call(options, 'locked') ? options.locked : false;
  extend(this, {
    'min': min,
    'max': max,
    'deny': options != null && hasOwnProperty.call(options, 'deny') ? options.deny : true
  }, locked ? ExtensionPoints.ENUMERABLE : ExtensionPoints.ENUMERABLE | ExtensionPoints.WRITABLE);
}

util.inherits(LevelRangeFilter, Filter);

extend(LevelRangeFilter.prototype, {
  /**
   * @see {@link log.filter.Filter#test}
   */
  test (event) {
    Filter.prototype.test.call(this, event);

    if (this.min <= event.level && event.level <= this.max) {
      return FilterResults.ALLOW;
    }

    return this.deny === true ? FilterResults.DENY : FilterResults.PASS;
  }
}, ExtensionPoints.ENUMERABLE);

export default LevelRangeFilter;

/**
 * @typedef {Object} LevelRangeFilterOptions
 * @property {boolean} deny - a flag that determines if the filter should deny in case of a mismatch (true by default).
 * @property {boolean} locked - a flag that determines if the filter should allow modifications.
 */
