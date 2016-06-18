/**
 * @module log.level
 */

import style from '../styles/debug';

import Level from './level';

/**
 * @public
 * @memberof log.level
 * @since 1.0.0
 *
 * Represents a level that implies the logger will process debug messages and below.
 */
export default new Level('Debug', 1000, style);
