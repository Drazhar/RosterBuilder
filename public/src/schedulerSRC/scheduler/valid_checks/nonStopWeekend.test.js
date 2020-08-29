import { validNonStopWeekend } from './nonStopWeekend';

test('01', () => {
  expect(validNonStopWeekend(0, 0)).toBe(true);
});

test('02', () => {
  expect(validNonStopWeekend(0, 1)).toBe(false);
});

test('03', () => {
  expect(validNonStopWeekend(1, 1)).toBe(true);
});

test('04', () => {
  expect(validNonStopWeekend(1, 2)).toBe(false);
});

test('05', () => {
  expect(validNonStopWeekend(1, 0)).toBe(false);
});
