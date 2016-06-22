/**
 * @module log.level
 */

'use strict';

const utils = require('../common/utils');
const defaultStyle = require('../styles/default');
const Style = require('../styles/style').Style;
const ExtensionPoints = utils.ExtensionPoints;

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
 * @param {int} weight - the weight of the level.
 * @param {log.style.Style} [style] - the style of the level.
 * @throws {TypeError} when [name] is not a string.
 * @throws {TypeError} when [weight] is not a number or number-like.
 * @throws {TypeError} when [style] is not a valid Style.
 * @throws {TypeError} when [weight] is less than 1 and the name is not reserved.
 */
function Level (name, weight, style) {
  utils.guard(TypeError, name != null && typeof name === 'string' && name.trim().length > 0,
       'Argument "name" must be of type String');

  utils.guard(TypeError, weight != null && (typeof weight === 'number' || /^[0-9]+$/.test(String(weight))),
       'Argument "weight" must be of type Integer');

  if (style != null) {
    utils.guard(TypeError, style instanceof Style, 'Argument "style" must be of type Style.');
  }

  if (Restricted.indexOf(name.toUpperCase()) === -1) {
    utils.guard(TypeError, weight > 0, 'Weight must be greater than 0');
  }

  utils.extend(this, {
    'name': name,
    'weight': weight
  }, ExtensionPoints.ENUMERABLE);

  this.style = style;
}

utils.extend(Level.prototype, {
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

utils.extend(Level.prototype, {
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

module.exports = Level;
