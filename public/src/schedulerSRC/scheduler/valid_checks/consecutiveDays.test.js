import { validConsecutiveDays } from './consecutiveDays';

test('Valid 01', () => {
  expect(
    validConsecutiveDays(
      2,
      0,
      [[-1, -1, -1, -1, -1, -1]],
      [
        {
          consecutiveWorkingDays: {
            max: 3,
          },
          minConsecutiveDaysOff: 2,
        },
      ]
    )
  ).toBe(true);
});
