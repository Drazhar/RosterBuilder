/**
 * Calculates the quality for the consecutive days off and the consecutive
 * working days.
 *
 * @param {Object} employee Contains information about the employees settings
 * regarding the consecutiveWorkingDays and minConsecutiveDaysOff in the Object.
 * also contains the assignedShifts.
 * @returns {Array} Array[0]: The quality for the consecutiveDaysOff
 *                  Array[1]: The quality for the consecutiveWorkingDays
 */
function qualityConsecutiveDays(employee) {
  let resultConsecutiveDaysOff = 0;
  let resultConsecutiveWorkingDays = 0;

  let currentDaysOff = 0;
  let currentDaysWorking = 0;
  employee.assignedShifts.forEach((workShift, index) => {
    // This part is for minConsecutiveDaysOff
    if (workShift === 0) {
      currentDaysOff++;
    } else {
      currentDaysWorking++;
    }

    if (
      workShift !== 0 &&
      currentDaysOff < employee.information.minConsecutiveDaysOff &&
      currentDaysOff !== 0
    ) {
      // Switched from at least one day off to working
      resultConsecutiveDaysOff++;
    } else if (
      workShift !== 0 &&
      index > 0 &&
      workShift !== employee.assignedShifts[index - 1] &&
      employee.assignedShifts[index - 1] !== 0
    ) {
      // Switched from one shift to another without a day off
      resultConsecutiveDaysOff++;
    } else if (workShift === 0 && currentDaysWorking !== 0) {
      // Switched from working to at least a day off
      if (
        currentDaysWorking < employee.information.consecutiveWorkingDays.min ||
        currentDaysWorking > employee.information.consecutiveWorkingDays.max
      ) {
        resultConsecutiveWorkingDays +=
          ((currentDaysWorking -
            employee.information.consecutiveWorkingDays.preferred) *
            2) **
          2;
      } else if (
        currentDaysWorking !==
        employee.information.consecutiveWorkingDays.preferred
      ) {
        let relativeDistance =
          employee.information.consecutiveWorkingDays.max -
          employee.information.consecutiveWorkingDays.preferred;

        if (
          currentDaysWorking <
          employee.information.consecutiveWorkingDays.preferred
        ) {
          relativeDistance =
            employee.information.consecutiveWorkingDays.preferred -
            employee.information.consecutiveWorkingDays.min;
        }
        let difference = Math.abs(
          currentDaysWorking -
            employee.information.consecutiveWorkingDays.preferred
        );
        resultConsecutiveWorkingDays += difference / relativeDistance;
      }
    }
    // At the end of the array, check for to many working days
    if (currentDaysWorking > employee.information.consecutiveWorkingDays.max) {
      resultConsecutiveWorkingDays +=
        ((currentDaysWorking -
          employee.information.consecutiveWorkingDays.preferred) *
          2) **
        2;
    }

    if (workShift !== 0) {
      currentDaysOff = 0;
    } else {
      currentDaysWorking = 0;
    }
  });

  return [resultConsecutiveDaysOff, resultConsecutiveWorkingDays];
}

module.exports = { qualityConsecutiveDays };
