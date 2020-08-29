import { validWorkingHours } from './workingHours';
import { validConsecutiveDays } from './consecutiveDays';
import { validShiftOccupation } from './shiftOccupation';

test('Only 1 day at the end', () => {
  const dayCount = 7;
  const day = 5;
  const employee = 2;
  const wipPlan = [
    [0, 0, 1, 1, 0, 0, 1],
    [1, 1, 0, 0, 0, 0, 2],
    [2, 2, 2, 0, 0, 1, -1],
  ];
  const shiftInformation = [
    {},
    {
      workingHours: 12,
      requiredEmployees: 1,
      maxEmployees: 1,
    },
    {
      workingHours: 12,
      requiredEmployees: 1,
      maxEmployees: 1,
    },
  ];
  const employeeInformation = [
    {
      plannedWorkingTime: 48,
      consecutiveWorkingDays: {
        min: 2,
        max: 3,
      },
      minConsecutiveDaysOff: 2,
    },
    {
      plannedWorkingTime: 48,
      consecutiveWorkingDays: {
        min: 2,
        max: 3,
      },
      minConsecutiveDaysOff: 2,
    },
    {
      plannedWorkingTime: 48,
      consecutiveWorkingDays: {
        min: 2,
        max: 3,
      },
      minConsecutiveDaysOff: 2,
    },
  ];

  expect(
    allValid(
      dayCount,
      day,
      employee,
      wipPlan,
      shiftInformation,
      employeeInformation
    )
  ).toBe(true);
});

function allValid(
  dayCount,
  day,
  employee,
  wipPlan,
  shiftInformation,
  employeeInformation
) {
  if (
    !validWorkingHours(
      dayCount,
      day,
      employee,
      wipPlan,
      shiftInformation,
      employeeInformation
    )
  )
    return false;
  //   console.log('workingHours are valid');
  if (!validConsecutiveDays(day, employee, wipPlan, employeeInformation))
    return false;
  //   console.log('consecutiveDays are valid');
  if (employee > 0) {
    if (!validShiftOccupation(day, employee, wipPlan, shiftInformation))
      return false;
    // console.log('shiftOccupation is valid');
  }

  return true;
}
