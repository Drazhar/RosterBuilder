import { validShiftOccupation } from './shiftOccupation';

test('Double occupied shift 01', () => {
  expect(
    validShiftOccupation(
      2,
      1,
      [
        [0, 0, 1, 1, 0, 1],
        [0, 0, 1, -1, -1, -1],
      ],
      [
        {},
        {
          requiredEmployees: 1,
          maxEmployees: 1,
        },
      ]
    )
  ).toBe(false);
});

test('Valid 01', () => {
  expect(
    validShiftOccupation(
      2,
      1,
      [
        [0, 0, 0, 1, 1, 0],
        [0, 0, 1, -1, -1, -1],
      ],
      [
        {},
        {
          requiredEmployees: 1,
          maxEmployees: 1,
        },
      ]
    )
  ).toBe(true);
});

test('Double occupied shift 02', () => {
  expect(
    validShiftOccupation(
      2,
      1,
      [
        [0, 0, 1, 1, 0, 1],
        [0, 0, 1, -1, -1, -1],
      ],
      [
        {},
        {
          requiredEmployees: 2,
          maxEmployees: 2,
        },
      ]
    )
  ).toBe(true);
});
