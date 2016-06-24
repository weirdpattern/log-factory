/**
 * @module log.level
 * @author Patricio Trevino
 */

import Level from './level';
import style from '../styles/warn';

/**
 * @public
 * @memberof log.level
 * @since 1.0.0
 *
 * Represents a level that implies the logger will process warning messages and below.
 */
export default new Level('Warn', 3000, style);

