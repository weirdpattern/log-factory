/**
 * @module log.filter
 * @author Patricio Trevino
 */

import { ExtensionPoints, extend, guard, defaults } from '../common/utils';

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
export const FilterResults = {
  'DENY': -1,
  'PASS': 0,
  'ALLOW': 1
};

/**
 * @public
 * @constructor
 * @memberof log.filter
 * @since 1.0.0
 *
 * Represents a filter inside a channel.
 *
 * @param {FilterSettings} settings - the settings of the filter.
 */
export default function Filter (settings) {
  settings = defaults({}, settings, { 'deny': true, 'locked': false });

  extend(this, {
    'next': null,
    'deny': settings.deny
  }, ExtensionPoints.ENUMERABLE | ExtensionPoints.WRITABLE);

  this.configure(settings);
}

extend(Filter.prototype, {
  /**
   * @public
   * @function
   * @memberof log.filter
   * @since 1.0.0
   *
   * Configures the filter.
   *
   * @param {FilterSettings} [settings] - the settings of the filter.
   */
  configure (settings) {
    settings = defaults({}, settings, { 'deny': true, 'locked': false });

    this.applySettings(settings);

    if (settings.locked) {
      let descriptor;
      Object.getOwnPropertyNames(this).forEach((property) => {
        if (property === 'next') return;

        descriptor = Object.getOwnPropertyDescriptor(this, property);
        if (typeof this[ property ] === 'object') {
          Object.freeze(this[ property ]);
        }

        if (descriptor.writable) {
          descriptor.writable = false;
          Object.defineProperty(this, property, descriptor);
        }
      });
    }
  }
}, ExtensionPoints.ENUMERABLE);

extend(Filter.prototype, {
  /**
   * @abstract
   * @public
   * @function
   * @memberof log.filter
   * @since 1.0.0
   *
   * Applies the settings of the filter.
   * This class must be implemented by classes inheriting from {@link Filter}.
   *
   * @param {FilterSettings} [settings] - the settings of the filter.
   */
  applySettings (settings) {}
}, ExtensionPoints.CONFIGURABLE);

extend(Filter.prototype, {
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
    guard(TypeError, event != null, 'Argument [event] must be valid');
    return FilterResults.PASS;
  }
}, ExtensionPoints.ENUMERABLE | ExtensionPoints.CONFIGURABLE);
