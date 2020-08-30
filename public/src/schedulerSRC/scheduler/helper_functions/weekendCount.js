export function getWeekendCount(dayCount, dateArray) {
  let weekendCount = 0;
  for (let i = 0; i < dayCount; i++) {
    if (i === dayCount - 1) {
      if (dateArray[i] === 6) {
        weekendCount++;
      }
    } else {
      if (dateArray[i] === 0) {
        weekendCount++;
      }
    }
  }
  return weekendCount;
}
