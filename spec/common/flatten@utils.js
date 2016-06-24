/**
 * @author Patricio Trevino
 */

export default function (test, flatten) {
  test('flatten function', (assert) => {
    const array3length = [[1], [2, 3, 4], [5, [6]]];
    const array2length = [7, [8, 9]];

    assert.comment('flatten single argument');
    assert.equals(array3length.length, 3, 'array length must be 3');
    assert.equals(flatten(array3length).length, 6, 'array length after flatten must be 6');

    assert.comment('flatten multiple arguments');
    assert.equals(flatten(array3length, array2length).length, 9, 'array length after flatten must be 9');
  });
}
