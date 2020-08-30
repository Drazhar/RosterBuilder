import { getShiftDayCountPerEmployee } from './shiftDayCountPerEmployee';

test('01', () => {
  const employeeCount = 4;
  const dayCount = 12;
  expect(getShiftDayCountPerEmployee(employeeCount, dayCount)).toStrictEqual([
    3,
    3,
  ]);
});

test('02', () => {
  const employeeCount = 4;
  const dayCount = 10;
  expect(getShiftDayCountPerEmployee(employeeCount, dayCount)).toStrictEqual([
    2,
    3,
  ]);
});
