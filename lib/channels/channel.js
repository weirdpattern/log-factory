/**
 * @module log.channel
 * @author Patricio Trevino
 */

import Filter from '../filters/filter';
import Formatter from '../formats/formatter';
import BasicFormatter from '../formats/basic-formatter';
import WrapperFormatter from '../formats/wrapper-formatter';
import { ExtensionPoints, extend, guard, defaults } from '../common/utils';

/**
 * @public
 * @constructor
 * @memberof log.channel
 * @since 1.0.0
 *
 * Represents a channel inside the logger.
 *
 * @param {Object} [settings] - the settings of the channel.
 * @throws {TypeError} when [format] is not a valid instance of {@link log.format.Format} or a function.
 */
export default function Channel (settings) {
  extend(this, {
    '_head': null,
    '_tail': null
  }, ExtensionPoints.WRITABLE);

  this.configure(settings);
}

extend(Channel.prototype, {
  /**
   * @public
   * @function
   * @memberof log.channel
   * @since 1.0.0
   *
   * Adds a new filter to the channel.
   *
   * @param {log.filters.Filter} filter - the filter to be added.
   * @throws {TypeError} when [filter] is not valid or not a {@link log.filters.Filter}.
   */
  addFilter (filter) {
    guard(TypeError, filter != null && filter instanceof Filter, 'Argument "filter" must be of type Filter');

    if (this._head == null) {
      this._head = this._tail = filter;
    } else {
      this._tail.next = filter;
      this._tail = filter;
    }
  },

  /**
   * @public
   * @function
   * @memberof log.channel
   * @since 1.0.0
   *
   * Clears all filters in the channel.
   */
  clearFilters () {
    this._head = this._tail = null;
  },

  /**
   * @public
   * @function
   * @memberof log.channel
   * @since 1.0.0
   *
   * Configures the channel.
   *
   * @param {ChannelSettings} [settings] - the settings of the channel.
   */
  configure (settings) {
    settings = defaults({}, settings, { 'filters': [] });

    this.applySettings(settings);

    settings.filters.forEach(this.addFilter);

    const isFormatter = settings.formatter instanceof Formatter;
    if (typeof settings.formatter === 'function' && !isFormatter) {
      settings.formatter = new WrapperFormatter(settings.formatter);
    }

    settings.formatter = settings.formatter || new BasicFormatter();
  }
}, ExtensionPoints.ENUMERABLE);

extend(Filter.prototype, {
  /**
   * @abstract
   * @public
   * @function
   * @memberof log.channel
   * @since 1.0.0
   *
   * Applies the settings of the channel.
   * This class must be implemented by classes inheriting from {@link Channel}.
   *
   * @param {ChannelSettings} [settings] - the settings of the channel.
   */
  applySettings (settings) {}
}, ExtensionPoints.CONFIGURABLE);

extend(Channel.prototype, {
  /**
   * @abstract
   * @public
   * @function
   * @memberof log.channel
   * @since 1.0.0
   *
   * Closes the channel, releasing all resources.
   */
  close () {},

  /**
   * @abstract
   * @public
   * @function
   * @memberof log.channel
   * @since 1.0.0
   *
   * Sends the logging event.
   *
   * @param {log.logger.LogEvent} event -  the event to be logged.
   */
  send (event) {}
}, ExtensionPoints.ENUMERABLE | ExtensionPoints.CONFIGURABLE);
