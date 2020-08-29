export function checkCount(plan, day) {
  let dayCount = 1;
  for (let i = day - 1; i >= 0; i--) {
    if (plan[day] === plan[i]) {
      dayCount++;
    } else {
      break;
    }
  }
  return dayCount;
}
