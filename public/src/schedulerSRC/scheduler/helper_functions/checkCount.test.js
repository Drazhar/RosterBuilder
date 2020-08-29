const { checkCount } = require('./checkCount');

test('01', () => {
  expect(checkCount([0, 0, 0, 0, 2, 2, -1], 5)).toBe(2);
});

test('02', () => {
  expect(checkCount([0, 0, 0, 0, 2, 2, -1], 3)).toBe(4);
});
