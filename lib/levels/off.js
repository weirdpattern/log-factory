const Level = require('./level');

/**
 * @module log.level
 */

/**
 * @public
 * @memberof log.level
 * @since 1.0.0
 *
 * Represents a level that implies the logger is off.
 */
module.exports = new Level('Off', Number.MIN_SAFE_INTEGER);