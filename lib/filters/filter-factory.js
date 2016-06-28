/**
 * @module log.filter
 * @author Patricio Trevino
 */

import AllowFilter from './allow-filter';
import PassFilter from './pass-filter';
import DenyFilter from './deny-filter';
import LevelFilter from './level-filter';
import LevelRangeFilter from './level-range-filter';
import LevelThresholdFilter from './level-threshold-filter';
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
  'level': LevelFilter,
  'level-range': LevelRangeFilter,
  'level-threshold': LevelThresholdFilter,
  'level-filter': LevelFilter,
  'level-range-filter': LevelRangeFilter,
  'level-threshold-filter': LevelThresholdFilter
};

/*
 * @private
 * @constant
 *
 * Represents the mappings between names and function implementations that can be cached.
 */
const instances = {
  'allow': new AllowFilter(),
  'pass': new PassFilter(),
  'deny': new DenyFilter(),
  'allow-filter': new AllowFilter(),
  'pass-filter': new PassFilter(),
  'deny-filter': new DenyFilter()
};

/**
 * @static
 * @public
 * @function
 * @memberof log.filter
 * @since 1.0.0
 *
 * Creates a new filter instance based on the provide [name] and [settings].
 *
 * @param {string} name - the name/type of filter to be created.
 * @param {FilterSettings} [settings] - the settings to be used to create the filter.
 * @returns {Filter} a new filter.
 * @throws {RangeError} when the filter name/type does not exists.
 */
export function get (name, settings) {
  const isFactory = hasOwnProperty.call(factories, name);
  const isInstance = hasOwnProperty.call(instances, name);

  guard(RangeError, isFactory || isInstance, `There is no filter defined with the name ${name}`);

  if (isInstance) {
    return instances[name];
  }

  const Filter = factories[name];
  return new Filter(settings);
}

/**
 * @static
 * @public
 * @function
 * @memberof log.filter
 * @since 1.0.0
 *
 * Determines if the filter identified by [name] exists either as a factory or an instance object.
 *
 * @param {string} name - the name of the filter to be searched.
 * @returns {boolean} `true` if there is a filter [name] defined in the factory; `false` otherwise.
 */
export function has (name) {
  return hasOwnProperty.call(factories, name) || hasOwnProperty.call(instances, name);
}
