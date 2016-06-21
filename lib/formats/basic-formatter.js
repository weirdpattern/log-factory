/**
 * @module log.format
 */

import util from 'util';
import Formatter from './formatter';

function BasicFormatter () {
  Formatter.call(this);
}

util.inherits(BasicFormatter, Formatter);

export default BasicFormatter;
