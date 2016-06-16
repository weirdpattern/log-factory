const Level = require('./level'),
      style = require('../styles/audit');

/**
 * @module log.level
 */

/**
 * @public
 * @memberof log.level
 * @since 1.0.0
 *
 * Represents a level that implies the logger will process audit messages.
 */
module.exports = new Level('Audit', 1, style);