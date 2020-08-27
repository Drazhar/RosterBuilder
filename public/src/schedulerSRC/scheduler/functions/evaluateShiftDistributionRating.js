/**
 * Evaluates a quality rating for the distribution of the
 * shifts.
 *
 * @param {*} shiftDistributions
 * @returns {Number} Quality rating
 */
function evaluateShiftDistributionRating(shiftDistributions) {
  let returnValue = 0;

  // Scale the planned distribution to the actual working days from the worked
  // distribution. Ignore values where planned is 0 because these shifts won't
  // be applied automatically, only due to wishes.
  const DAYS_WORKED = shiftDistributions.worked.reduce(
    (accumulator, current, i) => {
      if (shiftDistributions.plannedDistribution[i] === 0) {
        return accumulator;
      }
      return accumulator + current;
    }
  );
  const SUM_PLANNED = shiftDistributions.plannedDistribution.reduce(
    (acc, curr) => acc + curr
  );

  const normalizedPlanned = shiftDistributions.plannedDistribution.map(
    (item) => (item / SUM_PLANNED) * DAYS_WORKED
  );

  for (let i = 1; i < shiftDistributions.worked.length; i++) {
    if (shiftDistributions.plannedDistribution[i] !== 0) {
      returnValue +=
        (Math.abs(normalizedPlanned[i]) -
          Math.abs(shiftDistributions.worked[i])) **
        2;
    }
  }
  return returnValue;
}

module.exports = { evaluateShiftDistributionRating };
