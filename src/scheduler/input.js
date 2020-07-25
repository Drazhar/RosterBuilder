const employeeInformationTemp = [
  {
    id: 1,
    name: "Mila",
    plannedWorkingTime: 216,
    overtime: 0,
    consecutiveWorkingDays: {
      min: 3,
      max: 5,
      prefered: 4,
    },
    minConsecutiveDaysOff: 2,
    shift: {
      distribution: [0, 1, 1, 1],
    },
  },
  {
    id: 2,
    name: "Philip",
    plannedWorkingTime: 216,
    overtime: 0,
    consecutiveWorkingDays: {
      min: 3,
      max: 5,
      prefered: 4,
    },
    minConsecutiveDaysOff: 2,
    shift: {
      distribution: [0, 1, 1, 1],
    },
  },
  {
    id: 3,
    name: "Hans",
    plannedWorkingTime: 216,
    overtime: 0,
    consecutiveWorkingDays: {
      min: 3,
      max: 5,
      prefered: 4,
    },
    minConsecutiveDaysOff: 2,
    shift: {
      distribution: [0, 1, 1, 1],
    },
  },
  {
    id: 4,
    name: "Andreas",
    plannedWorkingTime: 216,
    overtime: 0,
    consecutiveWorkingDays: {
      min: 3,
      max: 5,
      prefered: 4,
    },
    minConsecutiveDaysOff: 2,
    shift: {
      distribution: [0, 1, 1, 1],
    },
  },
  {
    id: 5,
    name: "Bernd",
    plannedWorkingTime: 216,
    overtime: 0,
    consecutiveWorkingDays: {
      min: 3,
      max: 5,
      prefered: 4,
    },
    minConsecutiveDaysOff: 2,
    shift: {
      distribution: [0, 1, 1, 1],
    },
  },
];

const shiftInformationTemp = [
  {
    name: " ",
    workingHours: 0,
    autoAssign: true,
  },
  {
    name: "D",
    workingHours: 12,
    autoAssign: true,
    requiredEmployees: 1,
  },
  {
    name: "N",
    workingHours: 12,
    autoAssign: true,
    requiredEmployees: 1,
  },
  {
    name: "T",
    workingHours: 12,
    autoAssign: false,
    requiredEmployees: 1,
  },
];

module.exports = { employeeInformationTemp, shiftInformationTemp };
