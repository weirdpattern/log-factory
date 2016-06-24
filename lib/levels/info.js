/**
 * @module log.level
 * @author Patricio Trevino
 */

import Level from './level';
import style from '../styles/info';

/**
 * @public
 * @memberof log.level
 * @since 1.0.0
 *
 * Represents a level that implies the logger will process info messages and below.
 */
export default new Level('Info', 2000, style);
