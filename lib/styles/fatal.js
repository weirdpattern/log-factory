/**
 * @module log.style
 */

import Style, { Foregrounds, Backgrounds, Modifiers } from './style';

/**
 * @public
 * @memberof log.style
 * @since 1.0.0
 *
 * Fatal default style.
 */
export default new Style(Foregrounds.RED, Backgrounds.BLACK, Modifiers.BOLD);
