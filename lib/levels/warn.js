/**
 * @module log.level
 */

import style from '../styles/warn';

import Level from './level';

/**
 * @public
 * @memberof log.level
 * @since 1.0.0
 *
 * Represents a level that implies the logger will process warning messages and below.
 */
export default new Level('Warn', 3000, style);

