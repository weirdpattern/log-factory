/**
 * @author Patricio Trevino
 */

export default function (test, defaults) {
  test('defaults function', (assert) => {
    let target;
    let oneLevel = {
      'one': 1,
      'two': 2
    };

    let twoLevels = {
      'one': {
        'onea': 1,
        'oneb': 2,
        'onec': 3
      },
      'four': {
        'twoa': 1,
        'twob': 2
      }
    };

    let threeLevels = {
      'one': {
        'onea': {
          'oneaa': 1
        },
        'oneb': 2,
        'onec': 3
      },
      'three': {
        'twoa': 1,
        'twob': {
          'twoba': 1,
          'twobb': 2
        }
      }
    };

    let withArrays = {
      'one': [ 1, 2, 3, 4 ],
      'two': [ 'a', 'b' ],
      'three': {
        'threea': [ 1 ],
        'threeb': [ 'a', 2, 'c' ]
      }
    };

    let withArraysAndObjects = {
      'one': [ 1, 2, 3, 4, 5, 6 ],
      'two': [ 'a', 'b' ],
      'three': {
        'threea': [ 1 ],
        'threeb': [ 'a', 2, {
          'threeba': [ 1 ],
          'threebb': {
            'threebba': 1
          }
        } ]
      }
    };

    assert.comment('single source');

    target = defaults({}, oneLevel);
    assert.deepEquals(target, oneLevel, 'target and oneLevel must match');

    target = defaults({}, twoLevels);
    assert.deepEquals(target, twoLevels, 'target and twoLevels must match');

    target = defaults({}, threeLevels);
    assert.deepEquals(target, threeLevels, 'target and threeLevels must match');

    target = defaults({}, withArrays);
    assert.deepEquals(target, withArrays, 'target and withArrays must match');

    target = defaults({}, withArraysAndObjects);
    assert.deepEquals(target, withArraysAndObjects, 'target and withArraysAndObjects must match');

    assert.comment('multiple sources');

    target = defaults({}, oneLevel, twoLevels);
    assert.deepEquals(target, {
      'one': 1,
      'two': 2,
      'four': {
        'twoa': 1,
        'twob': 2
      }
    }, 'target and oneLevel+twoLevels must match');

    target = defaults({}, withArrays, withArraysAndObjects);
    assert.deepEquals(target, {
      'one': [ 1, 2, 3, 4, 5, 6 ],
      'two': [ 'a', 'b' ],
      'three': {
        'threea': [ 1 ],
        'threeb': [ 'a', 2, 'c' ]
      }
    }, 'target and withArrays+withArraysAndObjects must match');

    target = defaults({}, threeLevels, withArraysAndObjects);
    assert.deepEquals(target, {
      'one': {
        '0': 1,
        '1': 2,
        '2': 3,
        '3': 4,
        '4': 5,
        '5': 6,
        'onea': {
          'oneaa': 1
        },
        'oneb': 2,
        'onec': 3
      },
      'two': [ 'a', 'b' ],
      'three': {
        'threea': [ 1 ],
        'threeb': [ 'a', 2, {
          'threeba': [ 1 ],
          'threebb': {
            'threebba': 1
          }
        } ],
        'twoa': 1,
        'twob': {
          'twoba': 1,
          'twobb': 2
        }
      }
    }, 'target and threeLevels+withArraysAndObjects must match');
  });
}
