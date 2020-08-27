function getQualityWishes(schedule) {
  let result = 0;

  for (let i = 0; i < schedule.length; i++) {
    let amountUnfulfilled = 0;
    for (let j = 0; j < schedule[i].assignedShifts.length; j++) {
      if (
        schedule[i].information.shiftWishes[j] !== 0 &&
        schedule[i].information.shiftWishes[j] !== '0'
      ) {
        let shiftIndex = schedule[i].assignedShifts[j];
        if (
          schedule[i].information.shiftWishes[j] === ' ' &&
          schedule[i].assignedShifts[j] !== 0
        ) {
          // Employee wants a day off, but hasn't one
          amountUnfulfilled++;
          result += 1 / amountUnfulfilled ** 2;
        } else if (
          schedule[i].information.shiftWishes[j] != 0 &&
          schedule[i].information.shiftWishes[j] !=
            schedule[i].schedulingInformation.shift.map[shiftIndex]
        ) {
          amountUnfulfilled++;
          result += 1 / amountUnfulfilled ** 2;
        }
      }
    }
  }

  return result;
}

module.exports = { getQualityWishes };
