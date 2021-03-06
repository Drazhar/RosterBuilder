const { qualityWorkingHours } = require('./functions/qualityWorkingHours');
const {
  evaluateShiftDistributionRating,
} = require('./functions/evaluateShiftDistributionRating');
const {
  qualityConsecutiveDays,
} = require('./functions/qualityConsecutiveDays');
const { findBestSchedules } = require('./functions/findBestSchedules');
const { getQualityWeekends } = require('./functions/qualityWeekends');
const { getQualityWishes } = require('./functions/qualityWishes');
const { getQualityVacation } = require('./functions/qualityVacation');

function runScheduler(
  iterations = 1,
  employeeInformation,
  shiftInformation,
  dateArray,
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
    weekendDistribution: Infinity,
    weekendNonstop: Infinity,
    wishFulfillment: Infinity,
    vacationFulfillment: Infinity,
  };
  let targetWeights = {
    totalHourDifference: 1,
    shiftDistribution: 0.2,
    minConsecutiveDaysOff: 1,
    consecutiveWorkingDays: 0.2,
    weekendDistribution: 0.5,
    weekendNonstop: 1,
    wishFulfillment: 0.1,
    vacationFulfillment: 100,
  };
  const numberOfDays = dateArray.length; // This should be set outside of the function later.

  for (let i = 0; i < iterations; i++) {
    createdSchedules.push(initializeSchedule(employeeInformation));

    for (let currentDay = 0; currentDay < numberOfDays; currentDay++) {
      // Collect information and define probabilities for the individual shifts
      obtainInformation(createdSchedules[i], shiftInformation, currentDay);
      assignEmployees(
        createdSchedules[i],
        currentDay,
        shiftInformation,
        dateArray
      );
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
    // Quality for the weekends
    let qualityWeekendsObj = getQualityWeekends(
      createdSchedules[i],
      dateArray,
      shiftInformation
    );
    createdSchedules[i][0].quality.weekendDistribution =
      qualityWeekendsObj.weekendDistribution;
    createdSchedules[i][0].quality.weekendNonstop =
      qualityWeekendsObj.weekendNonstop;

    createdSchedules[i][0].quality.wishFulfillment = getQualityWishes(
      createdSchedules[i]
    );

    createdSchedules[i][0].quality.vacationFulfillment = getQualityVacation(
      createdSchedules[i]
    );

    // Store the best value of each criteria for later filtering
    for (const key in bestRatings) {
      // Round all quality values
      createdSchedules[i][0].quality[key] =
        Math.round(createdSchedules[i][0].quality[key] * 1000) / 1000;

      // Build the targetProduct
      createdSchedules[i][0].target *=
        (createdSchedules[i][0].quality[key] + 1) ** targetWeights[key];

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

function obtainInformation(inputSchedule, shiftInformation, currentDay) {
  inputSchedule.forEach((employee) => {
    // Check which shift assignments are possible
    if (employee.schedulingInformation.recentAssignment.shift === 0) {
      // Employee had at least one day off
      if (
        employee.schedulingInformation.recentAssignment.numberOfDays >=
        employee.information.minConsecutiveDaysOff
      ) {
        // Employee had minConsDaysOff
        employee.schedulingInformation.possibleShifts = new Array(
          shiftInformation.length
        ).fill(1);
      } else {
        // Employee had to less days off
        employee.schedulingInformation.possibleShifts = new Array(
          shiftInformation.length
        ).fill(0.0001);
      }
    } else {
      // Employee had no day off, still working. Set base probability
      employee.schedulingInformation.possibleShifts = new Array(
        shiftInformation.length
      ).fill(0.0001);

      if (
        employee.schedulingInformation.recentAssignment.numberOfDays <
        employee.information.consecutiveWorkingDays.min
      ) {
        // Employee worked less days than min
        employee.schedulingInformation.possibleShifts[
          employee.schedulingInformation.recentAssignment.shift
        ] = 1000;
      } else if (
        employee.schedulingInformation.recentAssignment.numberOfDays <
        employee.information.consecutiveWorkingDays.preferred
      ) {
        // Employee worked less days than preferred
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
        // employee worked less than max, more than preferred
        employee.schedulingInformation.possibleShifts[
          employee.schedulingInformation.recentAssignment.shift
        ] =
          (employee.information.consecutiveWorkingDays.max -
            employee.schedulingInformation.recentAssignment.numberOfDays) /
          employee.information.consecutiveWorkingDays.max;
      }
    }

    // Adjust probabilities regarding the shift distribution
    for (let i = 1; i < shiftInformation.length; i++) {
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
          relation = 4;
        } else if (relation < 0.1) {
          relation = 0.25;
        } else {
          relation = 1;
        }
        employee.schedulingInformation.possibleShifts[i] *= relation ** 2;
      }
    }

    reduceProbabilityForHighWorkload(employee);
    adjustProbabilityEmployeeWishes(employee, currentDay);
    adjustProbabilityEmployeeVacation(employee, currentDay);
  });
}

function assignEmployees(inputSchedule, day, shiftInformation, dateArray) {
  for (
    let currentShift = 1;
    currentShift < shiftInformation.length;
    currentShift++
  ) {
    let weekday = dateArray[day];
    let employeeAmount = shiftInformation[currentShift].requiredEmployees;
    if (weekday > 0 && weekday < 6) {
      const daysLeft = dateArray.length - day;
      let workHoursLeftMin = 0;
      let workHoursLeftMax = 0;
      for (let i = 1; i < shiftInformation.length; i++) {
        workHoursLeftMin +=
          daysLeft *
          shiftInformation[i].workingHours *
          shiftInformation[i].requiredEmployees;
        workHoursLeftMax +=
          daysLeft *
          shiftInformation[i].workingHours *
          shiftInformation[i].maxEmployees;
      }

      let employeeHoursLeft = 0;
      for (let i = 0; i < inputSchedule.length; i++) {
        employeeHoursLeft +=
          inputSchedule[i].information.plannedWorkingTime -
          inputSchedule[i].schedulingInformation.hoursWorked;
      }

      if (employeeHoursLeft >= workHoursLeftMax) {
        employeeAmount = shiftInformation[currentShift].maxEmployees;
      } else if (employeeHoursLeft > workHoursLeftMin) {
        let doubleShiftProb =
          1 -
          (employeeHoursLeft - workHoursLeftMin) /
            (workHoursLeftMax - workHoursLeftMin);

        if (Math.random() > doubleShiftProb) {
          employeeAmount = shiftInformation[currentShift].maxEmployees;
        }
      }
    }

    for (let i = 0; i < employeeAmount; i++) {
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
    employee.schedulingInformation.hoursWorked <
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
      (x) => (x * (1 - reducePlannedReached)) / 10
    );
  }
}

function adjustProbabilityEmployeeWishes(employee, currentDay) {
  if (employee.information.shiftWishes[currentDay] === ' ') {
    // Employee wants a day off
    for (
      let i = 0;
      i < employee.schedulingInformation.possibleShifts.length;
      i++
    ) {
      employee.schedulingInformation.possibleShifts[i] *= 0.1;
    }
  } else if (employee.information.shiftWishes[currentDay] != 0) {
    for (let i = 1; i < employee.schedulingInformation.shift.map.length; i++) {
      if (
        employee.schedulingInformation.shift.map[i] ==
        employee.information.shiftWishes[currentDay]
      ) {
        employee.schedulingInformation.possibleShifts[i] *= 10;
      }
    }
  }
}

function adjustProbabilityEmployeeVacation(employee, currentDay) {
  if (employee.information.shiftVacation[currentDay] === ' ') {
    // Employee wants a day off
    for (
      let i = 0;
      i < employee.schedulingInformation.possibleShifts.length;
      i++
    ) {
      employee.schedulingInformation.possibleShifts[i] *= 0.0001;
    }
  } else if (employee.information.shiftVacation[currentDay] != 0) {
    for (let i = 1; i < employee.schedulingInformation.shift.map.length; i++) {
      if (
        employee.schedulingInformation.shift.map[i] ==
        employee.information.shiftVacation[currentDay]
      ) {
        employee.schedulingInformation.possibleShifts[i] *= 10000;
      }
    }
  }
}

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
        shiftWishes: employee.shiftWishes,
        shiftVacation: employee.shiftVacation,
        initialAssignment: {
          shift: employee.recentAssignment.shift,
          numberOfDays: employee.recentAssignment.numberOfDays,
        },
      },
      schedulingInformation: {
        hoursWorked: 0,
        recentAssignment: {
          shift: employee.recentAssignment.shift,
          numberOfDays: employee.recentAssignment.numberOfDays,
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
    weekendDistribution: 0,
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

module.exports = { runScheduler };
