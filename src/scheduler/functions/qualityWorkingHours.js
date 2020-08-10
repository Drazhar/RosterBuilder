/**
 * Calculates a quality criteria for the actual working hours
 * compared to the planned working hours.
 * TODO: Needs some refactoring
 * @param {Object} employee - Scheduling information
 * Need to contain: .information.plannedWorkingTime
 *                  .information.overtime
 *                  .schedulingInformation.hoursWorked
 *
 * @returns {Number} Quality rating
 */
function qualityWorkingHours(employee) {
  // Calculate error square of planned working time vs actual working time
  // Value is between 0 and 1 if its the maximum shift length away from
  // planned in the direction of the overtime. If overtime is 0, it's
  // allowed to deviate in both directions.
  let result = 0;
  let difference =
    employee.schedulingInformation.hoursWorked -
    employee.information.plannedWorkingTime;
  let smallDeviation = false;
  const Factor = 0.1;
  const AllowedDeviation = Factor * employee.information.plannedWorkingTime;

  if (employee.information.overtime === 0) {
    // Employee has no overtime
    if (Math.abs(difference) <= AllowedDeviation) {
      smallDeviation = true;
      // Slightly worsen the result to consider employees with overtime over overtime 0
      difference = difference * 2;
    }
  } else if (employee.information.overtime > 0) {
    // Employee has overtime, so it's okayisch to work less this period
    if (difference < 0 && -difference <= AllowedDeviation) {
      smallDeviation = true;
    }
  } else {
    // Employee has negative overtime, so it's okayish to work more this period
    if (difference > 0 && difference <= AllowedDeviation) {
      smallDeviation = true;
    }
  }

  if (smallDeviation) {
    result = Math.abs(difference / AllowedDeviation);
  } else {
    result =
      Math.abs(
        employee.information.plannedWorkingTime -
          employee.schedulingInformation.hoursWorked
      ) ** 2;
  }

  return result;
}

module.exports = { qualityWorkingHours };
