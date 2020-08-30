import { validIndividualShiftCount } from './individualShiftCount';

test('01', () => {
  const employeePlan = [1, 1, 0, 0, 2, 2];
  const shiftCountPerEmployee = [2, 2];
  expect(validIndividualShiftCount(employeePlan, shiftCountPerEmployee)).toBe(
    true
  );
});

test('02', () => {
  const employeePlan = [1, 1, 1, 0, 0, 2];
  const shiftCountPerEmployee = [2, 2];
  expect(validIndividualShiftCount(employeePlan, shiftCountPerEmployee)).toBe(
    false
  );
});
