export function findIndexOfBest(schedules) {
  let bestTarget = Infinity;
  let bestIndex = 0;
  for (let i = 0; i < schedules.length; i++) {
    if (schedules[i][0].target < bestTarget) {
      bestTarget = schedules[i][0].target;
      bestIndex = i;
    }
  }
  return bestIndex;
}
