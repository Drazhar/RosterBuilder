import { validWorkingHours } from './workingHours';

test('Valid 01', () => {
  expect(
    validWorkingHours(
      6,
      1,
      0,
      [[0, 0, -1, -1, -1, -1]],
      [{}, { workingHours: 12 }],
      [{ plannedWorkingTime: 48 }]
    )
  ).toBe(true);
});

test('Valid 02', () => {
  expect(
    validWorkingHours(
      6,
      2,
      0,
      [[1, 0, 0, -1, -1, -1]],
      [{}, { workingHours: 12 }],
      [{ plannedWorkingTime: 48 }]
    )
  ).toBe(true);
});

test('Valid 03', () => {
  expect(
    validWorkingHours(
      6,
      3,
      0,
      [[1, 1, 0, 0, -1, -1]],
      [{}, { workingHours: 12 }],
      [{ plannedWorkingTime: 48 }]
    )
  ).toBe(true);
});

test('Invalid 01', () => {
  expect(
    validWorkingHours(
      6,
      2,
      0,
      [[0, 0, 0, -1, -1, -1]],
      [{}, { workingHours: 12 }],
      [{ plannedWorkingTime: 48 }]
    )
  ).toBe(false);
});

test('Invalid 02', () => {
  expect(
    validWorkingHours(
      6,
      3,
      0,
      [[1, 0, 0, 0, -1, -1]],
      [{}, { workingHours: 12 }],
      [{ plannedWorkingTime: 48 }]
    )
  ).toBe(false);
});