const { qualityWorkingHours } = require('./functions/qualityWorkingHours');
const {
  evaluateShiftDistributionRating,
} = require('./functions/evaluateShiftDistributionRating');
const {
  qualityConsecutiveDays,
} = require('./functions/qualityConsecutiveDays');
const { findBestSchedules } = require('./functions/findBestSchedules');

function multipleScheduler(
  iterations = 1,
  employeeInformation,
  shiftInformation
) {
  let result = [];

  console.time('calc');
  for (let i = 0; i < 10; i++) {
    result = runScheduler(
      iterations,
      [...employeeInformation],
      [...shiftInformation],
      [...result]
    );
    console.log(`${i}. Number of Results: ${result.length}`);
  }
  console.timeEnd('calc');
  // Replace numbers with names for better overview
  result.forEach((schedule) => {
    schedule.forEach((employee, i) => {
      employee.assignedShifts.forEach((shift, j) => {
        schedule[i].assignedShifts[j] =
          employee.schedulingInformation.shift.map[shift];
      });
    });
  });

  return result;
}

function runScheduler(
  iterations = 1,
  employeeInformation,
  shiftInformation,
  lastBest = []
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
    id: ' ',
    name: ' ',
    workingHours: 0,
  });

  let createdSchedules = []; // This array will store all information for the employees and the shift assignments created. It will get huge.
  let bestRatings = {
    totalHourDifference: Infinity,
    shiftDistribution: Infinity,
    minConsecutiveDaysOff: Infinity,
    consecutiveWorkingDays: Infinity,
  };
  const numberOfDays = 30; // This should be set outside of the function later.

  for (let i = 0; i < iterations; i++) {
    createdSchedules.push(initializeSchedule(employeeInformation));
    for (let currentDay = 0; currentDay < numberOfDays; currentDay++) {
      obtainInformation(createdSchedules[i], shiftInformation);
      // ToDo: Modify priorities according to employee wishes.
      assignEmployees(createdSchedules[i], currentDay, shiftInformation);
    }

    // Evaluate results
    createdSchedules[i].forEach((employee) => {
      // Evaluate the quality for worked hours vs planned hours
      createdSchedules[i][0].quality.totalHourDifference += qualityWorkingHours(
        employee
      );

      // Calculate criteria for shiftDistribution
      createdSchedules[
        i
      ][0].quality.shiftDistribution += evaluateShiftDistributionRating(
        employee.schedulingInformation.shift
      );

      // Calculate criteria for minConsecutiveDaysOff and consecutive working days
      let resultConsecutiveDays = qualityConsecutiveDays(employee);
      createdSchedules[i][0].quality.minConsecutiveDaysOff +=
        resultConsecutiveDays[0];
      createdSchedules[i][0].quality.consecutiveWorkingDays +=
        resultConsecutiveDays[1];
    });

    // Store the best value of each criteria for later filtering
    for (const key in bestRatings) {
      // Round all quality values
      createdSchedules[i][0].quality[key] =
        Math.round(createdSchedules[i][0].quality[key] * 1000) / 1000;

      // Find the best ratings
      if (createdSchedules[i][0].quality[key] < bestRatings[key]) {
        bestRatings[key] = createdSchedules[i][0].quality[key];
      }
    }
  }

  if (lastBest.length > 0) {
    createdSchedules.push(...lastBest);
  }

  return findBestSchedules(createdSchedules);
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
  // need to add the interchangeable!!!
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
        employee.information.consecutiveWorkingDays.preferred
      ) {
        employee.schedulingInformation.possibleShifts[
          employee.schedulingInformation.recentAssignment.shift
        ] =
          ((employee.information.consecutiveWorkingDays.preferred -
            employee.schedulingInformation.recentAssignment.numberOfDays) /
            employee.information.consecutiveWorkingDays.preferred) *
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
    for (let i = 1; i < shiftInformation.length; i++) {
      // console.log(
      //   `${employee.information.name} ${i} Dist: ${employee.schedulingInformation.shift.plannedDistribution[i]}`
      // );
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
  // If workingDays are larger than plannedWorkingDays, the formula could produce negative probabilities
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
//   console.log("shift information", shiftInformation);
//   for (let i = 1; i < shiftInformation.length; i++) {
//     if (shiftInformation[i].hasOwnProperty("interchangeableWith")) {
//       shiftInformation[i].interchangeableWith.forEach((interchangeable) => {
//         if (
//           schedulingInformation.possibleShifts[i] >
//           schedulingInformation.possibleShifts[interchangeable]
//         ) {
//           schedulingInformation.possibleShifts[interchangeable] =
//             schedulingInformation.possibleShifts[i];
//         } else {
//           schedulingInformation.possibleShifts[i] =
//             schedulingInformation.possibleShifts[interchangeable];
//         }
//       });
//     }

//     if (!shiftInformation[i].autoAssign) {
//       schedulingInformation.possibleShifts[i] = 0;
//     }
//   }
// }

function initializeSchedule(employeeInformation) {
  // Initialized a schedule with the employee information.
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
          preferred: employee.consecutiveWorkingDays.preferred,
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
  initializedSchedule[0].quality = {
    totalHourDifference: 0,
    shiftDistribution: 0,
    minConsecutiveDaysOff: 0,
    consecutiveWorkingDays: 0,
  };
  initializedSchedule[0].target = 1;
  return initializedSchedule;
}

function parseShiftObject(shiftDist) {
  let plannedDistribution = [];
  let workedDistribution = [];
  let map = [];

  // Fill for day off shift
  plannedDistribution.push(0);
  workedDistribution.push(0);
  map.push(' ');

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
    employee.consecutiveWorkingDays.preferred = parseInt(
      employee.consecutiveWorkingDays.preferred,
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

module.exports = { runScheduler, multipleScheduler };
