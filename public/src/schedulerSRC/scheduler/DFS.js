import { cloneDeep } from 'lodash';
import { validWorkingHours } from './valid_checks/workingHours';
import { validConsecutiveDays } from './valid_checks/consecutiveDays';
import { validShiftOccupation } from './valid_checks/shiftOccupation';
import { validAllShiftsOccupied } from './valid_checks/allShiftsOccupied';
import { validNonStopWeekend } from './valid_checks/nonStopWeekend';

export function runScheduler(employeeInformation, shiftInformation, dateArray) {
  shiftInformation.unshift({ id: ' ', name: ' ' });

  // Parse Strings to numbers
  for (let i = 0; i < employeeInformation.length; i++) {
    employeeInformation[i].plannedWorkingTime = Number(
      employeeInformation[i].plannedWorkingTime
    );
  }

  for (let i = 0; i < shiftInformation.length; i++) {
    shiftInformation[i].workingHours = Number(shiftInformation[i].workingHours);
    shiftInformation[i].requiredEmployees = Number(
      shiftInformation[i].requiredEmployees
    );
  }

  // Calculate base parameters
  const dayCount = dateArray.length;
  const employeeCount = employeeInformation.length;
  const shiftCount = shiftInformation.length;
  const availableWorkingHours = employeeInformation.reduce(
    (result, value) => result + value.plannedWorkingTime,
    0
  );
  let requiredWorkingHours = 0;
  let weekendShiftCount = 0;
  for (let i = 1; i < shiftCount; i++) {
    weekendShiftCount += shiftInformation[i].requiredEmployees;
    requiredWorkingHours +=
      shiftInformation[i].requiredEmployees *
      shiftInformation[i].workingHours *
      dayCount;
  }
  let weekendCount = 0;
  for (let i = 0; i < dayCount; i++) {
    if (i === dayCount - 1) {
      if (dateArray[i] === 6) {
        weekendCount++;
      }
    } else {
      if (dateArray[i] === 0) {
        weekendCount++;
      }
    }
  }

  const minMaxWeekendShiftsPerEmployee = [];
  let minMaxCount = (weekendCount * weekendShiftCount) / employeeCount;
  if ((weekendCount * weekendShiftCount) % employeeCount === 0) {
    let minMaxCount = (weekendCount * weekendShiftCount) / employeeCount;
    minMaxWeekendShiftsPerEmployee.push(minMaxCount);
    minMaxWeekendShiftsPerEmployee.push(minMaxCount);
  } else {
    minMaxWeekendShiftsPerEmployee.push(Math.floor(minMaxCount));
    minMaxWeekendShiftsPerEmployee.push(Math.ceil(minMaxCount));
  }
  //----------------------------------------

  const resultingPlans = [];
  const wipPlan = [];

  for (let i = 0; i < employeeCount; i++) {
    wipPlan.push(new Array(dayCount).fill(-1));
  }

  let employee = 0;
  let day = 0;
  let isFinished = false;

  while (!isFinished) {
    wipPlan[employee][day]++;

    let shouldBacktrack = false;
    if (wipPlan[employee][day] >= shiftCount) {
      shouldBacktrack = true;
      wipPlan[employee][day] = -1;
    }

    if (!shouldBacktrack) {
      // Check if valid. If not valid -> continue
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
        continue;

      if (!validConsecutiveDays(day, employee, wipPlan, employeeInformation))
        continue;

      if (dateArray[day] === 0 && day > 0) {
        if (
          !validNonStopWeekend(
            wipPlan[employee][day],
            wipPlan[employee][day - 1]
          )
        )
          continue;
      }

      if (employee > 0) {
        if (!validShiftOccupation(day, employee, wipPlan, shiftInformation))
          continue;

        if (employee == employeeCount - 1) {
          if (!validAllShiftsOccupied(day, employee, wipPlan, shiftInformation))
            continue;
        }
      }

      if (employee == employeeCount - 1 && day == dayCount - 1) {
        resultingPlans.push({ assignedShifts: cloneDeep(wipPlan) });
      }
    }

    // Traversing the wipPlan by day and employee
    if (shouldBacktrack) {
      day--;
      if (day < 0) {
        employee--;
        if (employee < 0) {
          isFinished = true;
          break;
        }
        day = dayCount - 1;
      }
    } else {
      day++;
      if (day >= dayCount) {
        employee++;
        if (employee >= employeeCount) {
          employee--;
          day = dayCount - 1;
        } else {
          day = 0;
        }
      }
    }

    // Check if finished
    if (wipPlan[0][0] > shiftCount) {
      isFinished = true;
    }
  }

  console.log('Number of plans: ', resultingPlans.length);

  return resultingPlans;
}
