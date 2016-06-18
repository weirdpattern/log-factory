import test from 'tape';
import { toCamelCase } from '../../lib/common/utils';

test('function toCamelCase', (assert) => {
  assert.comment('string - single character lowercase');
  assert.equals(toCamelCase('a'), 'a', 'string must match');

  assert.comment('string - single character uppercase');
  assert.equals(toCamelCase('A'), 'a', 'string must match');

  assert.comment('string - single word lowercase');
  assert.equals(toCamelCase('tests'), 'tests', 'string must match');

  assert.comment('string - single word uppercase');
  assert.equals(toCamelCase('TESTS'), 'tests', 'string must match');

  assert.comment('string - single word mixed case');
  assert.equals(toCamelCase('TeSTs'), 'teSTs', 'string must match');

  assert.comment('string - two words separated by _');
  assert.equals(toCamelCase('test_one'), 'testOne', 'string must match');

  assert.comment('string - two words separated by .');
  assert.equals(toCamelCase('test.one'), 'testOne', 'string must match');

  assert.comment('string - two words separated by -');
  assert.equals(toCamelCase('test-one'), 'testOne', 'string must match');

  assert.comment('string - two words separated by <whitespace>');
  assert.equals(toCamelCase('test one'), 'testOne', 'string must match');

  assert.comment('string - two words containing 1 uppercase');
  assert.equals(toCamelCase('testOne_two'), 'testOneTwo', 'string must match');

  assert.comment('string - two words containing multiple uppercase');
  assert.equals(toCamelCase('testOne_TWo'), 'testOneTwo', 'string must match');

  assert.comment('string - two words containing 1 uppercase');
  assert.equals(toCamelCase('testOne.two'), 'testOneTwo', 'string must match');

  assert.comment('string - two words containing multiple uppercase');
  assert.equals(toCamelCase('testOne.TWo'), 'testOneTwo', 'string must match');

  assert.comment('string - two words containing 1 uppercase');
  assert.equals(toCamelCase('testOne-two'), 'testOneTwo', 'string must match');

  assert.comment('string - two words containing multiple uppercase');
  assert.equals(toCamelCase('testOne-TWo'), 'testOneTwo', 'string must match');

  assert.comment('string - two words containing 1 uppercase');
  assert.equals(toCamelCase('testOne two'), 'testOneTwo', 'string must match');

  assert.comment('string - two words containing multiple uppercase');
  assert.equals(toCamelCase('testOne TWo'), 'testOneTwo', 'string must match');

  assert.comment('array - two words');
  assert.equals(toCamelCase('test', 'one'), 'testOne', 'string must match');

  assert.comment('array - two words with separators');
  assert.equals(toCamelCase('test', '-one'), 'testOne', 'string must match');
  assert.equals(toCamelCase('test', '-on-e'), 'testOnE', 'string must match');

  assert.end();
});
