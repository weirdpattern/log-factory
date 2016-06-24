/**
 * @module log.level
 * @author Patricio Trevino
 */

import Level from './level';
import style from '../styles/error';

/**
 * @public
 * @memberof log.level
 * @since 1.0.0
 *
 * Represents a level that implies the logger will process error messages and below.
 */
export default new Level('Error', 4000, style);
