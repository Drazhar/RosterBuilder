export function validNonStopWeekend(shiftNow, shiftYesterday) {
  if (shiftNow > 0 || shiftYesterday > 0) {
    if (shiftNow !== shiftYesterday) {
      return false;
    }
  }
  return true;
}
