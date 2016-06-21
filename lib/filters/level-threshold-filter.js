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
 * Represents a filter that allows events with a level higher or equal to [level].
 *
 * @param {log.level.Level} level - the threshold level to be used.
 * @param {LevelThresholdFilterOptions} [options] - the options to be used with this filter.
 * @throws {TypeError} when [level] is not a valid level.
 */
function LevelThresholdFilter (level, options) {
  Filter.call(this);

  guard(TypeError, level != null && level instanceof Level, 'Arguments "level" must be of type Level');

  const locked = options != null && hasOwnProperty.call(options, 'locked') ? options.locked : false;
  extend(this, {
    'level': level,
    'deny': options != null && hasOwnProperty.call(options, 'deny') ? options.deny : true
  }, locked ? ExtensionPoints.ENUMERABLE : ExtensionPoints.ENUMERABLE | ExtensionPoints.WRITABLE);
}

util.inherits(LevelThresholdFilter, Filter);

extend(LevelThresholdFilter.prototype, {
  /**
   * @see {@link log.filter.Filter#test}
   */
  test (event) {
    Filter.prototype.test.call(this, event);

    if (event.level >= this.level) {
      return FilterResults.ALLOW;
    }

    return this.deny === true ? FilterResults.DENY : FilterResults.PASS;
  }
}, ExtensionPoints.ENUMERABLE);

export default LevelThresholdFilter;

/**
 * @typedef {Object} LevelThresholdFilterOptions
 * @property {boolean} deny - a flag that determines if the filter should deny in case of a mismatch (true by default).
 */
