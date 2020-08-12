export function scheduleConverter(plan) {
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
