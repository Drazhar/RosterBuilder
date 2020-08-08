export function setDefaultShiftDist(shifts) {
  let result = {};
  shifts.forEach((shift) => {
    result[shift.id] = 1;
  });
  return result;
}
