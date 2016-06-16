const Level = require('./level'),
      style = require('../styles/warning');

/**
 * @module log.level
 */

/**
 * @public
 * @memberof log.level
 * @since 1.0.0
 *
 * Represents a level that implies the logger will process warning messages and below.
 */
module.exports = new Level('Warning', 3000, style);
