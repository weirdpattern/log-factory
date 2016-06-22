/**
 * @module log.format
 */

'use strict';

const util = require('util');
const Formatter = require('./formatter');

function BasicFormatter () {
  Formatter.call(this);
}

util.inherits(BasicFormatter, Formatter);

module.exports = BasicFormatter;
