function findBestSchedules(createdSchedules) {
  // let createdSchedulesBest = [];
  // for (let i = 0; i < createdSchedules.length; i++) {
  //   if (
  //     createdSchedules[i][0].target <= bestTargetFunction * 1.5 &&
  //     bestRatings.minConsecutiveDaysOff === 0
  //   ) {
  //     createdSchedulesBest.push(createdSchedules[i]);
  //   }
  // }
  // // Sort the best ones
  // createdSchedulesBest.sort((a, b) => {
  //   if (a[0].target < b[0].target) {
  //     return -1;
  //   }
  //   return 1;
  // });

  let createdSchedulesBest = getParetoFront(createdSchedules);

  // // Replace numbers with names for better overview
  createdSchedulesBest.forEach((schedule) => {
    schedule.forEach((employee, i) => {
      employee.assignedShifts.forEach((shift, j) => {
        schedule[i].assignedShifts[j] =
          employee.schedulingInformation.shift.map[shift];
      });
    });
  });

  // Merge quality ratings
  // console.time('KungTime');
  // getParetoFront(createdSchedules);
  // console.timeEnd('KungTime');

  return createdSchedulesBest;
}

function getParetoFront(createdSchedules) {
  const P = createdSchedules.sort((a, b) => {
    // if (a[0].target < b[0].target) {
    if (a[0].quality.totalHourDifference < b[0].quality.totalHourDifference) {
      return -1;
    }
    return 1;
  });

  return kungAlgorithm(P);
}

function kungAlgorithm(P) {
  if (P.length === 1) {
    return P;
  }
  const T = kungAlgorithm(P.slice(0, P.length / 2));
  const B = kungAlgorithm(P.slice(P.length / 2));
  // Check for domination
  const M = [...T];
  for (const B_ITEM of B) {
    if (B_ITEM[0].quality.minConsecutiveDaysOff !== 0) {
      continue;
    }
    let isDominated = false;
    for (const T_ITEM of T) {
      let allWorse = [];
      for (const key in T_ITEM[0].quality) {
        if (key !== 'minConsecutiveDaysOff') {
          // console.log(`KEY: ${key}`);
          // console.log(
          //   `T: ${T_ITEM[0].quality[key]} B: ${B_ITEM[0].quality[key]}`
          // );
          if (B_ITEM[0].quality[key] >= T_ITEM[0].quality[key]) {
            allWorse.push(true);
          } else {
            allWorse.push(false);
          }
        }
      }
      // console.log(...allWorse);
      if (allWorse.every((item) => item)) {
        // console.log('is Dominated');
        isDominated = true;
      }
      if (isDominated) {
        break;
      }
    }
    if (!isDominated) {
      M.push(B_ITEM);
    }
  }
  return M;
}

module.exports = { findBestSchedules };
