/**
 * @module log.level
 */

import style from '../styles/info';

import Level from './level';

/**
 * @public
 * @memberof log.level
 * @since 1.0.0
 *
 * Represents a level that implies the logger will process info messages and below.
 */
export default new Level('Info', 2000, style);
