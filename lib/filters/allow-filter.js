/**
 * @module log.filter
 */

'use strict';

const utils = require('../common/utils');
const util = require('util');
const filter = require('./filter');
const Filter = filter.Filter;
const FilterResults = filter.FilterResults;
const ExtensionPoints = utils.ExtensionPoints;

/*
 * @private
 * @constructor
 * @see {@link log.filter#AllowFilter}
 */
function AllowFilter () {
  Filter.call(this);
}

util.inherits(AllowFilter, Filter);

utils.extend(AllowFilter.prototype, {
  /*
   * @see {@link log.filter.Filter#test}
   */
  test () {
    return FilterResults.ALLOW;
  }
}, ExtensionPoints.ENUMERABLE);

/**
 * @public
 * @constructor
 * @memberof log.filter
 * @since 1.0.0
 *
 * Represents a filter that always allows the log event.
 */
module.exports = AllowFilter;
