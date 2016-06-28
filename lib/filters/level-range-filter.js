/**
 * @module log.filter
 * @author Patricio Trevino
 */

import util from 'util';
import Level from '../levels/level';
import Filter, { FilterResults } from './filter';
import { ExtensionPoints, extend, guard } from '../common/utils';

/**
 * @public
 * @constructor
 * @memberof log.filter
 * @since 1.0.0
 *
 * Represents a filter that allows events with a level between [settings.min] and [settings.max].
 *
 * @param {LevelRangeFilterSettings} settings - the settings to be used with this filter.
 * @throws {TypeError} when [level] is not a valid level.
 */
export default function LevelRangeFilter (settings) {
  Filter.call(this, settings);
}

util.inherits(LevelRangeFilter, Filter);

extend(LevelRangeFilter.prototype, {
  /*
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

extend(LevelRangeFilter.prototype, {
  /*
   * @see {@link log.filter.Filter#applySettings}
   */
  applySettings (settings) {
    guard(TypeError, settings.min instanceof Level, 'Argument "min" must be of type Level');
    guard(TypeError, settings.max instanceof Level, 'Argument "max" must be of type Level');
    guard(RangeError, settings.min <= settings.max, 'Argument "min (%s)" level must be less than the "max (%s)" level',
      settings.min.weight, settings.max.weight);

    let minValue = settings.min;
    let maxValue = settings.max;

    extend(this, {
      'min': {
        get () { return minValue; },
        set (level) {
          guard(Error, !settings.locked, 'The object is locked');
          guard(TypeError, level instanceof Level, '"min" must be of type Level');
          guard(RangeError, level <= this.max,
            `"min (${level.weight})" level must be less than the "max (${this.max.weight})"`);

          minValue = level;
        }
      },
      'max': {
        get () { return maxValue; },
        set (level) {
          guard(Error, !settings.locked, 'The object is locked');
          guard(TypeError, level instanceof Level, '"max" must be of type Level');
          guard(RangeError, level <= this.max,
            `"max (${level.weight})" level must be greater than the "min (${this.min.weight})"`);

          maxValue = level;
        }
      }
    }, ExtensionPoints.ENUMERABLE | ExtensionPoints.GETTER | ExtensionPoints.SETTER);
  }
});
