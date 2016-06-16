'use strict';

const util         = require('util'),
      EventEmitter = require('events').EventEmitter;

const Level    = require('./levels/level'),
      off      = require('./levels/off'),
      audit    = require('./levels/audit'),
      debug    = require('./levels/debug'),
      info     = require('./levels/debug'),
      warning  = require('./levels/debug'),
      error    = require('./levels/debug'),
      fatal    = require('./levels/debug');

/**
 * @module log.logger
 */

function log(logger, level, message, replacements) {

}

/**
 * @public
 * @constructor
 * @memberof log.logger
 * @since 1.0.0
 * 
 * Represents a logger.
 * 
 * @param {LoggerOptions} [options] - the options to be used to configure the logger.
 * @constructor
 */
function Logger(options) {
  EventEmitter.call(this);
  this.configure(options);
}

util.inherits(Logger, EventEmitter);

Logger.prototype.configure = function(options) {
  Object.defineProperty(this, 'level', {

  });
};

Logger.prototype.audit = function(message) {
  log(this, audit, message, Array.prototype.slice.call(arguments, 1));
};

Logger.prototype.debug = function(message) {
  log(this, debug, message, Array.prototype.slice.call(arguments, 1));
};

Logger.prototype.info = function(message) {
  log(this, info, message, Array.prototype.slice.call(arguments, 1));
};

Logger.prototype.warning = function(message) {
  log(this, warning, message, Array.prototype.slice.call(arguments, 1));
};

Logger.prototype.error = function(message) {
  log(this, error, message, Array.prototype.slice.call(arguments, 1));
};

Logger.prototype.fatal = function(message) {
  log(this, fatal, message, Array.prototype.slice.call(arguments, 1));
};

Logger.prototype.profile = function(message) {

};

module.exports = Logger;

/**
 * @typedef {Object} LoggerOptions
 *
 */