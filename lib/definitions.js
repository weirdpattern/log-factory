/**
 * @author Patricio Trevino
 */

/**
 * @typedef {Object} FactoryOptions
 * @property {string} [cwd=process.cwd()] - the path where to start looking for files.
 * @property {boolean} [strict=true] - a flag indicating whether logwiz will throw an exception if something happens
 *                                     during loading or if the settings are incorrect.
 * @property {boolean} [recursive=true] - a flag indicating whether logwiz must recursively search parent folders
 *                                        to find the prospect files.
 * @property {(Array.<string>|string)} [prospects=['.logwizrc', 'package.json']] - the prospect files to be searched.
 */

/**
 * @typedef {Object} FactorySettings
 * @property {boolean} [strict=true] - a flag indicating whether logwiz will throw an exception if something happens
 *                                     during loading or if the settings are incorrect.
 * @property {(string|log.level#Level)} [level='off'] - the level to be used by default.
 * @property {(boolean|Array.<string>)} [defaultLevels=true] - a flag indicating whether default levels must be loaded or
 *                                                            an array with the names of the default levels to be
 *                                                            loaded.
 * @property {Object.<LevelSettings>} [levels] - the levels to be added.
 * @property {Object.<FilterSettings>} [filters] - the filters to be added.
 * @property {Object.<ChannelSettings>} [channels] - the channels to be added. ConsoleChannel is added by default
 *                                                   if no other channel is specified.
 */

/**
 * @typedef {Object} LevelSettings
 * @property {(number|string)} weight - the weight of the level.
 * @property {StyleSettings} [style] - the style settings to be used.
 */

/**
 * @typedef {Object} StyleSettings
 * @property {(number|string)} [foreground=Foregrounds.WHITE] - the foreground color to be used.
 * @property {(number|string)} [background=Backgrounds.BLACK] - the background color to be used.
 * @property {(int|string|Array.<(int|string)>)} [modifiers=Modifiers.NONE] - the modifiers to be used.
 *
 * @see {@link log.style#Foregrounds}
 * @see {@link log.style#Backgrounds}
 * @see {@link log.style#Modifiers}
 */

/**
 * @typedef {Object|LevelFilterSettings|LevelRangeFilterSettings|LevelThresholdFilterSettings} FilterSettings
 * @property {string} type - the type of filter to be created.
 */

/**
 * @typedef {Object} LevelFilterSettings
 * @property {(Array.<string>|string)} [levels] - the levels to be filtered.
 * @property {boolean} [deny=true] - a flag that determines if the filter should deny in case of a mismatch
 *                                   (true by default).
 * @property {boolean} [locked=false] - a flag that determines if the filter should allow modifications.
 */

/**
 * @typedef {Object} LevelRangeFilterSettings
 * @property {string} min - the min level to be filtered.
 * @property {string} max - the max level to be filtered.
 * @property {boolean} [deny=true] - a flag that determines if the filter should deny in case of a mismatch
 *                                   (true by default).
 * @property {boolean} [locked=false] - a flag that determines if the filter should allow modifications.
 */

/**
 * @typedef {Object} LevelThresholdFilterSettings
 * @property {string} level - the level to be filtered.
 * @property {boolean} [deny=true] - a flag that determines if the filter should deny in case of a mismatch
 *                                   (true by default).
 * @property {boolean} [locked=false] - a flag that determines if the filter should allow modifications.
 */

/**
 * @typedef {Object} ChannelSettings
 * @property {string} type - the type of channel to be created.
 * @property {Array.<string|FilterSettings>} [filters] - the filters to be used with this channel.
 */
