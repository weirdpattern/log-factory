/**
 * @module log.level
 */

import style from '../styles/audit';

import Level from './level';

/**
 * @public
 * @memberof log.level
 * @since 1.0.0
 *
 * Represents a level that implies the logger will process audit messages.
 */
export default new Level('Audit', 1, style);