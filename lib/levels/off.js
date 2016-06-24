/**
 * @module log.level
 * @author Patricio Trevino
 */

import Level from './level';

/**
 * @public
 * @memberof log.level
 * @since 1.0.0
 *
 * Represents a level that implies the logger is off.
 */
export default new Level('Off', Number.MIN_SAFE_INTEGER);
