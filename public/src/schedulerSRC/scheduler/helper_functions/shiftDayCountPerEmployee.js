export function getShiftDayCountPerEmployee(employeeCount, dayCount) {
  // Assumption only 1 employee per shift is required per day
  const shiftPerEmployeeCount = dayCount / employeeCount;
  if (dayCount % employeeCount === 0) {
    return [shiftPerEmployeeCount, shiftPerEmployeeCount];
  } else {
    return [
      Math.floor(shiftPerEmployeeCount),
      Math.ceil(shiftPerEmployeeCount),
    ];
  }
}
