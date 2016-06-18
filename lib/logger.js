/**
 * @module log.logger
 */

import util from 'util';
import offl from './levels/off';
import auditl from './levels/audit';
import debugl from './levels/debug';
import infol from './levels/info';
import warnl from './levels/warn';
import errorl from './levels/error';
import fatall from './levels/fatal';

import EventEmitter from 'events';
import Level from './levels/level';

import { extend, toCamelCase } from 'common/utils';

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

/**
 * @public
 * @constant
 * @memberof log.logger
 * @since 1.0.0
 *
 * Supported logger formats.
 */
export const Format = {
  'SIMPLE'  : 1,
  'EXTENDED': 2
};

function log(logger, level, message, replacements) {
  if (level >= logger.level && logger.level !== offl) {


    logger.emit('log', level, message);
    logger.emit('log:' + level.name, message);
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
function build(logger) {
  const defined = [ 'level' ].every((property) => property in logger);
  if (!defined) {
    extend(logger, {
      'level': {
        get() { return this.level; },
        set(candidate) { this.level = getLevel(candidate, logger._levels); }
      },
      'format': {
        get() { return this.format; },
        set(candidate) { this.format = getFormat(candidate); }
      }
    }, extend.ENUMERABLE | extend.GETTER | extend.SETTER);

    extend(logger, {
      '_levels': {
        [offl.name]: offl,
        [auditl.name]: auditl,
        [debugl.name]: debugl,
        [infol.name]: infol,
        [warnl.name]: warnl,
        [errorl.name]: errorl,
        [fatall.name]: fatall
      }
    }, extend.WRITABLE);
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
function getLevel(candidate, pool) {
  candidate = candidate || offl;

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
function getFormat(candidate) {
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

/**
 * @public
 * @constructor
 * @memberof log.logger
 * @since 1.0.0
 * 
 * Represents a logger.
 * 
 * @param {LoggerOptions} [options] - the options to be used to configure the logger.
 */
function Logger(options) {
  EventEmitter.call(this);
  this.configure(options);
}

util.inherits(Logger, EventEmitter);

extend(Logger.prototype, {
  /**
   * @public
   * @function
   * @memberof log.logger
   * @since 1.0.0
   *
   * Configures and initializes the logger.
   *
   * @param {LoggerOptions} options
   */
  configure(options) {
    options = options || {};

    build(this, options);

    this.level = options.level;
    this.format = options.format;

    this._levels = this._levels.concat(
      (options.levels || []).filter((level) => level instanceof Level)
                            .map((level) => {
                              if (!hasOwnProperty.call(this, toCamelCase(level.name))) {
                                extend(this, {
                                  [toCamelCase(level.name)]: function(message) {
                                    log(this, level, message, slice.call(arguments, 1))
                                  }
                                });
                              }
                              return level;
                            })
    );


  },

  audit(message) {
    log(this, auditl, message, slice.call(arguments, 1));
  },

  debug(message) {
    log(this, debugl, message, slice.call(arguments, 1));
  },

  info(message) {
    log(this, infol, message, slice.call(arguments, 1));
  },

  warn(message) {
    log(this, warnl, message, slice.call(arguments, 1));
  },

  error(message) {
    log(this, errorl, message, slice.call(arguments, 1));
  },

  fatal(message) {
    log(this, fatall, message, slice.call(arguments, 1));
  },

  profile(id) {

  }
}, extend.ENUMERABLE);

export default Logger;

/**
 * @typedef {Object} LoggerOptions
 * @property {(int|string)} format - the format of the logger.
 * @property {(log.level.Level|string|int)} level - the level of the logger.
 * @property {Array<log.level.Level>} levels - the new levels to be added in order to extend the logger.
 */