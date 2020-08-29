import { cloneDeep } from 'lodash';
import { validWorkingHours } from './valid_checks/workingHours';
import { validConsecutiveDays } from './valid_checks/consecutiveDays';

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
  for (let i = 1; i < shiftCount; i++) {
    requiredWorkingHours +=
      shiftInformation[i].requiredEmployees *
      shiftInformation[i].workingHours *
      dayCount;
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

    // Check if it should backtrack, assigns unvisited value (-1) and push
    // wipPlan to the result if finished.
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

  console.log(resultingPlans.length);
  // resultingPlans.forEach((plan) =>
  //   console.log(`${plan[0][0]} ${plan[0][1]} ${plan[1][0]} ${plan[1][1]}`)
  // );

  return resultingPlans;
}

function checkCount(plan, day) {
  let dayCount = 1;
  for (let i = day - 1; i >= 0; i--) {
    if (plan[day] === plan[i]) {
      dayCount++;
    } else {
      break;
    }
  }
  return dayCount;
}
