import { validMinMaxWeekendCount } from './minMaxWeekendCount';

test('01', () => {
  const employeePlan = [0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1];
  const minMaxWeekendShiftsPerEmployee = [0, 1];
  const dateArray = [4, 5, 6, 0, 1, 2, 3, 4, 5, 6, 0, 1, 2, 3];
  expect(
    validMinMaxWeekendCount(
      employeePlan,
      minMaxWeekendShiftsPerEmployee,
      dateArray
    )
  ).toBe(true);
});

test('02', () => {
  const employeePlan = [0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1];
  const minMaxWeekendShiftsPerEmployee = [1, 2];
  const dateArray = [4, 5, 6, 0, 1, 2, 3, 4, 5, 6, 0, 1, 2, 3];
  expect(
    validMinMaxWeekendCount(
      employeePlan,
      minMaxWeekendShiftsPerEmployee,
      dateArray
    )
  ).toBe(false);
});

test('03', () => {
  const employeePlan = [0, 0, 0, 0, 0, 0, 0];
  const minMaxWeekendShiftsPerEmployee = [1, 2];
  const dateArray = [0, 1, 2, 3, 4, 5, 6];
  expect(
    validMinMaxWeekendCount(
      employeePlan,
      minMaxWeekendShiftsPerEmployee,
      dateArray
    )
  ).toBe(false);
});

test('04', () => {
  const employeePlan = [1, 0, 0, 0, 0, 0, 1];
  const minMaxWeekendShiftsPerEmployee = [2, 2];
  const dateArray = [0, 1, 2, 3, 4, 5, 6];
  expect(
    validMinMaxWeekendCount(
      employeePlan,
      minMaxWeekendShiftsPerEmployee,
      dateArray
    )
  ).toBe(true);
});

test('05', () => {
  const employeePlan = [1, 0, 0, 0, 0, 0, 1];
  const minMaxWeekendShiftsPerEmployee = [1, 1];
  const dateArray = [0, 1, 2, 3, 4, 5, 6];
  expect(
    validMinMaxWeekendCount(
      employeePlan,
      minMaxWeekendShiftsPerEmployee,
      dateArray
    )
  ).toBe(false);
});
