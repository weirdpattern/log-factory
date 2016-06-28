/**
 * @module log.channel
 * @author Patricio Trevino
 */

import util from 'util';
import Channel from './channel';
import { ExtensionPoints, extend } from '../common/utils';

/**
 * @public
 * @enum {number}
 * @memberof log.channel
 * @since 1.0.0
 *
 * Represents the valid outputs in the console.
 */
export const ConsoleOutput = {
  'STDOUT': 0,
  'STDERR': 1
};

export default function ConsoleChannel (settings) {
  Channel.call(this, settings);
}

util.inherits(ConsoleChannel, Channel);

extend(Channel.prototype, {
  /*
   * @see {@link log.channel.Channel#applySettings}
   */
  send (event) {
    const message = this.formatter.format(event);
    if (this.output === ConsoleOutput.STDOUT) {
      process.stdout.write(message + this.eol);
    } else {
      process.stderr.write(message + this.eol);
    }
  }
}, ExtensionPoints.ENUMERABLE);

extend(Channel.prototype, {
  /*
   * @see {@link log.channel.Channel#applySettings}
   */
  applySettings (settings) {

  }
});
