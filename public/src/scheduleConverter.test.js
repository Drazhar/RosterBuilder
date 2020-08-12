import { scheduleConverter } from './scheduleConverter';

const testArrays = [
  {
    input: [' ', ' ', 'D', 'D', 'N', ' ', ' ', 'D', 'D', 'D'],
    output: [
      { value: ' ', count: 1 },
      { value: ' ', count: 1 },
      { value: 'D', count: 2 },
      { value: 'N', count: 1 },
      { value: ' ', count: 1 },
      { value: ' ', count: 1 },
      { value: 'D', count: 3 },
    ],
  },
  {
    input: ['D', 'D', 'D', 'D', 'D'],
    output: [{ value: 'D', count: 5 }],
  },
];

test('Checking conversions', () => {
  testArrays.forEach((item) => {
    expect(scheduleConverter(item.input)).toEqual(item.output);
  });
});
