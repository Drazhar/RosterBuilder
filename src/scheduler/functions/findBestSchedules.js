function findBestSchedules(createdSchedules) {
  return getParetoFront(createdSchedules);
}

function getParetoFront(P) {
  if (P.length === 1) {
    return P;
  }
  const T = getParetoFront(P.slice(0, P.length / 2));
  const B = getParetoFront(P.slice(P.length / 2));

  let B_notDominated = checkDomination(B, T);
  let T_notDominated = checkDomination(T, B_notDominated);

  return [...T_notDominated, ...B_notDominated];
}

function checkDomination(B, T) {
  let M = [];
  for (const B_ITEM of B) {
    if (B_ITEM[0].quality.minConsecutiveDaysOff !== 0) {
      continue;
    }
    let isDominated = false;
    for (const T_ITEM of T) {
      let allWorse = [];

      for (const key in T_ITEM[0].quality) {
        if (key !== 'minConsecutiveDaysOff') {
          if (B_ITEM[0].quality[key] >= T_ITEM[0].quality[key]) {
            allWorse.push(true);
          } else {
            allWorse.push(false);
          }
        }
      }
      if (allWorse.every((item) => item)) {
        isDominated = true;
      }
      if (isDominated) {
        break;
      }
    }
    if (!isDominated) {
      M.push(B_ITEM);
    }
  }
  return M;
}

module.exports = { findBestSchedules, getParetoFront };
