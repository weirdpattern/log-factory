/**
 * @module log.logger
 */

'use strict';

const EventEmitter = require('events').EventEmitter;
const Level = require('./levels/level');
const DefaultLevels = {
  'off': require('./levels/off'),
  'audit': require('./levels/audit'),
  'debug': require('./levels/debug'),
  'info': require('./levels/info'),
  'warn': require('./levels/warn'),
  'error': require('./levels/error'),
  'fatal': require('./levels/fatal')
};

const util = require('util');
const utils = require('./common/utils');
const ExtensionPoints = utils.ExtensionPoints;

/*
 * @private
 * @constant
 *
 * Shorthand hasOwnProperty method.
 */
const hasOwnProperty = Object.prototype.hasOwnProperty;

/*
 * @private
 * @constant
 *
 * Shorthand slice method.
 */
const slice = Array.prototype.slice;

/*
 * @private
 * @function
 *
 * Logs message to the different channels.
 *
 * @param {log.logger.Logger} logger - the logger to be used.
 * @param {log.levels.Level} level - the level being logger.
 * @param {string} message - the message to be logged.
 * @param {Array<*>} replacements - the replacements to be used inside the message.
 */
function log (logger, level, message, replacements) {
  if (level <= logger.level && logger.level !== DefaultLevels.off && level !== DefaultLevels.off) {
    const event = new LogEvent(logger, level, message, replacements);

    logger.emit('log', level, event);
    logger.emit('log:' + utils.toCamelCase(level.name), event);
  }
}

/*
 * @private
 * @function
 *
 * Builds the internals of [logger].
 *
 * @param {log.logger.Logger} logger - the logger to be built.
 */
function build (logger) {
  const defined = [ 'level' ].every((property) => property in logger);
  if (!defined) {
    utils.extend(logger, {
      'level': {
        get () { return this.level; },
        set (candidate) { this.level = getLevel(candidate, logger._levels); }
      },
      'format': {
        get () { return this.format; },
        set (candidate) { this.format = getFormat(candidate); }
      }
    }, ExtensionPoints.ENUMERABLE | ExtensionPoints.GETTER | ExtensionPoints.SETTER);

    utils.extend(logger, {
      '_levels': {
        [utils.toCamelCase(DefaultLevels.off.name)]: DefaultLevels.off,
        [utils.toCamelCase(DefaultLevels.audit.name)]: DefaultLevels.audit,
        [utils.toCamelCase(DefaultLevels.debug.name)]: DefaultLevels.debug,
        [utils.toCamelCase(DefaultLevels.info.name)]: DefaultLevels.info,
        [utils.toCamelCase(DefaultLevels.warn.name)]: DefaultLevels.warn,
        [utils.toCamelCase(DefaultLevels.error.name)]: DefaultLevels.error,
        [utils.toCamelCase(DefaultLevels.fatal.name)]: DefaultLevels.fatal
      }
    }, ExtensionPoints.WRITABLE);
  }
}

/*
 * @private
 * @function
 *
 * Gets the correct level.
 *
 * @param {(log.level.Level|string|int)} candidate - the candidate level to be used.
 * @param {Array<log.level.Level>} pool - the pool of levels in the current logger.
 * @returns {log.level.Level} the level to be used.
 * @throws {TypeError} when no valid level is found for [candidate].
 */
function getLevel (candidate, pool) {
  candidate = candidate || DefaultLevels.off;

  if (candidate instanceof Level) {
    if (hasOwnProperty.call(pool, candidate.name)) {
      return candidate;
    }
    candidate = candidate.name;
  } else if (typeof candidate === 'string' && hasOwnProperty.call(pool, candidate)) {
    return pool[candidate];
  } else if (typeof candidate === 'number' || /^[0-9]+$/.test(candidate)) {
    let key;
    for (key in pool) {
      if (hasOwnProperty.call(pool, key) && pool[key].weight === +candidate) {
        return pool[key];
      }
    }
    candidate = `{ value -> ${candidate} }`;
  }

  throw new TypeError(`"${candidate}" is not a valid level`);
}

/*
 * @private
 * @function
 *
 * Gets the correct format.
 *
 * @param {(int|string)} candidate - the candidate format to be used.
 * @returns {int} the format to be used.
 * @throws {TypeError} when no valid format is found for [candidate].
 */
function getFormat (candidate) {
  candidate = candidate || Format.SIMPLE;

  if (typeof candidate === 'string' && hasOwnProperty.call(Format, candidate.toUpperCase())) {
    return Format[candidate.toUpperCase()];
  } else if (typeof candidate === 'number' || /^[0-9]$/.test(candidate)) {
    if (Format.SIMPLE === +candidate || Format.EXTENDED === +candidate) {
      return +candidate;
    }
    candidate = `{ value -> ${candidate} }`;
  }

  throw new TypeError(`"${candidate}" is not a valid format`);
}

/*
 * @private
 * @constant
 * @see {@link log.logger#Format}
 */
const Format = {
  'SIMPLE': 1,
  'EXTENDED': 2
};

/*
 * @private
 * @constructor
 * @see {@link log.logger#LogEvent}
 */
function LogEvent (logger, level, message, replacements) {
  utils.extend(this, {
    'logger': logger,
    'level': level,
    'message': message,
    'replacements': replacements
  }, ExtensionPoints.ENUMERABLE);
}

/*
 * @private
 * @constructor
 * @see {@link log.logger#Logger}
 */
function Logger (settings) {
  EventEmitter.call(this);
  this.configure(settings);
}

util.inherits(Logger, EventEmitter);

utils.extend(Logger.prototype, {
  /**
   * @public
   * @function
   * @memberof log.logger
   * @since 1.0.0
   *
   * Configures and initializes the logger.
   *
   * @param {LoggerSettings} settings - the settings to be used.
   */
  configure (settings) {
    settings = settings || {};

    build(this, settings);

    this.level = settings.level;
    this.format = settings.format;

    let name;
    this._levels = this._levels.concat(
      (settings.levels || []).filter((level) => level instanceof Level).map((level) => {
        utils.guard(Error, !hasOwnProperty.call(this, utils.toCamelCase(level.name)),
              '%s already exists', level.name);

        name = utils.toCamelCase(level.name);
        utils.extend(this, {
          [name]: function (message) {
            log(this, level, message, slice.call(arguments, 1));
          },
          [`is${name}Enabled`]: function () {
            return this.isLevelEnabled(level);
          }
        });

        return level;
      })
    );
  },

  /**
   * @public
   * @function
   * @memberof log.logger
   * @since 1.0.0
   *
   * Determines if the given level is enabled based off of the current logger level.
   *
   * @param {(log.level.Level|string)} level - the level to be validated.
   * @returns {boolean} `true` if [level] is enabled; `false` otherwise.
   * @throws {TypeError} when [level] is not a {@link log.level.Level} or a string.
   */
  isLevelEnabled (level) {
    if (typeof level === 'string') {
      level = this._levels[utils.toCamelCase(level)];
    }

    utils.guard(TypeError, level instanceof Level, '"level" must be of type Level');

    return level <= this.level;
  },

  /**
   * @public
   * @function
   * @memberof log.logger
   * @since 1.0.0
   *
   * Logs an audit message.
   *
   * @param {string} message - the message to be logged.
   * @param {arguments} arguments - the replace arguments of the message.
   */
  audit (message) {
    log(this, DefaultLevels.audit, message, slice.call(arguments, 1));
  },

  /**
   * @public
   * @function
   * @memberof log.logger
   * @since 1.0.0
   *
   * Determines if the audit level is enabled based off of the current logger level.
   *
   * @returns {boolean} `true` if audit level is enabled; `false` otherwise.
   */
  isAuditEnabled () {
    return this.isLevelEnabled(DefaultLevels.audit);
  },

  /**
   * @public
   * @function
   * @memberof log.logger
   * @since 1.0.0
   *
   * Logs a debug message.
   *
   * @param {string} message - the message to be logged.
   * @param {arguments} arguments - the replace arguments of the message.
   */
  debug (message) {
    log(this, DefaultLevels.debug, message, slice.call(arguments, 1));
  },

  /**
   * @public
   * @function
   * @memberof log.logger
   * @since 1.0.0
   *
   * Determines if the debug level is enabled based off of the current logger level.
   *
   * @returns {boolean} `true` if debug level is enabled; `false` otherwise.
   */
  isDebugEnabled () {
    return this.isLevelEnabled(DefaultLevels.debug);
  },

  /**
   * @public
   * @function
   * @memberof log.logger
   * @since 1.0.0
   *
   * Logs an info message.
   *
   * @param {string} message - the message to be logged.
   * @param {arguments} arguments - the replace arguments of the message.
   */
  info (message) {
    log(this, DefaultLevels.info, message, slice.call(arguments, 1));
  },

  /**
   * @public
   * @function
   * @memberof log.logger
   * @since 1.0.0
   *
   * Determines if the info level is enabled based off of the current logger level.
   *
   * @returns {boolean} `true` if info level is enabled; `false` otherwise.
   */
  isInfoEnabled () {
    return this.isLevelEnabled(DefaultLevels.info);
  },

  /**
   * @public
   * @function
   * @memberof log.logger
   * @since 1.0.0
   *
   * Logs a warn message.
   *
   * @param {string} message - the message to be logged.
   * @param {arguments} arguments - the replace arguments of the message.
   */
  warn (message) {
    log(this, DefaultLevels.warn, message, slice.call(arguments, 1));
  },

  /**
   * @public
   * @function
   * @memberof log.logger
   * @since 1.0.0
   *
   * Determines if the warn level is enabled based off of the current logger level.
   *
   * @returns {boolean} `true` if warn level is enabled; `false` otherwise.
   */
  isWarnEnabled () {
    return this.isLevelEnabled(DefaultLevels.warn);
  },

  /**
   * @public
   * @function
   * @memberof log.logger
   * @since 1.0.0
   *
   * Logs an error message.
   *
   * @param {string} message - the message to be logged.
   * @param {arguments} arguments - the replace arguments of the message.
   */
  error (message) {
    log(this, DefaultLevels.error, message, slice.call(arguments, 1));
  },

  /**
   * @public
   * @function
   * @memberof log.logger
   * @since 1.0.0
   *
   * Determines if the error level is enabled based off of the current logger level.
   *
   * @returns {boolean} `true` if error level is enabled; `false` otherwise.
   */
  isErrorEnabled () {
    return this.isLevelEnabled(DefaultLevels.error);
  },

  /**
   * @public
   * @function
   * @memberof log.logger
   * @since 1.0.0
   *
   * Logs a fatal message.
   *
   * @param {string} message - the message to be logged.
   * @param {arguments} arguments - the replace arguments of the message.
   */
  fatal (message) {
    log(this, DefaultLevels.fatal, message, slice.call(arguments, 1));
  },

  /**
   * @public
   * @function
   * @memberof log.logger
   * @since 1.0.0
   *
   * Determines if the fatal level is enabled based off of the current logger level.
   *
   * @returns {boolean} `true` if fatal level is enabled; `false` otherwise.
   */
  isFatalEnabled () {
    return this.isLevelEnabled(DefaultLevels.fatal);
  },

  /**
   * @public
   * @function
   * @memberof log.logger
   * @since 1.0.0
   *
   * Starts/Stops a profile session.
   *
   * @param {(string|int)} id - the id of the session.
   */
  profile (id) {

  }
}, ExtensionPoints.ENUMERABLE);

module.exports = {
  /**
   * @public
   * @constructor
   * @memberof log.logger
   * @since 1.0.0
   *
   * Represents a logger.
   *
   * @param {LoggerSettings} [settings] - the settings to be used to configure the logger.
   */
  'Logger': Logger,

  /**
   * @public
   * @constructor
   * @memberof log.logger
   * @since 1.0.0
   *
   * Represents a logging event inside the logger.
   */
  'LogEvent': LogEvent,

  /**
   * @public
   * @constant
   * @memberof log.logger
   * @since 1.0.0
   *
   * Supported logger formats.
   */
  'Format': Format
};
