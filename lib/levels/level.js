'use strict';

/**
 * @module log.level
 */

const Style = require('./../styles/style');

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
    throw new Error('"' + name + '" is a restricted name');
  }

  if (weight < 1) {
    throw new Error('Weight must be greater than 0');
  }

  this.name   = name;
  this.weight = weight;
  this.style  = style;
}

/**
 * @public
 * @function
 * @memberof log.level
 * @since 1.0.0
 *
 * Resets the style of the level.
 */
Level.prototype.resetStyle = function() {
  this.style = Style.Default;
};

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
Level.prototype.toString = function() {
  return this.name;
};

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
Level.prototype.valueOf = function() {
  return this.weight;
};

module.exports = Level;