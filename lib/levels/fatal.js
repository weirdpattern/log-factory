/**
 * @module log.level
 */

'use strict';

const style = require('../styles/fatal');
const Level = require('./level');

/**
 * @public
 * @memberof log.level
 * @since 1.0.0
 *
 * Represents a level that implies the logger will process fatal messages and below.
 */
module.exports = new Level('Fatal', 5000, style);
