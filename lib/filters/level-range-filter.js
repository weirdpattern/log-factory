/**
 * @module log.filter
 */

'use strict';

const utils = require('../common/utils');
const util = require('util');
const filter = require('./filter');
const Level = require('../levels/level');
const Filter = filter.Filter;
const FilterResults = filter.FilterResults;
const ExtensionPoints = utils.ExtensionPoints;

/*
 * @private
 * @constant
 *
 * Shorthand hasOwnProperty method.
 */
const hasOwnProperty = Object.prototype.hasOwnProperty;

/*
 * @private
 * @constructor
 * @see {@link log.filter#LevelRangeFilter}
 */
function LevelRangeFilter (min, max, settings) {
  Filter.call(this);

  utils.guard(TypeError, min != null && min instanceof Level, 'Argument "min" must be of type Level');
  utils.guard(TypeError, max != null && max instanceof Level, 'Argument "max" must be of type Level');
  utils.guard(RangeError, min <= max, 'Argument "min (%s)" level must be less than the "max (%s)" level',
        min.weight, max.weight);

  let minValue = min;
  let maxValue = max;
  const locked = settings != null && hasOwnProperty.call(settings, 'locked') ? settings.locked : false;

  utils.extend(this, {
    'min': {
      get () { return minValue; },
      set (level) {
        utils.guard(Error, !locked, 'The object is locked');
        utils.guard(TypeError, level instanceof Level, '"min" must be of type Level');
        utils.guard(RangeError, level <= this.max,
                    `"min (${level.weight})" level must be less than the "max (${this.max.weight})"`);

        minValue = level;
      }
    },
    'max': {
      get () { return maxValue; },
      set (level) {
        utils.guard(Error, !locked, 'The object is locked');
        utils.guard(TypeError, level instanceof Level, '"max" must be of type Level');
        utils.guard(RangeError, level <= this.max,
                    `"max (${level.weight})" level must be greater than the "min (${this.min.weight})"`);

        maxValue = level;
      }
    }
  }, ExtensionPoints.ENUMERABLE | ExtensionPoints.GETTER | ExtensionPoints.SETTER);

  utils.extend(this, {
    'deny': settings != null && hasOwnProperty.call(settings, 'deny') ? settings.deny : true
  }, ExtensionPoints.ENUMERABLE | ExtensionPoints.WRITABLE);

  if (locked) {
    Object.freeze(this);
  }
}

util.inherits(LevelRangeFilter, Filter);

utils.extend(LevelRangeFilter.prototype, {
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
 * @param {LevelRangeFilterSettings} [settings] - the settings to be used with this filter.
 * @throws {TypeError} when [level] is not a valid level.
 */
module.exports = LevelRangeFilter;
