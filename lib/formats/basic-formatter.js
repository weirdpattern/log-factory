/**
 * @module log.format
 * @author Patricio Trevino
 */

import util from 'util';
import Formatter from './formatter';

export default function BasicFormatter () {
  Formatter.call(this);
}

util.inherits(BasicFormatter, Formatter);
