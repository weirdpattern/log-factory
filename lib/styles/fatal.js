const Style = require('./style');

/**
 * @module log.style
 */

/**
 * @public
 * @memberof log.style
 * @since 1.0.0
 *
 * Fatal default style.
 */
module.exports = new Style(Style.FOREGROUNDS.RED, Style.BACKGROUNDS.BLACK, Style.MODIFIERS.BOLD);