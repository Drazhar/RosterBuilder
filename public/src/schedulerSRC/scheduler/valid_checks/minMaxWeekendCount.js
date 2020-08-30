export function validMinMaxWeekendCount(
  employeePlan,
  minMaxWeekendShiftsPerEmployee,
  dateArray,
  shiftToCheck = 1
) {
  let weekdayToCheck = 0;
  let weekendCounter = 0;
  for (let i = 0; i < dateArray.length; i++) {
    if (i === dateArray.length - 1) {
      weekdayToCheck = 6;
    }

    if (dateArray[i] === weekdayToCheck && employeePlan[i] >= shiftToCheck) {
      weekendCounter++;
    }
  }

  if (
    weekendCounter < minMaxWeekendShiftsPerEmployee[0] ||
    weekendCounter > minMaxWeekendShiftsPerEmployee[1]
  ) {
    return false;
  }

  return true;
}
