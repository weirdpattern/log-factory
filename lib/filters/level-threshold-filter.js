/**
 * @module log.filter
 * @author Patricio Trevino
 */

import util from 'util';
import Level from '../levels/level';
import Filter, { FilterResults } from './filter';
import { ExtensionPoints, extend, guard } from '../common/utils';

/*
 * Shorthand methods.
 */
const hasOwnProperty = Object.prototype.hasOwnProperty;

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
export default function LevelThresholdFilter (level, settings) {
  Filter.call(this);

  guard(TypeError, level != null && level instanceof Level, 'Arguments "level" must be of type Level');

  let levelValue = level;
  const locked = settings != null && hasOwnProperty.call(settings, 'locked') ? settings.locked : false;

  extend(this, {
    'level': {
      get () { return levelValue; },
      set (level) {
        guard(Error, !locked, 'The object is locked');
        guard(TypeError, level instanceof Level, '"min" must be of type Level');

        levelValue = level;
      }
    }
  }, ExtensionPoints.ENUMERABLE | ExtensionPoints.GETTER | ExtensionPoints.SETTER);

  extend(this, {
    'deny': settings != null && hasOwnProperty.call(settings, 'deny') ? settings.deny : true
  }, ExtensionPoints.ENUMERABLE | ExtensionPoints.WRITABLE);

  if (locked) {
    Object.freeze(this);
  }
}

util.inherits(LevelThresholdFilter, Filter);

extend(LevelThresholdFilter.prototype, {
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
