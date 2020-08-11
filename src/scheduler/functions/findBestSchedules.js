function findBestSchedules(
  createdSchedules,
  qualityRatings,
  bestRatings,
  targetFunctions,
  bestTargetFunction
) {
  // find at least 10 solutions with good values
  let createdSchedulesBest = [];
  //   let qualityRatingsBest = [];
  //   let targetFunctionsBest = [];

  for (let i = 0; i < qualityRatings.length; i++) {
    if (
      targetFunctions[i] <= bestTargetFunction * 2 &&
      bestRatings.minConsecutiveDaysOff === 0
    ) {
      createdSchedulesBest.push(createdSchedules[i]);
      //   qualityRatingsBest.push(qualityRatings[i]);
      //   targetFunctionsBest.push(targetFunctions[i]);
      createdSchedulesBest[createdSchedulesBest.length - 1][0].quality =
        qualityRatings[i];
      createdSchedulesBest[createdSchedulesBest.length - 1][0].target =
        targetFunctions[i];
    }
  }

  // Sort the best ones
  createdSchedulesBest.sort((a, b) => {
    if (a[0].target < b[0].target) {
      return -1;
    }
    return 1;
  });

  // Replace numbers with names for better overview
  createdSchedulesBest.forEach((schedule) => {
    schedule.forEach((employee, i) => {
      employee.assignedShifts.forEach((shift, j) => {
        schedule[i].assignedShifts[j] =
          employee.schedulingInformation.shift.map[shift];
      });
    });
  });

  return createdSchedulesBest;
}

module.exports = { findBestSchedules };
