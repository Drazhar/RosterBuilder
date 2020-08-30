import { getMinMaxWeekendNight } from './minMaxWeekendNight';

test('01', () => {
  const weekendCount = 2;
  const shiftInformation = [0, 0, { requiredEmployees: 1 }];
  const employeeCount = 4;

  expect(
    getMinMaxWeekendNight(weekendCount, shiftInformation, employeeCount)
  ).toStrictEqual([0, 1]);
});

test('02', () => {
  const weekendCount = 4;
  const shiftInformation = [0, 0, { requiredEmployees: 1 }];
  const employeeCount = 4;

  expect(
    getMinMaxWeekendNight(weekendCount, shiftInformation, employeeCount)
  ).toStrictEqual([1, 1]);
});

test('03', () => {
  const weekendCount = 4;
  const shiftInformation = [0, 0, { requiredEmployees: 2 }];
  const employeeCount = 4;

  expect(
    getMinMaxWeekendNight(weekendCount, shiftInformation, employeeCount)
  ).toStrictEqual([2, 2]);
});

test('04', () => {
  const weekendCount = 2;
  const shiftInformation = [0, 0, { requiredEmployees: 2 }];
  const employeeCount = 4;

  expect(
    getMinMaxWeekendNight(weekendCount, shiftInformation, employeeCount)
  ).toStrictEqual([1, 1]);
});
