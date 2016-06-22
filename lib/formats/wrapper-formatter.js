/**
 * @module log.format
 */

'use strict';

const util = require('util');
const Formatter = require('./formatter');

function WrapperFormatter (format) {
  Formatter.call(this);
}

util.inherits(WrapperFormatter, Formatter);

/**
 * @public
 * @constructor
 * @memberof log.format
 * @since 1.0.0
 *
 * Represents a formatter that wraps another formatter.
 *
 * @param {(log.format.Formatter|function)} format
 */
module.exports = WrapperFormatter;
