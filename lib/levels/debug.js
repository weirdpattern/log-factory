/**
 * @module log.level
 */

'use strict';

const style = require('../styles/debug');
const Level = require('./level');

/**
 * @public
 * @memberof log.level
 * @since 1.0.0
 *
 * Represents a level that implies the logger will process debug messages and below.
 */
module.exports = new Level('Debug', 1000, style);
