import path from 'path';
import all from '../lib/levels/all';
import off from '../lib/levels/off';
import audit from '../lib/levels/audit';
import debug from '../lib/levels/debug';
import info from '../lib/levels/info';
import warn from '../lib/levels/warn';
import error from '../lib/levels/error';
import fatal from '../lib/levels/fatal';
import Level from '../lib/levels/level';
import Style, { Foregrounds, Backgrounds, Modifiers } from '../lib/styles/style';

export default function (test, factory) {
  test('factory object', (assert) => {
    const defaultConfiguration = {
      'level': off,
      'levels': {
        off,
        audit,
        debug,
        info,
        warn,
        error,
        fatal,
        all
      },
      'filters': {},
      'channels': {},
      'loggers': {}
    };

    assert.comment('loaded with default configuration');
    assert.deepEquals(factory.getConfiguration(), defaultConfiguration, 'default configuration should have been loaded');

    factory.load(path.resolve(__dirname, 'resources/config1.json'));
    const defaultFileConfiguration = {
      'level': debug,
      'levels': {
        off,
        audit,
        debug,
        info,
        warn,
        error,
        fatal,
        all,
        'debugMedium': new Level('debug-medium', 1050, new Style(Foregrounds.GRAY, Backgrounds.BLACK, Modifiers.BOLD))
      },
      'filters': {},
      'channels': {},
      'loggers': {}
    };

    assert.comment('loading a configuration file');
    assert.deepEquals(factory.getConfiguration(), defaultFileConfiguration, 'file configuration should have been loaded');
  });
}
