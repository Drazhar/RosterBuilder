export function convertShiftWishesVacation(
  employeeInformation,
  shiftInformation
) {
  employeeInformation.forEach((employee) => {
    for (let i = 0; i < employee.shiftVacation.length; i++) {
      looper(employee.shiftVacation, i, shiftInformation);
      looper(employee.shiftWishes, i, shiftInformation);
    }
  });
}

function looper(wishes, i, shiftInformation) {
  if (wishes[i] === '0' || wishes[i] === 0) {
    wishes[i] = -1;
  } else if (wishes[i] === ' ') {
    wishes[i] = 0;
  } else {
    for (let j = 1; j < shiftInformation.length; j++) {
      if (shiftInformation[j].id == wishes[i]) {
        wishes[i] = j;
      }
    }
  }
}
