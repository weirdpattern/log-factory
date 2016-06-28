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
 * Represents a filter that allows events with a level equal or less than [level].
 *
 * @param {LevelThresholdFilterSettings} settings - the settings to be used with this filter.
 * @throws {TypeError} when [level] is not a valid level.
 */
export default function LevelThresholdFilter (settings) {
  Filter.call(this, settings);
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

extend(LevelThresholdFilter.prototype, {
  /*
   * @see {@link log.filter.Filter#applySettings}
   */
  applySettings (settings) {
    guard(TypeError, settings.level instanceof Level, 'Argument "level" must be of type Level');

    let levelValue = settings.level;

    extend(this, {
      'level': {
        get () { return levelValue; },
        set (level) {
          guard(Error, !settings.locked, 'The object is locked');
          guard(TypeError, level instanceof Level, '"min" must be of type Level');

          levelValue = level;
        }
      }
    }, ExtensionPoints.ENUMERABLE | ExtensionPoints.GETTER | ExtensionPoints.SETTER);
  }
});
