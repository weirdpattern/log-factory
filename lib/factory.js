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
import Filter from './filters/filter';
import { defaults, normalize, isPlainObject, toCamelCase } from './common/utils';

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
  settings.levels = settings.levels || [];
  settings.levels = Array.isArray(settings.levels) ? settings.levels : [ settings.levels ];
  settings.levels = settings.levels.reduce((levels, level) => {
    if (level && typeof level === 'string') {
      if (!hasOwnProperty.call(configuration.levels, level)) {
        report(`Level ${level} is not registered`);
        return levels;
      }

      levels.push(configuration.levels[ level ]);
    }

    return levels;
  }, []);

  settings.filters = settings.filters || [];
  settings.filters = Array.isArray(settings.filters) ? settings.filters : [ settings.filters ];
  settings.filters = settings.filters.reduce((filters, filter) => {
    if (filter == null) return filters;

    if (filter && typeof filter === 'string') {
      if (!hasOwnProperty.call(configuration.filters, filter)) {
        report(`Filter ${filter} is not registered`);
        return filters;
      }

      filters.push(configuration.filters[ filter ]);
    } else if (isPlainObject(filter)) {
      filters.push(Filter.create(filter));
    }
  }, []);
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
        return this.prospects;
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
  if (settings.defaultLevels === true) {
    configuration.levels = DefaultLevels;
  } else if (Array.isArray(settings.defaultLevels)) {
    configuration.levels = settings.defaultLevels.reduce((levels, level) => {
      if (typeof level === 'string' && hasOwnProperty.call(DefaultLevels, level)) {
        levels[ level ] = DefaultLevels[ level ];
      }
      return levels;
    }, {});
  } else if (settings.defaultLevels !== false) {
    report('"defaultLevels" must be a true (to include all), false (to exclude all) or ' +
      'an array of strings (to include individually)');
  }

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

  if (settings.level == null) {
    report('No default level specified');
  }

  configuration.level = settings.level == null
                      ? DefaultLevels.off
                      : configuration.levels[ toCamelCase(settings.level) ];

  if (settings.filters != null) {
    if (isPlainObject(settings.filters)) {
      Object.keys(settings.filters).forEach((filter) => {
        if (!hasOwnProperty.call(configuration.filters, filter)) {
          try {
            configuration.filters[ toCamelCase(filter) ] = Filter.create(explode(settings.filters[ filter ], reporter));
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
export function hasLogger (name) {
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
export function getLogger (name, settings) {
  name = typeof name !== 'string' ? 'default' : name;

  if (!hasLogger(name)) {

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
