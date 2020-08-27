import { qualityConsecutiveDays } from './qualityConsecutiveDays';

test('Consecutive Days off: Good', () => {
  let result = qualityConsecutiveDays({
    information: {
      consecutiveWorkingDays: {
        min: 2,
        max: 5,
        preferred: 4,
      },
      minConsecutiveDaysOff: 2,
      initialAssignment: {
        shift: ' ',
        numberOfDays: 5,
      },
    },
    assignedShifts: [1, 1, 1, 1, 0, 0, 0, 2, 2, 2, 2, 0, 0, 0, 0, 2],
  });
  // This should be 0, because the employee has only worked shifts which are
  // assigned manually and no shift automatically.
  expect(result[0]).toBeCloseTo(0);
});

test('Consecutive Days off: Bad', () => {
  let result = qualityConsecutiveDays({
    information: {
      consecutiveWorkingDays: {
        min: 2,
        max: 5,
        preferred: 4,
      },
      minConsecutiveDaysOff: 2,
      initialAssignment: {
        shift: ' ',
        numberOfDays: 5,
      },
    },
    assignedShifts: [1, 1, 1, 1, 0, 2, 2, 2, 2, 0, 0, 0],
  });

  expect(result[0]).toBeGreaterThan(0);
});

test('Consecutive Working Days: Below min', () => {
  let result = qualityConsecutiveDays({
    information: {
      consecutiveWorkingDays: {
        min: 2,
        max: 5,
        preferred: 4,
      },
      minConsecutiveDaysOff: 2,
      initialAssignment: {
        shift: ' ',
        numberOfDays: 5,
      },
    },
    assignedShifts: [1, 0, 0],
  });

  expect(result[0]).toBeCloseTo(0);
  expect(result[1]).toBeGreaterThan(36);
});

test('Consecutive Working Days: Below preferred', () => {
  let result = qualityConsecutiveDays({
    information: {
      consecutiveWorkingDays: {
        min: 2,
        max: 5,
        preferred: 4,
      },
      minConsecutiveDaysOff: 2,
      initialAssignment: {
        shift: ' ',
        numberOfDays: 5,
      },
    },
    assignedShifts: [1, 1, 0],
  });

  expect(result[0]).toBeCloseTo(0);
  expect(result[1]).toBeCloseTo(1);

  result = qualityConsecutiveDays({
    information: {
      consecutiveWorkingDays: {
        min: 2,
        max: 5,
        preferred: 4,
      },
      minConsecutiveDaysOff: 2,
      initialAssignment: {
        shift: ' ',
        numberOfDays: 5,
      },
    },
    assignedShifts: [1, 1, 1, 0],
  });

  expect(result[0]).toBeCloseTo(0);
  expect(result[1]).toBeLessThan(1);
  expect(result[1]).toBeGreaterThan(0);
});

test('Consecutive Working Days: Above max', () => {
  let result = qualityConsecutiveDays({
    information: {
      consecutiveWorkingDays: {
        min: 2,
        max: 5,
        preferred: 4,
      },
      minConsecutiveDaysOff: 2,
      initialAssignment: {
        shift: ' ',
        numberOfDays: 5,
      },
    },
    assignedShifts: [1, 1, 1, 1, 1, 1, 1, 0],
  });

  expect(result[0]).toBeCloseTo(0);
  expect(result[1]).toBeGreaterThan(1);

  result = qualityConsecutiveDays({
    information: {
      consecutiveWorkingDays: {
        min: 2,
        max: 5,
        preferred: 4,
      },
      minConsecutiveDaysOff: 2,
      initialAssignment: {
        shift: ' ',
        numberOfDays: 5,
      },
    },
    assignedShifts: [1, 1, 1, 1, 1, 1, 1],
  });

  expect(result[0]).toBeCloseTo(0);
  expect(result[1]).toBeGreaterThan(1);
});

test('Occuring Error during development', () => {
  let result = qualityConsecutiveDays({
    information: {
      consecutiveWorkingDays: {
        min: 2,
        max: 5,
        preferred: 4,
      },
      minConsecutiveDaysOff: 2,
      initialAssignment: {
        shift: ' ',
        numberOfDays: 5,
      },
    },
    assignedShifts: [
      0,
      0,
      0,
      3,
      1,
      1,
      1,
      0,
      0,
      0,
      0,
      3,
      3,
      3,
      3,
      0,
      0,
      0,
      0,
      0,
      2,
      2,
      2,
      2,
      0,
      0,
      0,
      0,
      2,
      2,
    ],
  });

  expect(result[0]).toBeGreaterThan(0);
});

test('Initial shift considered: Good', () => {
  let result = qualityConsecutiveDays({
    information: {
      consecutiveWorkingDays: {
        min: 2,
        max: 5,
        preferred: 4,
      },
      minConsecutiveDaysOff: 2,
      initialAssignment: {
        shift: 1,
        numberOfDays: 1,
      },
    },
    assignedShifts: [1, 1, 1, 1],
  });
  expect(result[0]).toBeCloseTo(0);
  expect(result[1]).toBeCloseTo(1);
});
