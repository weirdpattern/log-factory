/**
 * @module log.style
 */

'use strict';

const style = require('./style');
const Style = style.Style;
const Foregrounds = style.Foregrounds;

/**
 * @public
 * @memberof log.style
 * @since 1.0.0
 *
 * Audit default style.
 */
module.exports = new Style(Foregrounds.WHITE);
