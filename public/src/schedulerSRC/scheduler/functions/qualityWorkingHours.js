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
  let difference =
    employee.schedulingInformation.hoursWorked -
    employee.information.plannedWorkingTime;

  // console.log({ difference });
  // console.log('overtime', employee.information.overtime);

  if (difference < 0 && employee.information.overtime > 0) {
    if (employee.information.overtime > Math.abs(difference)) {
      difference = 0;
    } else if (employee.information.overtime > 12) {
      difference += 12;
    } else {
      difference += employee.information.overtime;
    }
  } else if (difference > 0 && employee.information.overtime < 0) {
    if (Math.abs(employee.information.overtime) > difference) {
      difference = 0;
    } else if (employee.information.overtime < -12) {
      difference -= 12;
    } else {
      difference += employee.information.overtime;
    }
  }
  // console.log('difference after: ', difference);

  return Math.abs(difference) ** 2;
}

module.exports = { qualityWorkingHours };
