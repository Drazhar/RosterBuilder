function getQualityWeekends(schedule, dateArr, shiftInformation) {
  let result = {
    weekendDistribution: 0, // The distribution of the employees for weekends
    weekendNonstop: 0, // Checks if an employee works the complete weekend or just one day
  };
  let weekendWorkCount = [];
  let shiftDummy = [];
  for (let i = 1; i < shiftInformation.length; i++) {
    shiftDummy.push(0);
  }
  schedule.forEach(() => {
    weekendWorkCount.push([...shiftDummy]);
  });

  for (let i = 0; i < dateArr.length; i++) {
    if (dateArr[i] === 6) {
      for (let j = 0; j < schedule.length; j++) {
        if (
          schedule[j].assignedShifts[i] !== schedule[j].assignedShifts[i + 1]
        ) {
          result.weekendNonstop++;
        }

        if (schedule[j].assignedShifts[i] !== 0) {
          weekendWorkCount[j][schedule[j].assignedShifts[i] - 1]++;
        }
      }
    }
  }

  for (let i = 0; i < shiftInformation.length - 1; i++) {
    let sum = 0;
    for (let j = 0; j < schedule.length; j++) {
      sum += weekendWorkCount[j][i];
    }
    let mean = sum / schedule.length;

    for (let j = 0; j < schedule.length; j++) {
      result.weekendDistribution += (weekendWorkCount[j][i] - mean) ** 2;
    }
  }

  return result;
}

module.exports = { getQualityWeekends };
