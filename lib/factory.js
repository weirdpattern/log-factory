/**
 * @module log
 */

'use strict';

const utils = require('./common/utils');

/*
 * @private
 * @constant
 *
 * Shorthand hasOwnProperty method.
 */
export const hasOwnProperty = Object.prototype.hasOwnProperty;

/*
 * @private
 *
 * Logger cache object.
 */
const loggers = {};

let configuration = load();
if (configuration == null) {
  configuration = {
    'level': 'debug'
  };
}

function load (filename, options) {
  filename = typeof filename === 'string' ? filename : '.logwizrc';
  options = utils.defaults({}, options, { 'cwd': process.cwd(), 'recursive': true });
}

function configure (settings) {

}

/*
 * @private
 * @function
 * @see {@link log.hasLogger}
 */
function hasLogger (name) {
  return hasOwnProperty.call(loggers, name);
}

/*
 * @private
 * @function
 * @see {@link log#getLogger}
 */
function getLogger (name, settings) {
  name = typeof name !== 'string' ? 'default' : name;

  if (!hasLogger(name)) {

  }

  return loggers[name];
}

module.exports = {
  /**
   * @static
   * @public
   * @function
   * @memberof log
   * @since 1.0.0
   *
   * Loads a configuration file.
   *
   * @param {string} path - the path to the configuration file.
   */
  load: load,

  /**
   * @static
   * @public
   * @function
   * @memberof log
   * @since 1.0.0
   *
   * Configures the factory.
   *
   * @param {FactorySettings} settings - the configuration settings.
   */
  configure: configure,

  /**
   * @static
   * @public
   * @function
   * @memberof log
   * @since 1.0.0
   *
   * Determines if a logger with the given name exists.
   *
   * @param {string} name - the name of the logger.
   * @returns {boolean} `true` if the logger exists; `false` otherwise.
   */
  hasLogger: hasLogger,

  /**
   * @static
   * @public
   * @function
   * @memberof log
   * @since 1.0.0
   *
   * Gets a logger instance.
   *
   * @param {string} [name='default'] the name of the logger to be used.
   * @param {LoggerSettings} [settings] - the settings to initialize the logger.
   */
  getLogger: getLogger
};
