/**
 * @module log.level
 */

import defaultStyle from '../styles/default';

import Style from '../styles/style';

import { extend } from '../common/utils';

/* @private
 * @constant
 *
 * Restricted level names.
 */
const RESTRICTED = [
  'off',
  'audit',
  'debug',
  'info',
  'warning',
  'error',
  'fatal'
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
 * @param {int} weight - the weight of the level.
 * @param {log.style.Style} [style] - the style of the level.
 * @throws {TypeError} when [name] is not a string.
 * @throws {TypeError} when [weight] is not a number or number-like.
 * @throws {Error} when [style] is not a valid Style.
 * @throws {Error} when [weight] is less than 1.
 */
function Level(name, weight, style) {
  if (name == null || typeof(name) !== 'string' || name.trim().length === 0) {
    throw new TypeError('Argument "name" must be of type String');
  }

  if (weight == null || (typeof(weight) !== 'number' && !/^[0-9]+$/.test(String(weight)))) {
    throw new TypeError('Argument "weight" must be of type Integer');
  }

  if (style != null && !(style instanceof Style)) {
    throw new TypeError('Argument "style" must be of type Style.')
  }

  if (RESTRICTED.indexOf(name.toLowerCase()) > -1) {
    throw new Error(`"${name}" is a restricted name`);
  }

  if (weight < 1) {
    throw new Error('Weight must be greater than 0');
  }

  extend(this, {
    'name': name,
    'weight': weight
  }, extend.ENUMERABLE);

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
  resetStyle() {
    this.style = defaultStyle;
  }
}, extend.ENUMERABLE);

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
  toString() {
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
  valueOf() {
    return this.weight;
  }
});

export default Level;