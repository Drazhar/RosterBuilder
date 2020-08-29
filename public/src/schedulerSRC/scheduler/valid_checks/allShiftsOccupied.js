export function validAllShiftsOccupied(
  day,
  employee,
  wipPlan,
  shiftInformation
) {
  let shiftCount = [0, 0, 0];
  for (let i = employee; i >= 0; i--) {
    if (wipPlan[i][day] > 0) {
      shiftCount[wipPlan[i][day]]++;
    }
  }

  for (let i = 1; i < shiftInformation.length; i++) {
    if (shiftCount[i] < shiftInformation[i].requiredEmployees) {
      return false;
    }
  }
  return true;
}
