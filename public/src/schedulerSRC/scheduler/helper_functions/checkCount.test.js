const { checkCount } = require('./checkCount');

test('01', () => {
  expect(checkCount([0, 0, 0, 0, 2, 2, -1], 5)).toBe(2);
});

test('02', () => {
  expect(checkCount([0, 0, 0, 0, 2, 2, -1], 3)).toBe(4);
});

test('03', () => {
  expect(checkCount([0, 0, 0, 0, 2, 2, -1], 3, true)).toStrictEqual([4, 0]);
});

test('04', () => {
  expect(checkCount([1, 0, 0, 0, 2, 2, -1], 3, true)).toStrictEqual([3, 1]);
});
