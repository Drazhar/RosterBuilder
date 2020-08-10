import { evaluateShiftDistributionRating } from "./evaluateShiftDistributionRating";

test("Strange shift distributions", () => {
  let result = evaluateShiftDistributionRating({
    plannedDistribution: [0, 0, 1],
    worked: [0, 4, 0],
  });
  // This should be 0, because the employee has only worked shifts which are
  // assigned manually and no shift automatically.
  expect(result).toBeCloseTo(0);
});

test("Perfect distributions", () => {
  expect(
    evaluateShiftDistributionRating({
      plannedDistribution: [0, 1, 1],
      worked: [0, 1, 1],
    })
  ).toBe(0);

  expect(
    evaluateShiftDistributionRating({
      plannedDistribution: [0, 1, 1],
      worked: [0, 4, 4],
    })
  ).toBe(0);

  expect(
    evaluateShiftDistributionRating({
      plannedDistribution: [0, 5, 2],
      worked: [0, 10, 4],
    })
  ).toBe(0);
});

test("Okayisch distributions", () => {
  let result = evaluateShiftDistributionRating({
    plannedDistribution: [0, 2, 2, 1],
    worked: [0, 2, 1, 1],
  });
  expect(result).toBeGreaterThan(0);
  expect(result).toBeLessThan(1);

  result = evaluateShiftDistributionRating({
    plannedDistribution: [0, 1, 1, 1],
    worked: [0, 2, 1, 1],
  });
  expect(result).toBeGreaterThan(0);
  expect(result).toBeLessThan(1);

  result = evaluateShiftDistributionRating({
    plannedDistribution: [0, 0, 1, 1],
    worked: [0, 3, 2, 1],
  });
  expect(result).toBeGreaterThan(0);
  expect(result).toBeLessThan(1);

  result = evaluateShiftDistributionRating({
    plannedDistribution: [0, 1, 1, 1],
    worked: [0, 1, 0, 0],
  });
  expect(result).toBeGreaterThan(0);
  expect(result).toBeLessThan(1);
});

test("Bad distributions", () => {
  let result = evaluateShiftDistributionRating({
    plannedDistribution: [0, 1, 1, 1],
    worked: [0, 3, 2, 1],
  });
  expect(result).toBeGreaterThan(1);

  result = evaluateShiftDistributionRating({
    plannedDistribution: [0, 1, 1, 1, 1, 1, 5],
    worked: [0, 3, 2, 1, 1, 2],
  });
  expect(result).toBeGreaterThan(1);
});
