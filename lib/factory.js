/**
 * @module log
 * @author Patricio Trevino
 */

import fs from 'fs';
import path from 'path';
// import off from '../levels/off';
// import audit from '../levels/audit';
// import debug from '../levels/debug';
// import info from '../levels/info';
// import warn from '../levels/warn';
// import error from '../levels/error';
// import fatal from '../levels/fatal';
import { defaults, normalize } from './common/utils';

/*
 * Shorthand methods.
 */
const hasOwnProperty = Object.prototype.hasOwnProperty;

/*
 * @private
 *
 * The default levels.
 */
// const defaultLevels = {
//  off,
//  audit,
//  debug,
//  info,
//  warn,
//  error,
//  fatal
// };

/*
 * @private
 *
 * The default logger settings.
 */
const defaultConfiguration = {
  'level': 'debug',
  'useDefaultLevels': true,
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
 * @constant
 *
 * The configuration of the module.
 */
const configuration = load();

/*
 * @private
 * @function
 *
 * Loads a single file.
 * The way settings are loaded depends on whether the file in question is a package.json file or
 * a .logwizrc file.
 */
function loadFile (filename) {
  try {
    if (filename != null && fs.lstatSync(filename).isFile()) {
      let settings = JSON.parse(fs.readFileSync(filename, 'utf-8'));

      let parsed = path.parse(filename);
      if (parsed.name === 'package' && parsed.ext === '.json') {
        settings = settings.logwiz;
        if (settings == null) {
          console.warn('package.json loaded, but no logwiz configuration found (using defaults)');
          settings = defaultConfiguration;
        }
      }

      return settings;
    }
  } catch (err) {
    console.warn(`Ignoring file "${filename}" due to problem reading it.`);
    console.warn(err);
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
 */
export function load (filename, options) {
  filename = typeof filename === 'string' ? normalize(filename) : null;
  options = defaults({}, options, {
    'cwd': process.cwd(),
    'match': 'single',
    'recursive': true,
    'prospects': ['.logwizrc', 'package.json']
  });

  let settings = loadFile(filename);
  if (settings == null) {
    const filenames = [];

    let depleted = false;
    let directory = normalize(options.cwd);
    do {
      try {
        fs.readdirSync(directory)
          .filter((file) => options.prospects.indexOf(file) > -1 && fs.statSync(file).isFile())
          .sort()
          .forEach((file) => {
            filenames.push(path.join(directory, file));
          });
      } catch (err) {
        console.warn(`Ignoring directory "${directory}" due to problem reading it.`);
        console.warn(err);
      }

      depleted = options.recursive ? directory === path.dirname(directory) : true;
      directory = path.dirname(directory);
    } while (!depleted);

    while (filenames.length > 0) {
      settings = defaults({}, settings, loadFile(filenames.shift()));
      if (options.match.toLowerCase() === 'single') {
        break;
      }
    }
  }

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
 */
export function configure (settings) {

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

  return configuration.loggers[name];
}
