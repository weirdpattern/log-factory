import ConsoleChannel from './console-channel';
import { guard } from '../common/utils';

/*
 * Shorthand methods.
 */
const hasOwnProperty = Object.prototype.hasOwnProperty;

/*
 * @private
 * @constant
 *
 * Represents the mappings between names and function implementations.
 */
const factories = {
  'console': ConsoleChannel,
  'console-channel': ConsoleChannel
};

/**
 * @static
 * @public
 * @function
 * @memberof log.channel
 * @since 1.0.0
 *
 * Creates a new channel instance based on the provide [name] and [settings].
 *
 * @param {string} name - the name/type of channel to be created.
 * @param {ChannelSettings} [settings] - the settings to be used to create the channel.
 * @returns {Filter} a new filter.
 * @throws {RangeError} when the filter name/type does not exists.
 */
export function get (name, settings) {
  guard(RangeError, hasOwnProperty.call(factories, name), `There is no channel defined with the name ${name}`);

  const Channel = factories[name];
  return new Channel(settings);
}

/**
 * @static
 * @public
 * @function
 * @memberof log.channel
 * @since 1.0.0
 *
 * Determines if the channel identified by [name] exists as a factory.
 *
 * @param {string} name - the name of the channel to be searched.
 * @returns {boolean} `true` if there is a channel [name] defined in the factory; `false` otherwise.
 */
export function has (name) {
  return hasOwnProperty.call(factories, name);
}
