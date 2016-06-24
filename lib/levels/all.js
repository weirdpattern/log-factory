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
 * Represents a level that implies the logger all levels must be logged.
 */
export default new Level('All', Number.MAX_SAFE_INTEGER);
