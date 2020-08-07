const { employeeInformationTemp, shiftInformationTemp } = require("./input");

module.exports = function runScheduler(
  iterations = 1,
  employeeInformation = employeeInformationTemp,
  shiftInformation = shiftInformationTemp
) {
  // Convert numbers
  for (let i = 0; i < shiftInformation.length; i++) {
    shiftInformation[i].workingHours = parseInt(
      shiftInformation[i].workingHours,
      10
    );
    shiftInformation[i].requiredEmployees = parseInt(
      shiftInformation[i].requiredEmployees,
      10
    );
  }

  // Add the shift at the first place for a non working day.
  shiftInformation.unshift({
    id: " ",
    name: " ",
    workingHours: 0,
    autoAssign: true,
  });

  let createdSchedules = []; // This array will store all informations for the employees and the shift assignments created. It will get huge.
  let qualityRatings = [];
  const numberOfDays = 30; // This should be set outside of the function later.

  let minTotalHourDifference = Infinity;

  for (let i = 0; i < iterations; i++) {
    createdSchedules.push(initializeSchedule(employeeInformation));
    for (let currentDay = 0; currentDay < numberOfDays; currentDay++) {
      obtainInformation(createdSchedules[i], shiftInformation);
      // ToDo: Modifiy priorities according to employee wishes.
      assignEmployees(createdSchedules[i], currentDay, shiftInformation);
    }

    // Evaluate result
    qualityRatings.push({
      totalHourDifference: 0,
      shiftDistribution: 0,
      minConsecutiveDaysOffCheck: 0,
    });

    createdSchedules[i].forEach((employee) => {
      qualityRatings[i].totalHourDifference +=
        Math.abs(
          employee.information.plannedWorkingTime -
            employee.schedulingInformation.hoursWorked
        ) ** 2;
      qualityRatings[i].shiftDistribution += evaluateShiftDistributionRating(
        employee.schedulingInformation.shift,
        shiftInformation
      );

      // Check that minConsecutiveDaysOff are used
      let currentDaysOff = 0;
      employee.assignedShifts.forEach((workShift) => {
        if (workShift === 0) currentDaysOff++;
        if (
          workShift !== 0 &&
          currentDaysOff < employee.information.minConsecutiveDaysOff &&
          currentDaysOff !== 0
        )
          qualityRatings[i].minConsecutiveDaysOffCheck++;
        if (workShift !== 0) currentDaysOff = 0;
      });
    });
    if (qualityRatings[i].totalHourDifference < minTotalHourDifference) {
      minTotalHourDifference = qualityRatings[i].totalHourDifference;
    }
  }

  // return best schedule
  let bestSchedules = [];
  for (let i = 0; i < iterations; i++) {
    if (
      qualityRatings[i].totalHourDifference <= minTotalHourDifference * 1.05 &&
      qualityRatings[i].minConsecutiveDaysOffCheck === 0
    ) {
      bestSchedules.push({
        index: i,
        totalHourDifference: qualityRatings[i].totalHourDifference,
      });
    }
  }

  // find best shift distribution from best hour difference distributions
  let bestDistribution = Infinity;
  let bestIndex = bestSchedules[0].index;
  bestSchedules.forEach((scheduleMap) => {
    scheduleMap.distributionRating =
      qualityRatings[scheduleMap.index].shiftDistribution;
    if (
      qualityRatings[scheduleMap.index].shiftDistribution < bestDistribution
    ) {
      bestDistribution = qualityRatings[scheduleMap.index].shiftDistribution;
      bestIndex = scheduleMap.index;
    }
  });

  // Replace numbers with names for better overview
  createdSchedules[bestIndex].forEach((employee, i) => {
    employee.assignedShifts.forEach((shift, j) => {
      createdSchedules[bestIndex][i].assignedShifts[j] =
        shiftInformation[shift].id;
    });
  });

  createdSchedules[bestIndex][0].quality = qualityRatings[bestIndex];
  return createdSchedules[bestIndex];
};

function evaluateShiftDistributionRating(shiftDistributions, shiftInformation) {
  let firstAutoAssignShift = 0;
  let relationWorked = 0;
  let relationPlanned = 0;
  let returnValue = 0;

  for (let i = 1; i < shiftInformation.length; i++) {
    if (shiftInformation[i].autoAssign) {
      if (firstAutoAssignShift === 0) {
        firstAutoAssignShift = i;
      }
      if (firstAutoAssignShift !== i) {
        relationWorked =
          shiftDistributions.worked[i] /
          shiftDistributions.worked[firstAutoAssignShift];
        relationPlanned =
          shiftDistributions.plannedDistribution[i] /
          shiftDistributions.plannedDistribution[firstAutoAssignShift];
        returnValue += (relationWorked - relationPlanned) ** 2;
      }
    }
  }
  if (isNaN(returnValue) || returnValue === Infinity) {
    return 0;
  }
  return returnValue;
}

function assignEmployees(inputSchedule, day, shiftInformation) {
  for (
    let currentShift = 1;
    currentShift < shiftInformation.length;
    currentShift++
  ) {
    for (let i = 0; i < shiftInformation[currentShift].requiredEmployees; i++) {
      let sumProbabilities = 0;
      inputSchedule.forEach((employee) => {
        if (employee.assignedShifts[day] === undefined) {
          sumProbabilities +=
            employee.schedulingInformation.possibleShifts[currentShift];
        }
      });
      let randomSelector = Math.random() * sumProbabilities;

      let addedUp = 0;
      for (let j = 0; j < inputSchedule.length; j++) {
        if (inputSchedule[j].assignedShifts[day] === undefined) {
          addedUp +=
            inputSchedule[j].schedulingInformation.possibleShifts[currentShift];
          if (randomSelector < addedUp) {
            inputSchedule[j].assignedShifts[day] = currentShift;
            updateSchedulingInformation(
              inputSchedule[j].schedulingInformation,
              currentShift,
              shiftInformation
            );
            break;
          }
        }
      }
    }
  }

  // fill days off
  inputSchedule.forEach((employee) => {
    if (employee.assignedShifts[day] === undefined) {
      employee.assignedShifts[day] = 0;
      updateSchedulingInformation(
        employee.schedulingInformation,
        0,
        shiftInformation
      );
    }
  });
}

function updateSchedulingInformation(
  schedulingInformation,
  currentShift,
  shiftInformation
) {
  // need to add the interchangeables!!!
  if (schedulingInformation.recentAssignment.shift === currentShift) {
    schedulingInformation.recentAssignment.numberOfDays++;
  } else {
    schedulingInformation.recentAssignment.shift = currentShift;
    schedulingInformation.recentAssignment.numberOfDays = 1;
  }

  if (currentShift !== 0) {
    schedulingInformation.hoursWorked +=
      shiftInformation[currentShift].workingHours;
    schedulingInformation.shift.worked[currentShift]++;
  }
}

function obtainInformation(inputSchedule, shiftInformation) {
  inputSchedule.forEach((employee) => {
    // Check which shift assignments are possible
    if (employee.schedulingInformation.recentAssignment.shift === 0) {
      // Employee had at least one day off
      if (
        employee.schedulingInformation.recentAssignment.numberOfDays >=
        employee.information.minConsecutiveDaysOff
      ) {
        employee.schedulingInformation.possibleShifts = new Array(
          shiftInformation.length
        ).fill(1);
      } else {
        employee.schedulingInformation.possibleShifts = new Array(
          shiftInformation.length
        ).fill(0.001);
      }
    } else {
      // Employee had no day off
      employee.schedulingInformation.possibleShifts = new Array(
        shiftInformation.length
      ).fill(0.001);
      if (
        employee.schedulingInformation.recentAssignment.numberOfDays <
        employee.information.consecutiveWorkingDays.min
      ) {
        employee.schedulingInformation.possibleShifts[
          employee.schedulingInformation.recentAssignment.shift
        ] = 1000;
      } else if (
        employee.schedulingInformation.recentAssignment.numberOfDays <
        employee.information.consecutiveWorkingDays.prefered
      ) {
        employee.schedulingInformation.possibleShifts[
          employee.schedulingInformation.recentAssignment.shift
        ] =
          ((employee.information.consecutiveWorkingDays.prefered -
            employee.schedulingInformation.recentAssignment.numberOfDays) /
            employee.information.consecutiveWorkingDays.prefered) *
          100;
      } else if (
        employee.schedulingInformation.recentAssignment.numberOfDays <
        employee.information.consecutiveWorkingDays.max
      ) {
        employee.schedulingInformation.possibleShifts[
          employee.schedulingInformation.recentAssignment.shift
        ] =
          (employee.information.consecutiveWorkingDays.max -
            employee.schedulingInformation.recentAssignment.numberOfDays) /
          employee.information.consecutiveWorkingDays.max;
      }
    }

    // Distribute shifts
    for (
      let i = 1;
      i < shiftInformation.length - 1;
      //i < employee.schedulingInformation.shift.plannedDistribution.length;
      i++
    ) {
      if (employee.schedulingInformation.shift.plannedDistribution[i] === 0) {
        employee.schedulingInformation.possibleShifts[i] = 0;
      }
      if (shiftInformation[i].autoAssign) {
        let plannedDist =
          employee.schedulingInformation.shift.plannedDistribution[i] /
          sumAutoAssignDistribution(
            employee.schedulingInformation.shift.plannedDistribution,
            shiftInformation
          );
        let currentDist =
          employee.schedulingInformation.shift.worked[i] /
          sumAutoAssignDistribution(
            employee.schedulingInformation.shift.worked,
            shiftInformation
          );
        let relation = plannedDist / currentDist;
        // Some relations are NaN or infinity
        if (relation > 5) {
          relation = 5;
        } else if (relation < 0.1) {
          relation = 0.2;
        } else {
          relation = 1;
        }
        employee.schedulingInformation.possibleShifts[i] *= relation ** 2;
      }
    }

    // Lower the probability if working days are high
    reduceProbabilityForHighWorkload(employee);
    removeAutoAssignSetInterchangeable(
      employee.schedulingInformation,
      shiftInformation
    );
  });
}

function sumAutoAssignDistribution(shiftDistribution, shiftInformation) {
  let sum = 0;
  for (let i = 1; i < shiftInformation.length; i++) {
    if (shiftInformation[i].autoAssign) {
      sum += shiftDistribution[i];
    }
  }
  return sum;
}

function reduceProbabilityForHighWorkload(employee) {
  const reducePlannedReached = 0.9; // The factor by which the probability is reduced if the planned working days are reached
  // If workingDays are larger than plannedWorkingDays, the formla could produce negative probabilities
  if (
    employee.schedulingInformation.hoursWorked <=
    employee.information.plannedWorkingTime
  ) {
    employee.schedulingInformation.possibleShifts = employee.schedulingInformation.possibleShifts.map(
      (x) =>
        x *
        (1 -
          (reducePlannedReached * employee.schedulingInformation.hoursWorked) /
            employee.information.plannedWorkingTime)
    );
  } else {
    employee.schedulingInformation.possibleShifts = employee.schedulingInformation.possibleShifts.map(
      (x) => x * (1 - reducePlannedReached)
    );
  }
}

function removeAutoAssignSetInterchangeable(
  schedulingInformation,
  shiftInformation
) {
  // have to do this even if autoAssign is false, because the shift could be assigned hard coded the day before.
  for (let i = 1; i < shiftInformation.length; i++) {
    if (shiftInformation[i].hasOwnProperty("interchangeableWith")) {
      shiftInformation[i].interchangeableWith.forEach((interchangeables) => {
        if (
          schedulingInformation.possibleShifts[i] >
          schedulingInformation.possibleShifts[interchangeables]
        ) {
          schedulingInformation.possibleShifts[interchangeables] =
            schedulingInformation.possibleShifts[i];
        } else {
          schedulingInformation.possibleShifts[i] =
            schedulingInformation.possibleShifts[interchangeables];
        }
      });
    }

    if (!shiftInformation[i].autoAssign) {
      schedulingInformation.possibleShifts[i] = 0;
    }
  }
}

function initializeSchedule(employeeInformation) {
  // Initialized a schedule with the employee informations.
  let initializedSchedule = [];
  employeeInformation.forEach((employee) => {
    initializedSchedule.push({
      information: {
        id: employee.id,
        name: employee.name,
        plannedWorkingTime: employee.plannedWorkingTime,
        overtime: employee.overtime,
        consecutiveWorkingDays: {
          min: employee.consecutiveWorkingDays.min,
          max: employee.consecutiveWorkingDays.max,
          prefered: employee.consecutiveWorkingDays.prefered,
        },
        minConsecutiveDaysOff: employee.minConsecutiveDaysOff,
      },
      schedulingInformation: {
        hoursWorked: 0,
        recentAssignment: {
          shift: 0,
          numberOfDays: 5,
        },
        shift: {
          plannedDistribution: employee.shift.distribution,
          worked: new Array(employee.shift.distribution.length).fill(0),
        },
      },
      assignedShifts: [],
    });
  });
  return initializedSchedule;
}
