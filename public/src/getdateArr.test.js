import { getDateArr } from './getDateArr';

test('Base case', () => {
  let result = getDateArr(
    new Date(Date.UTC(2020, 6, 1)),
    new Date(Date.UTC(2020, 6, 3))
  );

  expect(result).toStrictEqual([3, 4]);
});

test('Base case 2', () => {
  let result = getDateArr(
    new Date(Date.UTC(2020, 8, 1)),
    new Date(Date.UTC(2020, 8, 3))
  );

  expect(result).toStrictEqual([2, 3]);
});

test('Base case 3', () => {
  let result = getDateArr(
    new Date(Date.UTC(2020, 8, 30)),
    new Date(Date.UTC(2020, 9, 2))
  );

  expect(result).toStrictEqual([3, 4]);
});

test('Base case 4', () => {
  let result = getDateArr(
    new Date(Date.UTC(2020, 9, 11)),
    new Date(Date.UTC(2020, 9, 15))
  );

  expect(result).toStrictEqual([0, 1, 2, 3]);
});
