export function validShiftOccupation(day, employee, wipPlan, shiftInformation) {
  if (wipPlan[employee][day] > 0) {
    let occupationCount = 1;
    for (let i = employee - 1; i >= 0; i--) {
      if (wipPlan[employee][day] === wipPlan[i][day]) {
        occupationCount++;
      }
    }
    if (
      occupationCount >
      shiftInformation[wipPlan[employee][day]].requiredEmployees
    ) {
      return false;
    }
  }

  return true;
}
