import { validWishes } from './wishes';

test('01', () => {
  const wishes = 0;
  const employeePlan = 0;

  expect(validWishes(wishes, employeePlan)).toBe(true);
});

test('02', () => {
  const wishes = -1;
  const employeePlan = 1;

  expect(validWishes(wishes, employeePlan)).toBe(true);
});

test('03', () => {
  const wishes = 0;
  const employeePlan = 1;

  expect(validWishes(wishes, employeePlan)).toBe(false);
});

test('04', () => {
  const wishes = -1;
  const employeePlan = 0;

  expect(validWishes(wishes, employeePlan)).toBe(true);
});

test('05', () => {
  const wishes = -1;
  const employeePlan = 2;

  expect(validWishes(wishes, employeePlan)).toBe(true);
});
