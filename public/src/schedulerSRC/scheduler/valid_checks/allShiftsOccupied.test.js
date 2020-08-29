import { validAllShiftsOccupied } from './allShiftsOccupied';

test('01', () => {
  expect(
    validAllShiftsOccupied(
      0,
      1,
      [
        [0, 0, 1, 1, 0, 1],
        [0, 0, 0, -1, -1, -1],
      ],
      [
        {},
        {
          requiredEmployees: 1,
        },
      ]
    )
  ).toBe(false);
});

test('02', () => {
  expect(
    validAllShiftsOccupied(
      2,
      1,
      [
        [0, 0, 1, 1, 0, 1],
        [1, 1, 0, -1, -1, -1],
      ],
      [
        {},
        {
          requiredEmployees: 1,
        },
      ]
    )
  ).toBe(true);
});
