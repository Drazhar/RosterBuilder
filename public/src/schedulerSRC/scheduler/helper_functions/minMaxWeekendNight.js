export function getMinMaxWeekendNight(
  weekendCount,
  shiftInformation,
  employeeCount
) {
  const nightShiftAmount = weekendCount * shiftInformation[2].requiredEmployees;

  const nightShiftPerEmployee = nightShiftAmount / employeeCount;
  if (nightShiftAmount % employeeCount === 0) {
    return [nightShiftPerEmployee, nightShiftPerEmployee];
  } else {
    return [
      Math.floor(nightShiftPerEmployee),
      Math.ceil(nightShiftPerEmployee),
    ];
  }
}
