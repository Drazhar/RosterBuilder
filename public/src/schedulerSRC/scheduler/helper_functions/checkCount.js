export function checkCount(plan, day, shouldReturnShift = false) {
  let dayCount = 1;
  let lastShift = plan[day];
  for (let i = day - 1; i >= 0; i--) {
    if (plan[day] === plan[i]) {
      dayCount++;
    } else {
      lastShift = plan[i];
      break;
    }
  }
  if (shouldReturnShift) {
    return [dayCount, lastShift];
  }
  return dayCount;
}
