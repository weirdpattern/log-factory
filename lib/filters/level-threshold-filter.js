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
 * @see {@link log.filter#LevelThresholdFilter}
 */
function LevelThresholdFilter (level, settings) {
  Filter.call(this);

  utils.guard(TypeError, level != null && level instanceof Level, 'Arguments "level" must be of type Level');

  let levelValue = level;
  const locked = settings != null && hasOwnProperty.call(settings, 'locked') ? settings.locked : false;

  utils.extend(this, {
    'level': {
      get () { return levelValue; },
      set (level) {
        utils.guard(Error, !locked, 'The object is locked');
        utils.guard(TypeError, level instanceof Level, '"min" must be of type Level');

        levelValue = level;
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

util.inherits(LevelThresholdFilter, Filter);

utils.extend(LevelThresholdFilter.prototype, {
  /*
   * @see {@link log.filter.Filter#test}
   */
  test (event) {
    Filter.prototype.test.call(this, event);

    if (event.level <= this.level) {
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
 * Represents a filter that allows events with a level equal or less than [level].
 *
 * @param {log.level.Level} level - the threshold level to be used.
 * @param {LevelThresholdFilterSettings} [settings] - the settings to be used with this filter.
 * @throws {TypeError} when [level] is not a valid level.
 */
module.exports = LevelThresholdFilter;
