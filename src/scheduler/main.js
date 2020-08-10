const { qualityWorkingHours } = require("./functions/qualityWorkingHours");
const {
  evaluateShiftDistributionRating,
} = require("./functions/evaluateShiftDistributionRating");

module.exports = function runScheduler(
  iterations = 1,
  employeeInformation,
  shiftInformation
) {
  convertToNumbersShiftsObject(shiftInformation); // Converts all strings to numbers which should be numbers
  convertToNumbersEmployeeObject(employeeInformation); // Converts all strings to numbers
  // Adds missing shift information at employees if some are missing
  checkIfEmployeeInformationContainsAllShifts(
    employeeInformation,
    shiftInformation
  );
  // Checking the input correctness should be done in the frontend.

  // Add the shift at the first place for a non working day.
  shiftInformation.unshift({
    id: " ",
    name: " ",
    workingHours: 0,
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
    /* Concept for the quality rating: At the core each quality rating should be
    in a range from 0 to 1 for an okayisch quality and then exponentially get
    larger. During the creation of the quality ratings an array is created which
    stores all schedules where all quality ratings are between 0 and 1 for
    further evaluation. Also there is an combined target function for one
    overall criteria (for example the product of all criteria with a weighting
    factor). If the length of the best schedules array is to small, the complete
    array of all results has to be sorted the get the 10 best candidates.
    */
    qualityRatings.push({
      totalHourDifference: 0,
      shiftDistribution: 0,
      minConsecutiveDaysOffCheck: 0,
    });

    createdSchedules[i].forEach((employee) => {
      // Evaluate the quality for worked hours vs planned hours
      qualityRatings[i].totalHourDifference += qualityWorkingHours(employee);

      // Calculate criteria for shiftDistribution
      qualityRatings[i].shiftDistribution += evaluateShiftDistributionRating(
        employee.schedulingInformation.shift
      );

      // Calculate criteria for minConsecutiveDaysOff and consecutive working days
      let currentDaysOff = 0;
      let consecutiveWorkingDaysQuality = 0;
      employee.assignedShifts.forEach((workShift) => {
        // This part is for minConsecutiveDaysOff
        if (workShift === 0) currentDaysOff++;
        if (
          workShift !== 0 &&
          currentDaysOff < employee.information.minConsecutiveDaysOff &&
          currentDaysOff !== 0
        )
          qualityRatings[i].minConsecutiveDaysOffCheck++;
        if (workShift !== 0) currentDaysOff = 0;

        // This is for consecutive working days
        // Idea: Below min and above max will grant (Diff to prefered * 2) squared.
        // Below or above prefered will grand (Diff to prefered).
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
      qualityRatings[i].totalHourDifference <=
      minTotalHourDifference * 1.05
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
        employee.schedulingInformation.shift.map[shift];
    });
  });

  createdSchedules[bestIndex][0].quality = qualityRatings[bestIndex];
  return createdSchedules[bestIndex];
};

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
    for (let i = 1; i < shiftInformation.length - 1; i++) {
      if (employee.schedulingInformation.shift.plannedDistribution[i] === 0) {
        employee.schedulingInformation.possibleShifts[i] = 0;
      }
      if (employee.schedulingInformation.shift.plannedDistribution[i] > 0) {
        let plannedDist =
          employee.schedulingInformation.shift.plannedDistribution[i] /
          sumAutoAssignDistribution(
            employee.schedulingInformation.shift.plannedDistribution,
            employee.schedulingInformation.shift.plannedDistribution
          );
        let currentDist =
          employee.schedulingInformation.shift.worked[i] /
          sumAutoAssignDistribution(
            employee.schedulingInformation.shift.worked,
            employee.schedulingInformation.shift.plannedDistribution
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
    // removeAutoAssignSetInterchangeable(
    //   employee.schedulingInformation,
    //   shiftInformation
    // );
  });
}

function sumAutoAssignDistribution(shiftDistribution, plannedDistribution) {
  let sum = 0;
  for (let i = 1; i < plannedDistribution.length; i++) {
    if (plannedDistribution[i] > 0) {
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

// function removeAutoAssignSetInterchangeable(
//   schedulingInformation,
//   shiftInformation
// ) {
//   console.log("schedulingInf", schedulingInformation);
//   console.log("shiftinfo", shiftInformation);
//   for (let i = 1; i < shiftInformation.length; i++) {
//     if (shiftInformation[i].hasOwnProperty("interchangeableWith")) {
//       shiftInformation[i].interchangeableWith.forEach((interchangeables) => {
//         if (
//           schedulingInformation.possibleShifts[i] >
//           schedulingInformation.possibleShifts[interchangeables]
//         ) {
//           schedulingInformation.possibleShifts[interchangeables] =
//             schedulingInformation.possibleShifts[i];
//         } else {
//           schedulingInformation.possibleShifts[i] =
//             schedulingInformation.possibleShifts[interchangeables];
//         }
//       });
//     }

//     if (!shiftInformation[i].autoAssign) {
//       schedulingInformation.possibleShifts[i] = 0;
//     }
//   }
// }

function initializeSchedule(employeeInformation) {
  // Initialized a schedule with the employee informations.
  let initializedSchedule = [];
  employeeInformation.forEach((employee) => {
    const parsedShiftInfo = parseShiftObject(employee);
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
          plannedDistribution: parsedShiftInfo.plannedDistribution,
          map: parsedShiftInfo.map,
          worked: parsedShiftInfo.workedDistribution,
        },
      },
      assignedShifts: [],
    });
  });
  return initializedSchedule;
}

function parseShiftObject(shiftDist) {
  let plannedDistribution = [];
  let workedDistribution = [];
  let map = [];

  // Fill for day off shift
  plannedDistribution.push(0);
  workedDistribution.push(0);
  map.push(" ");

  for (const shift in shiftDist.shift) {
    plannedDistribution.push(shiftDist.shift[shift]);
    workedDistribution.push(0);
    map.push(shift);
  }
  return { plannedDistribution, workedDistribution, map };
}

function convertToNumbersShiftsObject(shiftInformation) {
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
}

function convertToNumbersEmployeeObject(employeeInformation) {
  employeeInformation.forEach((employee) => {
    employee.plannedWorkingTime = parseInt(employee.plannedWorkingTime, 10);
    employee.overtime = parseInt(employee.overtime, 10);
    employee.minConsecutiveDaysOff = parseInt(
      employee.minConsecutiveDaysOff,
      10
    );
    employee.consecutiveWorkingDays.min = parseInt(
      employee.consecutiveWorkingDays.min,
      10
    );
    employee.consecutiveWorkingDays.prefered = parseInt(
      employee.consecutiveWorkingDays.prefered,
      10
    );
    employee.consecutiveWorkingDays.max = parseInt(
      employee.consecutiveWorkingDays.max,
      10
    );
    for (const shift in employee.shift) {
      employee.shift[shift] = parseInt(employee.shift[shift], 10);
    }
  });
}

function checkIfEmployeeInformationContainsAllShifts(
  employeeInformation,
  shiftInformation
) {
  employeeInformation.forEach((employee) => {
    shiftInformation.forEach((shift) => {
      if (!(shift.id in employee.shift)) {
        employee.shift[shift.id] = 0;
      }
    });
  });
}
