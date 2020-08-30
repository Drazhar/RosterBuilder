import { checkCount } from './../helper_functions/checkCount';

export function validConsecutiveDays(
  day,
  employee,
  wipPlan,
  employeeInformation
) {
  if (day > 0) {
    if (wipPlan[employee][day] > 0 && wipPlan[employee][day - 1] === 0) {
      // Min days off between shift blocks
      let [daysOffCount, lastShift] = checkCount(
        wipPlan[employee],
        day - 1,
        true
      );
      let minDaysOff = employeeInformation[employee].minConsecutiveDaysOff;
      if (wipPlan[employee][day] === 1 && lastShift === 2) {
        minDaysOff++;
      } else if (wipPlan[employee][day] === 2 && lastShift === 1) {
        minDaysOff--;
      }
      if (daysOffCount < minDaysOff) {
        return false;
      }
    } else if (
      wipPlan[employee][day] > 0 &&
      wipPlan[employee][day] !== wipPlan[employee][day - 1]
    ) {
      // No switch from one shift to another without days off
      return false;
    } else if (wipPlan[employee][day] === 0 && wipPlan[employee][day - 1] > 0) {
      // Min consecutive working days
      if (
        checkCount(wipPlan[employee], day - 1) <
        employeeInformation[employee].consecutiveWorkingDays.min
      ) {
        return false;
      }
    } else if (
      wipPlan[employee][day] > 0 &&
      wipPlan[employee][day] === wipPlan[employee][day - 1]
    ) {
      // Max consecutive working days
      if (
        checkCount(wipPlan[employee], day) >
        employeeInformation[employee].consecutiveWorkingDays.max
      ) {
        return false;
      }
    }
  }

  return true;
}
