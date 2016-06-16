const Level = require('./level'),
      style = require('../styles/info');

/**
 * @module log.level
 */

/**
 * @public
 * @memberof log.level
 * @since 1.0.0
 *
 * Represents a level that implies the logger will process info messages and below.
 */
module.exports = new Level('Info', 2000, style);