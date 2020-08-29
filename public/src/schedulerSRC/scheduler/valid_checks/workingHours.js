export function validWorkingHours(
  dayCount,
  day,
  employee,
  wipPlan,
  shiftInformation,
  employeeInformation
) {
  let remainingDays = dayCount - day - 1;
  let maxRemainingWorkingHours = remainingDays * 12;
  let hoursWorked = 0;
  for (let i = day; i >= 0; i--) {
    if (wipPlan[employee][i] > 0) {
      hoursWorked += shiftInformation[wipPlan[employee][i]].workingHours;
    }
  }
  const remainingWorkingHours =
    employeeInformation[employee].plannedWorkingTime - hoursWorked;
  if (remainingWorkingHours > maxRemainingWorkingHours) {
    return false;
  }
  if (hoursWorked > employeeInformation[employee].plannedWorkingTime) {
    return false;
  }
  return true;
}
