export function getMinMaxWeekendCount(
  weekendCount,
  weekendShiftCount,
  employeeCount
) {
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
  return minMaxWeekendShiftsPerEmployee;
}
