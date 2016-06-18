/**
 * @module log.level
 */

import style from '../styles/error';

import Level from './level';

/**
 * @public
 * @memberof log.level
 * @since 1.0.0
 *
 * Represents a level that implies the logger will process error messages and below.
 */
export default new Level('Error', 4000, style);