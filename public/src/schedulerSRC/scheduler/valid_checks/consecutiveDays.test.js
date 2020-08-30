import { validConsecutiveDays } from './consecutiveDays';

test('Min days off between shift blocks 01', () => {
  expect(
    validConsecutiveDays(
      5,
      0,
      [[0, 0, 1, 1, 0, 1]],
      [
        {
          consecutiveWorkingDays: {
            min: 2,
            max: 3,
          },
          minConsecutiveDaysOff: 2,
        },
      ]
    )
  ).toBe(false);
});

test('Min days off between shift blocks 02', () => {
  expect(
    validConsecutiveDays(
      5,
      0,
      [[0, 1, 1, 0, 0, 1]],
      [
        {
          consecutiveWorkingDays: {
            min: 2,
            max: 3,
          },
          minConsecutiveDaysOff: 2,
        },
      ]
    )
  ).toBe(true);
});

test('No shift switch 01', () => {
  expect(
    validConsecutiveDays(
      5,
      0,
      [[0, 0, 0, 2, 2, 1]],
      [
        {
          consecutiveWorkingDays: {
            min: 2,
            max: 3,
          },
          minConsecutiveDaysOff: 2,
        },
      ]
    )
  ).toBe(false);
});

test('No shift switch 02', () => {
  expect(
    validConsecutiveDays(
      5,
      0,
      [[2, 2, 0, 0, 0, 1]],
      [
        {
          consecutiveWorkingDays: {
            min: 2,
            max: 3,
          },
          minConsecutiveDaysOff: 2,
        },
      ]
    )
  ).toBe(true);
});

test('Not enough consecutive days 01', () => {
  expect(
    validConsecutiveDays(
      5,
      0,
      [[2, 2, 0, 0, 1, 0]],
      [
        {
          consecutiveWorkingDays: {
            min: 2,
            max: 3,
          },
          minConsecutiveDaysOff: 2,
        },
      ]
    )
  ).toBe(false);
});

test('Not enough consecutive days 02', () => {
  expect(
    validConsecutiveDays(
      5,
      0,
      [[0, 0, 0, 1, 1, 0]],
      [
        {
          consecutiveWorkingDays: {
            min: 2,
            max: 3,
          },
          minConsecutiveDaysOff: 2,
        },
      ]
    )
  ).toBe(true);
});

test('Not enough consecutive days 03', () => {
  expect(
    validConsecutiveDays(
      3,
      0,
      [[0, 1, 1, 0, -1, -1]],
      [
        {
          consecutiveWorkingDays: {
            min: 2,
            max: 3,
          },
          minConsecutiveDaysOff: 2,
        },
      ]
    )
  ).toBe(true);
});

test('Too many working days', () => {
  expect(
    validConsecutiveDays(
      4,
      0,
      [[0, 1, 1, 1, 1, -1]],
      [
        {
          consecutiveWorkingDays: {
            min: 2,
            max: 3,
          },
          minConsecutiveDaysOff: 2,
        },
      ]
    )
  ).toBe(false);
});

test('Random 01', () => {
  expect(
    validConsecutiveDays(
      4,
      0,
      [[1, 1, 0, 0, 0, 1]],
      [
        {
          consecutiveWorkingDays: {
            min: 2,
            max: 3,
          },
          minConsecutiveDaysOff: 2,
        },
      ]
    )
  ).toBe(true);
});

test('Random 02', () => {
  expect(
    validConsecutiveDays(
      4,
      0,
      [[1, 1, 0, 0, 1, 1]],
      [
        {
          consecutiveWorkingDays: {
            min: 2,
            max: 3,
          },
          minConsecutiveDaysOff: 2,
        },
      ]
    )
  ).toBe(true);
});

test('Random 03', () => {
  expect(
    validConsecutiveDays(
      5,
      0,
      [[1, 1, 0, 0, 0, 1, -1]],
      [
        {
          consecutiveWorkingDays: {
            min: 2,
            max: 4,
          },
          minConsecutiveDaysOff: 2,
        },
      ]
    )
  ).toBe(true);
});
