/**
 * @module log
 * @author Patricio Trevino
 */

import fs from 'fs';
import path from 'path';
import all from './levels/all';
import off from './levels/off';
import audit from './levels/audit';
import debug from './levels/debug';
import info from './levels/info';
import warn from './levels/warn';
import error from './levels/error';
import fatal from './levels/fatal';
import Level from './levels/level';
import * as FilterFactory from './filters/filter-factory';
import * as ChannelFactory from './channels/channel-factory';
import { defaults, flatten, normalize, isPlainObject, toCamelCase } from './common/utils';

/*
 * Shorthand methods.
 */
const hasOwnProperty = Object.prototype.hasOwnProperty;

/*
 * @private
 * @constant
 *
 * The report type to be logged.
 */
const ReportLevel = {
  'LOG': 0,
  'WARN': 1,
  'ERROR': 2
};

/*
 * @private
 * @constant
 *
 * The default levels.
 */
const DefaultLevels = {
  off,
  audit,
  debug,
  info,
  warn,
  error,
  fatal,
  all
};

/*
 * @private
 * @constant
 *
 * The default logger settings.
 */
const DefaultSettings = {
  'strict': true,
  'level': 'off',
  'defaultLevels': true,
  'channels': {
    'console': {
      'type': 'console-channel',
      'out': 'stdout',
      'err': 'stdout',
      'colorize': true
    }
  }
};

/*
 * @private
 *
 * The configuration of the module.
 */
const configuration = {
  'level': null,
  'levels': {},
  'filters': {},
  'channels': {},
  'loggers': {}
};

/*
 * @private
 * @function
 *
 * Creates a reporter.
 *
 * @param {boolean} [strict=true] - a flag indicating whether the reporter must log a warning or throw an error.
 * @returns {Function} a function to be used to report errors.
 */
function reporter (strict) {
  return (message, level) => {
    if (strict === false) {
      if (level === ReportLevel.LOG) {
        console.log(message);
      } else if (level === ReportLevel.ERROR) {
        console.error(message);
      } else {
        console.warn(message);
      }
    } else {
      if (level === ReportLevel.LOG) {
        console.log(message);
      } else {
        throw new Error(message);
      }
    }
  };
}

/*
 * @private
 * @function
 *
 * Replaces references for well-known settings.
 *
 * @param {Object} settings - the settings to be exploded.
 * @param {Function} report - the reporter function to be used.
 */
function explode (settings, report) {
  const reducers = {
    'prepare': (settings) => {
      settings = settings || [];
      settings = Array.isArray(settings) ? flatten(settings) : [ settings ];
    },
    'strings': (accumulator, current, source, type) => {
      if (current && typeof current === 'string') {
        if (hasOwnProperty.call(source, current)) {
          accumulator.push(source[ current ]);
        } else {
          report(`${type} ${current} is not registered`);
        }
        return true;
      }
      return false;
    },
    'objects': (accumulator, current, source, type, factory) => {
      if (factory && isPlainObject(current)) {
        Object.keys(current)
              .forEach((key) => {

              });

        source.push(factory.get(current.type, current));
        return true;
      }
      return false;
    }
  };

  const reduce = (settings, source, type, factory) => {
    settings = reducers.prepare(settings);
    settings = settings.reduce((accumulator, current) => {
      if (!reducers.strings(accumulator, current, source, type)) {
        if (!reducers.objects(accumulator, current, source, type, factory)) {
          report(`Unexpected type: ${type}s must be defined as string references or plain objects`);
        }
      }
      return accumulator;
    }, []);
  };

  settings.levels && reduce(settings.levels, configuration.levels, 'level');
  settings.filters && reduce(settings.filters, configuration.filters, 'filter', FilterFactory);
  settings.channels && reduce(settings.channels, configuration.channels, 'channel', ChannelFactory);
  // settings.loggers && reduce(settings.loggers, configuration.loggers, 'logger', LoggerFactory);

  return settings;
}

/*
 * @private
 * @function
 *
 * Loads a single file.
 * The way settings are loaded depends on whether the file in question is a package.json file or a .logwizrc file.
 *
 * @param {string} filename - the file to be loaded.
 * @param {Function} report - the reporter function to be used.
 * @returns {Object} the loaded json file or null if not loadable.
 * @throws {Error} when strict mode is enabled and the file cannot be loaded due to an IO error.
 */
function loadFile (filename, report) {
  try {
    if (filename != null && fs.lstatSync(filename).isFile()) {
      let settings = JSON.parse(fs.readFileSync(filename, 'utf-8'));

      let parsed = path.parse(filename);
      if (parsed.name === 'package' && parsed.ext === '.json') {
        settings = settings.logwiz;
        if (settings == null) {
          report('package.json loaded, but no logwiz configuration found (using defaults)', ReportLevel.LOG);
          settings = DefaultSettings;
        }
      }

      return settings;
    }
  } catch (err) {
    report(`Ignoring file "${filename}" due to problem reading it.`);
    report(err);
  }

  return null;
}

/*
 * @private
 * @function
 *
 * Loads the default levels into the configuration.
 *
 * @param {FactorySettings} settings - the configuration settings.
 * @param {Function} report - the reporter function to be used.
 * @throws {Error} when strict mode is enabled and settings.defaultLevels is not a boolean or array.
 * @throws {Error} when strict mode is enabled and levels are not reported as strings.
 */
function configureDefaultLevels (settings, report) {
  if (settings.defaultLevels === true) {
    configuration.levels = DefaultLevels;
  } else if (Array.isArray(settings.defaultLevels)) {
    configuration.levels = flatten(settings.defaultLevels).reduce((levels, level) => {
      if (typeof level === 'string' && hasOwnProperty.call(DefaultLevels, level)) {
        levels[ level ] = DefaultLevels[ level ];
      } else {
        report('Unexpected type: default levels must be defined as string references');
      }
      return levels;
    }, {});
  } else if (settings.defaultLevels !== false) {
    report('"defaultLevels" must be a true (to include all), false (to exclude all) or ' +
      'an array of strings (to include individually)');
  }
}

/*
 * @private
 * @function
 *
 * Loads the levels into the configuration.
 *
 * @param {FactorySettings} settings - the configuration settings.
 * @param {Function} report - the reporter function to be used.
 * @throws {Error} when strict mode is enabled and settings.levels is not a plain object.
 * @throws {Error} when strict mode is enabled and a duplicate level is found.
 * @throws {Error} when strict mode is enabled and the level configuration is incorrect.
 */
function configureLevels (settings, report) {
  if (settings.levels != null) {
    if (isPlainObject(settings.levels)) {
      Object.keys(settings.levels).forEach((level) => {
        if (!hasOwnProperty.call(configuration.levels, level)) {
          try {
            configuration.levels[ toCamelCase(level) ] = Level.create(level, settings.levels[ level ]);
          } catch (err) {
            report(err);
          }
        } else {
          report(`Level ${level} already exists`);
        }
      });
    } else {
      report('"levels" must be a plain object');
    }
  }
}

/*
 * @private
 * @function
 *
 * Loads the default level into the configuration.
 *
 * @param {FactorySettings} settings - the configuration settings.
 * @param {Function} report - the reporter function to be used.
 * @throws {Error} when strict mode is enabled and not default level is found.
 * @throws {Error} when strict mode is enabled and the default level is not a string.
 * @throws {Error} when strict mode is enabled and the provided default level is not defined.
 */
function configureLevel (settings, report) {
  if (settings.level == null || typeof settings.level !== 'string') {
    report('Default level not specified or specified with an unexpected type');
    configuration.level = DefaultLevels.off;
  } else {
    if (hasOwnProperty.call(configuration.levels, toCamelCase(settings.level))) {
      configuration.level = configuration.levels[ toCamelCase(settings.level) ];
    } else {
      report(`Default level ${settings.level} not defined`);
    }
  }
}

/*
 * @private
 * @function
 *
 * Loads the filters into the configuration.
 *
 * @param {FactorySettings} settings - the configuration settings.
 * @param {Function} report - the reporter function to be used.
 * @throws {Error} when strict mode is enabled and settings.filters is not a plain object.
 * @throws {Error} when strict mode is enabled and a duplicate filter is found.
 * @throws {Error} when strict mode is enabled and the filter configuration is incorrect.
 */
function configureFilters (settings, report) {
  if (settings.filters != null) {
    if (isPlainObject(settings.filters)) {
      Object.keys(settings.filters).forEach((filter) => {
        if (!hasOwnProperty.call(configuration.filters, filter)) {
          try {
            configuration.filters[ toCamelCase(filter) ] = FilterFactory.get(
              toCamelCase(filter),
              explode(settings.filters[ filter ], reporter)
            );
          } catch (err) {
            report(err);
          }
        } else {
          report(`Filter ${filter} already exists`);
        }
      });
    } else {
      report('"filters" must be a plain object');
    }
  }
}

/*
 * @private
 * @function
 *
 * Loads the channels into the configuration.
 *
 * @param {FactorySettings} settings - the configuration settings.
 * @param {Function} report - the reporter function to be used.
 * @throws {Error} when strict mode is enabled and settings.channels is not a plain object.
 * @throws {Error} when strict mode is enabled and a duplicate channel is found.
 * @throws {Error} when strict mode is enabled and the channel configuration is incorrect.
 */
/*
function configureChannels (settings, report) {
  if (settings.channels != null) {
    if (isPlainObject(settings.channels)) {
      Object.keys(settings.channels).forEach((channel) => {
        if (!hasOwnProperty.call(configuration.channels, channel)) {
          try {
            configuration.channels[ toCamelCase(channel) ] = ChannelFactory.get(
              toCamelCase(channel),
              explode(settings.channels[ channel ], reporter)
            );
          } catch (err) {
            report(err);
          }
        } else {
          report(`Channel ${channel} already exists`);
        }
      });
    } else {
      report('"channels" must be a plain object');
    }
  }
}
*/

/**
 * @static
 * @public
 * @function
 * @memberof log
 * @since 1.0.0
 *
 * Loads a configuration file.
 *
 * @param {string} [filename] - the file to be loaded.
 * @param {FactoryOptions} [options] - the options to be used to load the factory.
 * @throws {Error} when strict mode is enabled and the directory or file cannot be loaded due to an IO error.
 */
export function load (filename, options) {
  filename = typeof filename === 'string' ? normalize(filename) : null;
  options = defaults({}, options, {
    'cwd': process.cwd(),
    'strict': true,
    'recursive': true,
    'prospects': [ '.logwizrc', 'package.json' ],
    'getProspects': function () {
      if (Array.isArray(this.prospects)) {
        return flatten(this.prospects);
      } else if (typeof this.prospects !== 'string') {
        return [ '.logwizrc', 'package.json' ];
      }
      return [ this.prospects ];
    }
  });

  const report = reporter(options.strict !== false);
  let settings = loadFile(filename, report);
  if (settings == null) {
    const filenames = [];

    let depleted = false;
    let directory = normalize(options.cwd);

    do {
      try {
        fs.readdirSync(directory)
          .filter((file) => options.getProspects().indexOf(file) > -1 && fs.statSync(file).isFile())
          .sort()
          .forEach((file) => {
            filenames.push(path.join(directory, file));
          });
      } catch (err) {
        report(`Ignoring directory "${directory}" due to problem reading it.`);
        report(err);
      }

      depleted = options.recursive ? directory === path.dirname(directory) : true;
      directory = path.dirname(directory);
    } while (!depleted);

    while (filenames.length > 0) {
      settings = defaults({}, settings, loadFile(filenames.shift(), report));
    }
  }

  settings.strict = options.strict;
  configure(settings);
}

/**
 * @static
 * @public
 * @function
 * @memberof log
 * @since 1.0.0
 *
 * Configures the factory.
 *
 * @param {FactorySettings} [settings] - the configuration settings.
 * @param {boolean} [override=false] - a flag indicating if configurations must be overridden.
 * @throws {Error} when strict mode is enabled and the settings are invalid.
 * @throws {Error} when strict mode is enabled and duplicate levels are found.
 */
export function configure (settings, override) {
  if (configuration.loaded && override !== true) return;

  settings = defaults({}, settings, DefaultSettings);

  const report = reporter(settings.strict !== false);
  configureDefaultLevels(settings, report);
  configureLevels(settings, report);
  configureLevel(settings, report);
  configureFilters(settings, report);
  // configureChannels(settings, report);
  // configureLoggers(settings, report);
}

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
export function has (name) {
  return hasOwnProperty.call(configuration.loggers, name);
}

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
export function get (name, settings) {
  name = typeof name !== 'string' ? 'default' : name;

  if (!has(name)) {

  }

  return configuration.loggers[ name ];
}

/**
 * @static
 * @public
 * @function
 * @memberof log
 * @since 1.0.0
 *
 * Gets a copy of the logger configuration.
 *
 * @returns {Object} a clone of the logger configuration.
 */
export function getConfiguration () {
  return Object.assign({}, configuration);
}

// loads the configuration
load();
