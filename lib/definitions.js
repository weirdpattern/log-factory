/**
 * @author Patricio Trevino
 */

/**
 * @typedef {Object} FactorySettings
 */

/**
 * @typedef {Object} LoggerSettings
 * @property {(log.level.Level|string|int)} level - the level of the logger.
 * @property {Array<log.level.Level|Object>} levels - the new levels to be added in order to extend the logger.
 * @property {Array<log.channel.Channel|Object>} channels - the channels to be added.
 */

/**
 * @typedef {Object} LevelFilterSettings
 * @property {boolean} deny - a flag that determines if the filter should deny in case of a mismatch (true by default).
 * @property {boolean} locked - a flag that determines if the filter should allow modifications.
 */

/**
 * @typedef {Object} LevelRangeFilterSettings
 * @property {boolean} deny - a flag that determines if the filter should deny in case of a mismatch (true by default).
 * @property {boolean} locked - a flag that determines if the filter should allow modifications.
 */

/**
 * @typedef {Object} LevelThresholdFilterSettings
 * @property {boolean} deny - a flag that determines if the filter should deny in case of a mismatch (true by default).
 */
