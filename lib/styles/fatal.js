/**
 * @module log.style
 */

'use strict';

const style = require('./style');
const Style = style.Style;
const Foregrounds = style.Foregrounds;
const Backgrounds = style.Backgrounds;
const Modifiers = style.Modifiers;

/**
 * @public
 * @memberof log.style
 * @since 1.0.0
 *
 * Fatal default style.
 */
module.exports = new Style(Foregrounds.RED, Backgrounds.BLACK, Modifiers.BOLD);
