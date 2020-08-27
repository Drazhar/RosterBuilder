import { qualityWorkingHours } from './qualityWorkingHours';

test('Overtime 0', () => {
  expect(
    qualityWorkingHours({
      information: {
        plannedWorkingTime: 192,
        overtime: 0,
      },
      schedulingInformation: {
        hoursWorked: 192,
      },
    })
  ).toBe(0);
});

test('02 Overtime 0', () => {
  expect(
    qualityWorkingHours({
      information: {
        plannedWorkingTime: 192,
        overtime: 0,
      },
      schedulingInformation: {
        hoursWorked: 100,
      },
    })
  ).toBe(8464);
});

test('Overtime positive 01', () => {
  expect(
    qualityWorkingHours({
      information: {
        plannedWorkingTime: 192,
        overtime: 10,
      },
      schedulingInformation: {
        hoursWorked: 182,
      },
    })
  ).toBeCloseTo(0);
});

test('Overtime positive 02', () => {
  expect(
    qualityWorkingHours({
      information: {
        plannedWorkingTime: 192,
        overtime: 10,
      },
      schedulingInformation: {
        hoursWorked: 202,
      },
    })
  ).toBeCloseTo(100);
});

test('Overtime positive 03', () => {
  expect(
    qualityWorkingHours({
      information: {
        plannedWorkingTime: 192,
        overtime: 10,
      },
      schedulingInformation: {
        hoursWorked: 172,
      },
    })
  ).toBeCloseTo(100);
});

test('Overtime negative 01', () => {
  expect(
    qualityWorkingHours({
      information: {
        plannedWorkingTime: 192,
        overtime: -10,
      },
      schedulingInformation: {
        hoursWorked: 202,
      },
    })
  ).toBeCloseTo(0);
});

test('Overtime negative 02', () => {
  expect(
    qualityWorkingHours({
      information: {
        plannedWorkingTime: 192,
        overtime: -10,
      },
      schedulingInformation: {
        hoursWorked: 182,
      },
    })
  ).toBeCloseTo(100);
});
