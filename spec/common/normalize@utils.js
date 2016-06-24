/**
 * @author Patricio Trevino
 */

import os from 'os';
import path from 'path';

export default function (test, normalize) {
  test('normalize function', (assert) => {
    assert.comment('normalizing ~');
    assert.equals(normalize('~/Test'), path.join(os.homedir(), 'Test'), 'paths must match');

    assert.comment('normalizing .');
    assert.equals(normalize('./Test'), path.resolve(process.cwd(), 'Test'), 'paths must match');
    assert.equals(normalize('./Test', '/Users/'), path.resolve('/Users/', 'Test'), 'paths must match');

    assert.comment('normalizing ..');
    assert.equals(normalize('../Test'), path.resolve(process.cwd(), '..', 'Test'), 'paths must match');
    assert.equals(normalize('../Test', '/Users/'), path.resolve('/Users/', '..', 'Test'), 'paths must match');

    assert.comment('normalizing in between');
    assert.equals(normalize('../Test/Test/Test/..'), path.resolve(process.cwd(), '..', 'Test', 'Test', 'Test', '..'),
      'paths must match');
    assert.equals(normalize('../Test/../Test/', '/Users/'), path.resolve('/Users/', '..', 'Test', '..', 'Test'),
      'paths must match');

    assert.comment('normalizing empty');
    assert.equals(normalize(''), '', 'path must be empty');

    assert.comment('normalizing other than strings');
    assert.equals(normalize(1), '', 'path must be empty');
    assert.equals(normalize(true), '', 'path must be empty');
    assert.equals(normalize({}), '', 'path must be empty');
    assert.equals(normalize([]), '', 'path must be empty');
  });
}
