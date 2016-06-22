/**
 * @module log.level
 */

'use strict';

const style = require('../styles/audit');
const Level = require('./level');

/**
 * @public
 * @memberof log.level
 * @since 1.0.0
 *
 * Represents a level that implies the logger will process audit messages.
 */
module.exports = new Level('Audit', 1, style);
