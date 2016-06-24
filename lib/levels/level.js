/**
 * @module log.level
 * @author Patricio Trevino
 */

import Style from '../styles/style';
import defaultStyle from '../styles/default';
import { ExtensionPoints, extend, guard, isPlainObject } from '../common/utils';

/*
 * Shorthand methods
 */
const hasOwnProperty = Object.prototype.hasOwnProperty;

/* @private
 * @constant
 *
 * Restricted level names.
 */
const Restricted = [
  'OFF',
  'AUDIT',
  'DEBUG',
  'INFO',
  'WARNING',
  'ERROR',
  'FATAL'
];

/**
 * @public
 * @constructor
 * @memberof log.level
 * @since 1.0.0
 *
 * Represents a level inside the logger.
 *
 * @param {string} name - the name of the level.
 * @param {number} weight - the weight of the level.
 * @param {log.style.Style} [style] - the style of the level.
 * @throws {TypeError} when [name] is not a string.
 * @throws {TypeError} when [weight] is not a number or number-like.
 * @throws {TypeError} when [weight] is less than 1 and the name is not reserved.
 * @throws {TypeError} when [style] is not a valid Style.
 */
export default function Level (name, weight, style) {
  guard(TypeError, name && typeof name === 'string', 'Argument "name" must be of type String');
  guard(TypeError, weight != null && /^-?[0-9]+$/.test(JSON.stringify(weight)),
    'Argument "weight" must be of type Integer');

  if (style != null) {
    guard(TypeError, style instanceof Style, 'Argument "style" must be of type Style.');
  }

  if (Restricted.indexOf(name.toUpperCase()) === -1) {
    guard(TypeError, weight > 0, 'Weight must be greater than 0');
  }

  extend(this, {
    'name': name,
    'weight': weight
  }, ExtensionPoints.ENUMERABLE);

  this.style = style;
}

extend(Level.prototype, {
  /**
   * @public
   * @function
   * @memberof log.level
   * @since 1.0.0
   *
   * Resets the style of the level.
   */
  resetStyle () {
    this.style = defaultStyle;
  }
}, ExtensionPoints.ENUMERABLE);

extend(Level.prototype, {
  /**
   * @public
   * @function
   * @memberof log.level
   * @since 1.0.0
   *
   * Gets the string representation of a level.
   *
   * @returns {String} the name of the level.
   */
  toString () {
    return this.name;
  },

  /**
   * @public
   * @function
   * @memberof log.level
   * @since 1.0.0
   *
   * Gets the value representation of a level.
   *
   * @returns {int} the weight of the level.
   */
  valueOf () {
    return this.weight;
  }
});

extend(Level, {
  /**
   * @static
   * @public
   * @function
   * @memberof log.level
   * @since 1.0.0
   *
   * Creates a new level from [settings].
   *
   * @param {string} name - the name of the level.
   * @param {(LevelSettings|number)} settings - the settings to be used to create the level.
   * @returns {Level} the new level.
   * @throws {TypeError} when [name] is not provided or is not a valid type.
   * @throws {TypeError} when [settings] are not provided.
   * @throws {TypeError} when [settings.weight] is not provided.
   */
  create (name, settings) {
    guard(TypeError, name != null, 'Cannot create a level without a name');
    guard(TypeError, settings != null, 'Cannot create a level without at least a weight');

    if (isPlainObject(settings)) {
      guard(TypeError, settings.weight != null, 'Cannot create a level without a weight');

      let style = null;
      if (hasOwnProperty.call(settings, 'style')) {
        style = Style.create(settings.style);
      }

      return new Level(name, settings.weight, style);
    } else if (/^-?[0-9]+$/.test(JSON.stringify(settings))) {
      return new Level(name, +settings);
    }

    throw new TypeError(`Level ${name} settings must be a plain object or an integer`);
  }
});
