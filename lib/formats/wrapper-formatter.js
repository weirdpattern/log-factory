/**
 * @module log.format
 * @author Patricio Trevino
 */

import util from 'util';
import Formatter from './formatter';

/**
 * @public
 * @constructor
 * @memberof log.format
 * @since 1.0.0
 *
 * Represents a formatter that wraps another formatter.
 *
 * @param {(log.format.Formatter|function)} format
 */
export default function WrapperFormatter (format) {
  Formatter.call(this);
}

util.inherits(WrapperFormatter, Formatter);
