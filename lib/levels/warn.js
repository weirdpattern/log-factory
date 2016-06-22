/**
 * @module log.level
 */

'use strict';

const style = require('../styles/warn');
const Level = require('./level');

/**
 * @public
 * @memberof log.level
 * @since 1.0.0
 *
 * Represents a level that implies the logger will process warning messages and below.
 */
module.exports = new Level('Warn', 3000, style);

