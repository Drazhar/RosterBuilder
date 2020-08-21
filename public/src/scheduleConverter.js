export function scheduleConverter(plan, shifts) {
  shiftNumbersToNames(plan, shifts);
  let result = [];
  plan.forEach((element) => {
    if (
      result.length === 0 ||
      result[result.length - 1].value !== element ||
      element === ' '
    ) {
      result.push({
        value: element,
        count: 1,
      });
    } else {
      result[result.length - 1].count++;
    }
  });
  return result;
}

function shiftNumbersToNames(plan, shifts) {
  for (let i = 0; i < plan.length; i++) {
    if (typeof plan[i] == 'number') {
      if (plan[i] == 0) {
        plan[i] = ' ';
      } else {
        if (shifts.length >= plan[i]) {
          plan[i] = shifts[plan[i] - 1].id;
        }
      }
    }
  }
}
