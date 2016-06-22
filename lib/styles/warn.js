/**
 * @module log.style
 */

const style = require('./style');
const Style = style.Style;
const Foregrounds = style.Foregrounds;

/**
 * @public
 * @memberof log.style
 * @since 1.0.0
 *
 * Warning default style.
 */
module.exports = new Style(Foregrounds.YELLOW);
