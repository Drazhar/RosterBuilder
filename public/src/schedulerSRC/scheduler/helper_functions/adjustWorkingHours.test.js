import { adjustPlannedWorkingHours } from './adjustWorkingHours';

test('01', () => {
  let employeeInformation = [
    { plannedWorkingTime: 84 },
    { plannedWorkingTime: 84 },
    { plannedWorkingTime: 84 },
    { plannedWorkingTime: 84 },
  ];
  const availableWorkingHours = employeeInformation.reduce(
    (result, value) => result + value.plannedWorkingTime,
    0
  );
  let requiredWorkingHours = 336;

  adjustPlannedWorkingHours(
    availableWorkingHours,
    requiredWorkingHours,
    employeeInformation
  );

  expect(employeeInformation).toStrictEqual([
    { plannedWorkingTime: 84 },
    { plannedWorkingTime: 84 },
    { plannedWorkingTime: 84 },
    { plannedWorkingTime: 84 },
  ]);
});

test('02', () => {
  let employeeInformation = [
    { plannedWorkingTime: 84 },
    { plannedWorkingTime: 84 },
    { plannedWorkingTime: 84 },
    { plannedWorkingTime: 84 },
  ];
  const availableWorkingHours = employeeInformation.reduce(
    (result, value) => result + value.plannedWorkingTime,
    0
  );
  let requiredWorkingHours = 400;

  adjustPlannedWorkingHours(
    availableWorkingHours,
    requiredWorkingHours,
    employeeInformation
  );

  expect(employeeInformation).toStrictEqual([
    { plannedWorkingTime: 100 },
    { plannedWorkingTime: 100 },
    { plannedWorkingTime: 100 },
    { plannedWorkingTime: 100 },
  ]);
});

test('03', () => {
  let employeeInformation = [
    { plannedWorkingTime: 10 },
    { plannedWorkingTime: 30 },
    { plannedWorkingTime: 30 },
    { plannedWorkingTime: 30 },
  ];
  const availableWorkingHours = employeeInformation.reduce(
    (result, value) => result + value.plannedWorkingTime,
    0
  );
  let requiredWorkingHours = 1000;

  adjustPlannedWorkingHours(
    availableWorkingHours,
    requiredWorkingHours,
    employeeInformation
  );

  expect(employeeInformation).toStrictEqual([
    { plannedWorkingTime: 100 },
    { plannedWorkingTime: 300 },
    { plannedWorkingTime: 300 },
    { plannedWorkingTime: 300 },
  ]);
});
