/**
 * @module log.level
 */

import style from '../styles/fatal';

import Level from './level';

/**
 * @public
 * @memberof log.level
 * @since 1.0.0
 *
 * Represents a level that implies the logger will process fatal messages and below.
 */
export default new Level('Fatal', 5000, style);