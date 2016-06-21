/**
 * @module log.filter
 */

import util from 'util';
import Level from '../levels/level';
import Filter, { FilterResults } from './filter';
import { extend, flatten, guard, ExtensionPoints } from '../common/utils';

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
 * Represents a filter that allows events with a level equal to [level].
 *
 * @param {(log.level.Level|Array<log.level.Level>)} [levels] - the level/levels to be used.
 * @param {LevelFilterOptions} [options] - the options to be used with this filter.
 * @throws {TypeError} when [level] is not a valid level or, if [level] is an array an one of its elements
 *                     is not a valid level.
 */
function LevelFilter (levels, options) {
  Filter.call(this);

  levels = levels || [];
  levels = flatten(Array.isArray(levels) ? levels : [ levels ]);
  levels.forEach((level) => {
    guard(TypeError, level != null && level instanceof Level,
          'Arguments "levels" must be of type Level or an array of Levels');
  });

  const locked = options != null && hasOwnProperty.call(options, 'locked') ? options.locked : false;
  extend(this, {
    'levels': levels,
    'deny': options != null && hasOwnProperty.call(options, 'deny') ? options.deny : true
  }, locked ? ExtensionPoints.ENUMERABLE : ExtensionPoints.ENUMERABLE | ExtensionPoints.WRITABLE);

  extend(this, {
    '_locked': locked
  });
}

util.inherits(LevelFilter, Filter);

extend(LevelFilter.prototype, {
  /**
   * @public
   * @function
   * @memberof log.filter
   * @since 1.0.0
   *
   * Adds a level/levels to the filter.
   *
   * @param {(log.level.Level|Array<log.level.Level>)} level - the level/levels to be added.
   * @throws {Error} when the filter has been marked as locked.
   * @throws {TypeError} when [level] is not a valid level or, if [level] is an array an one of its elements
   *                     is not a valid level.
   */
  addLevel (level) {
    if (this._locked) {
      throw new Error('The filter was marked as locked, cannot be modified');
    }

    level = flatten(Array.isArray(level) ? level : [ level ]);
    level.forEach((current) => {
      guard(TypeError, current != null && current instanceof Level,
        'Arguments "level" must be of type Level or an array of Levels');
    });

    this.levels = this.levels.concat(level);
  },

  /**
   * @public
   * @function
   * @memberof log.filter
   * @since 1.0.0
   *
   * Removes a level/levels from the filter.
   *
   * @param {(string|log.level.Level|Array<string|log.level.Level>)} level - the level/levels to be removed.
   * @throws {Error} when the filter has been marked as locked.
   * @throws {TypeError} when [level] is not a valid level or, if [level] is an array an one of its elements
   *                     is not a valid level.
   */
  removeLevel (level) {
    if (this._locked) {
      throw new Error('The filter was marked as locked, cannot be modified');
    }

    const toRemove = [];

    const add = (level) => {
      if (typeof level === 'string') {
        toRemove.push(level);
        return true;
      } else if (level instanceof Level) {
        toRemove.push(level.name);
        return true;
      }
      return false;
    };

    if (!add(level) && Array.isArray(level)) {
      level = flatten(level);
      level.forEach((current) => {
        add(current);
      });
    }

    if (toRemove.length === 0) {
      throw new TypeError('Argument "level" must be of type string, Level or array of strings or Levels');
    }

    this.levels = this.levels.filter((current) => {
      return toRemove.indexOf(current.name) === -1;
    });
  },

  /**
   * @public
   * @function
   * @memberof log.filter
   * @since 1.0.0
   *
   * Clears all levels.
   * @throws {Error} when the filter has been marked as locked.
   */
  clearLevels () {
    if (this._locked) {
      throw new Error('The filter was marked as locked, cannot be modified');
    }

    this.levels.length = 0;
  },

  /**
   * @see {@link log.filter.Filter#test}
   */
  test (event) {
    Filter.prototype.test.call(this, event);

    if (this.levels.filter((level) => level == event.level).length > 0) { // eslint-disable-line eqeqeq
      return FilterResults.ALLOW;
    }

    return this.deny === true ? FilterResults.DENY : FilterResults.PASS;
  }
}, ExtensionPoints.ENUMERABLE);

export default LevelFilter;

/**
 * @typedef {Object} LevelFilterOptions
 * @property {boolean} deny - a flag that determines if the filter should deny in case of a mismatch (true by default).
 * @property {boolean} locked - a flag that determines if the filter should allow modifications.
 */
