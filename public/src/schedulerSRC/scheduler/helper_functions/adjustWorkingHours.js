export function adjustPlannedWorkingHours(
  availableWorkingHours,
  requiredWorkingHours,
  employeeInformation
) {
  if (availableWorkingHours !== requiredWorkingHours) {
    let factor = requiredWorkingHours / availableWorkingHours;

    employeeInformation.forEach((employee) => {
      employee.plannedWorkingTime *= factor;
    });
  }
}
