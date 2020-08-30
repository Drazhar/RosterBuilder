import { cloneDeep } from 'lodash';
import { validWorkingHours } from './valid_checks/workingHours';
import { validConsecutiveDays } from './valid_checks/consecutiveDays';
import { validShiftOccupation } from './valid_checks/shiftOccupation';
import { validAllShiftsOccupied } from './valid_checks/allShiftsOccupied';
import { validNonStopWeekend } from './valid_checks/nonStopWeekend';
import { validMinMaxWeekendCount } from './valid_checks/minMaxWeekendCount';
import { getMinMaxWeekendCount } from './helper_functions/minMaxWeekendCount';
import { getWeekendCount } from './helper_functions/weekendCount';
import { adjustPlannedWorkingHours } from './helper_functions/adjustWorkingHours';
import { getMinMaxWeekendNight } from './helper_functions/minMaxWeekendNight';
import { getShiftDayCountPerEmployee } from './helper_functions/shiftDayCountPerEmployee';
import { validIndividualShiftCount } from './valid_checks/individualShiftCount';
import { convertShiftWishesVacation } from './helper_functions/convertShiftWishesVacation';
import { validWishes } from './valid_checks/wishes';

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

  const weekendCount = getWeekendCount(dayCount, dateArray);

  const minMaxWeekendShiftsPerEmployee = getMinMaxWeekendCount(
    weekendCount,
    weekendShiftCount,
    employeeCount
  );

  const minMaxWeekendNightShifts = getMinMaxWeekendNight(
    weekendCount,
    shiftInformation,
    employeeCount
  );

  const shiftCountPerEmployee = getShiftDayCountPerEmployee(
    employeeCount,
    dayCount
  );

  adjustPlannedWorkingHours(
    availableWorkingHours,
    requiredWorkingHours,
    employeeInformation
  );

  convertShiftWishesVacation(employeeInformation, shiftInformation);
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
      if (
        !validWishes(
          employeeInformation[employee].shiftVacation[day],
          wipPlan[employee][day]
        )
      )
        continue;

      if (
        !validWishes(
          employeeInformation[employee].shiftWishes[day],
          wipPlan[employee][day]
        )
      )
        continue;

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

      if (day === dayCount - 1) {
        if (
          !validMinMaxWeekendCount(
            wipPlan[employee],
            minMaxWeekendShiftsPerEmployee,
            dateArray
          )
        )
          continue;

        if (
          !validMinMaxWeekendCount(
            wipPlan[employee],
            minMaxWeekendNightShifts,
            dateArray,
            2
          )
        )
          continue;

        if (
          !validIndividualShiftCount(wipPlan[employee], shiftCountPerEmployee)
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
