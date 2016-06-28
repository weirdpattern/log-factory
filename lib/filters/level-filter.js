/**
 * @module log.filter
 * @author Patricio Trevino
 */

import util from 'util';
import Level from '../levels/level';
import Filter, { FilterResults } from './filter';
import { ExtensionPoints, extend, flatten, guard } from '../common/utils';

/**
 * @public
 * @constructor
 * @memberof log.filter
 * @since 1.0.0
 *
 * Represents a filter that allows events with a level equal to [level].
 *
 * @param {LevelFilterSettings} [settings] - the settings to be used with this filter.
 * @throws {TypeError} when [level] is not a valid level or, if [level] is an array an one of its elements
 *                     is not a valid level.
 */
export default function LevelFilter (settings) {
  Filter.call(this, settings);
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
   * @param {(log.level.Level|Array.<log.level.Level>)} level - the level/levels to be added.
   * @throws {Error} when the filter has been marked as locked.
   * @throws {TypeError} when [level] is not a valid level or, if [level] is an array an one of its elements
   *                     is not a valid level.
   */
  addLevel (level) {
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
   * @param {(string|log.level.Level|Array.<string|log.level.Level>)} level - the level/levels to be removed.
   * @throws {Error} when the filter has been marked as locked.
   * @throws {TypeError} when [level] is not a valid level or, if [level] is an array an one of its elements
   *                     is not a valid level.
   */
  removeLevel (level) {
    const toRemove = [];

    const addToRemoveList = (level) => {
      if (typeof level === 'string') {
        toRemove.push(level.toUpperCase());
        return true;
      } else if (level instanceof Level) {
        toRemove.push(level.name.toUpperCase());
        return true;
      }
      return false;
    };

    if (!addToRemoveList(level) && Array.isArray(level)) {
      level = flatten(level);
      level.forEach((current) => {
        addToRemoveList(current);
      });
    }

    if (toRemove.length === 0) {
      throw new TypeError('Argument "level" must be of type string, Level or array of strings or Levels');
    }

    this.levels = this.levels.filter((current) => {
      return toRemove.indexOf(current.name.toUpperCase()) === -1;
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
    this.levels.length = 0;
  },

  /*
   * @see {@link log.filter.Filter#test}
   */
  test (event) {
    Filter.prototype.test.call(this, event);

    if (this.levels.filter((level) => level === event.level).length > 0) {
      return FilterResults.ALLOW;
    }

    return this.deny === true ? FilterResults.DENY : FilterResults.PASS;
  }
}, ExtensionPoints.ENUMERABLE);

extend(LevelFilter.prototype, {
  /*
   * @see {@link log.filter.Filter#applySettings}
   */
  applySettings (settings) {
    let levels = settings.levels == null ? [] : Array.isArray(settings.levels) ? settings.levels : [ settings.levels ];
    levels.forEach((level) => {
      guard(TypeError, level instanceof Level, 'Argument "levels" must be of type Level or an array of Levels');
    });

    extend(this, {
      'levels': levels
    }, ExtensionPoints.ENUMERABLE | ExtensionPoints.WRITABLE);
  }
});
