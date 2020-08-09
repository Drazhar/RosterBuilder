import { qualityWorkingHours } from "./qualityRating";

test("Overtime 0", () => {
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

  expect(
    qualityWorkingHours({
      information: {
        plannedWorkingTime: 192,
        overtime: 0,
      },
      schedulingInformation: {
        hoursWorked: 172.8,
      },
    })
  ).toBeCloseTo(2);
});

test("Overtime positive", () => {
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
  ).toBeCloseTo(0.5208);

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
  ).toBeCloseTo(400);
});

test("Overtime negative", () => {
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
  ).toBeCloseTo(0.5208);

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
