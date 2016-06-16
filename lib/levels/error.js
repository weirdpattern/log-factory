const Level = require('./level'),
      style = require('../styles/error');

/**
 * @module log.level
 */

/**
 * @public
 * @memberof log.level
 * @since 1.0.0
 *
 * Represents a level that implies the logger will process error messages and below.
 */
module.exports = new Level('Error', 4000, style);