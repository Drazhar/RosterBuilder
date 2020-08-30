export function validIndividualShiftCount(employeePlan, shiftCountPerEmployee) {
  let shiftCounter = [0, 0, 0];
  employeePlan.forEach((day) => {
    shiftCounter[day]++;
  });
  for (let i = 1; i < shiftCounter.length; i++) {
    if (
      shiftCounter[i] < shiftCountPerEmployee[0] ||
      shiftCounter[i] > shiftCountPerEmployee[1]
    ) {
      return false;
    }
  }
  return true;
}
