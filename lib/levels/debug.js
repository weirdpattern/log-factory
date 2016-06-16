const Level = require('./level'),
      style = require('../styles/debug');

/**
 * @module log.level
 */

/**
 * @public
 * @memberof log.level
 * @since 1.0.0
 *
 * Represents a level that implies the logger will process debug messages and below.
 */
module.exports = new Level('Debug', 1000, style);