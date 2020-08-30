import { convertShiftWishesVacation } from './convertShiftWishesVacation';

test('01', () => {
  const employeeInformation = [
    {
      shiftVacation: [' ', 'CDpcQc', 'c3i-JR', 0],
      shiftWishes: [' ', 'CDpcQc', 'c3i-JR', 0],
    },
  ];
  const shiftInformation = [{}, { id: 'CDpcQc' }, { id: 'c3i-JR' }];

  convertShiftWishesVacation(employeeInformation, shiftInformation);

  expect(employeeInformation).toStrictEqual([
    {
      shiftVacation: [0, 1, 2, -1],
      shiftWishes: [0, 1, 2, -1],
    },
  ]);
});
