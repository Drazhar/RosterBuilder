import { cloneDeep } from 'lodash';

export function runScheduler(employeeInformation, shiftInformation, dateArray) {
  shiftInformation.unshift({ id: ' ', name: ' ' });

  const resultingPlans = [];
  const wipPlan = [];

  for (let i = 0; i < employeeInformation.length; i++) {
    wipPlan.push(new Array(dateArray.length).fill(-1));
  }

  let employee = 0;
  let day = 0;
  let isFinished = false;

  while (!isFinished) {
    wipPlan[employee][day]++;

    let shouldBacktrack = false;
    // Todo: Check if valid

    // Check if it should backtrack, assigns unvisited value and push wipPlan if
    // finished.
    if (!shouldBacktrack) {
      if (wipPlan[employee][day] >= shiftInformation.length) {
        shouldBacktrack = true;
        wipPlan[employee][day] = -1;
      } else if (
        employee == wipPlan.length - 1 &&
        day == dateArray.length - 1
      ) {
        resultingPlans.push(cloneDeep(wipPlan));
      }
    }

    // Traversing the wipPlan by day and employee
    if (shouldBacktrack) {
      day--;
      if (day < 0) {
        employee--;
        if (employee < 0) {
          isFinished = true;
          break;
        }
        day = dateArray.length - 1;
      }
    } else {
      day++;
      if (day >= dateArray.length) {
        employee++;
        if (employee >= wipPlan.length) {
          employee--;
          day = dateArray.length - 1;
        } else {
          day = 0;
        }
      }
    }

    // Check if finished
    if (wipPlan[0][0] > shiftInformation.length) {
      isFinished = true;
    }
  }

  console.log(resultingPlans.length);
  resultingPlans.forEach((plan) =>
    console.log(`${plan[0][0]} ${plan[0][1]} ${plan[1][0]} ${plan[1][1]}`)
  );

  return [
    {
      quality: { qualityRating: 1, secondRating: 2 },
      assignedShifts: [
        [1, 1, 1, 1, 0, 0, 0],
        [0, 0, 0, 0, 1, 1, 1],
      ],
    },
  ];
}

function DFS(
  wipPlan,
  employee,
  day,
  dateArray,
  employeeInformation,
  shiftInformation,
  resultingPlans
) {
  DFS(
    wipPlan,
    employee,
    day,
    dateArray,
    employeeInformation,
    shiftInformation,
    resultingPlans
  );

  /* DFS logic:
- Select the next entry
- Check if shift 0 is possible
- If yes assign shift 0 and continue
- If no check if shift 1 is possible
- If yes assign shift 1 and continue
- Redo for n - 1 number of shifts
- Check if shift n is possible
- If yes assign shift n and continue
- If no go to prev entry and increase the shifts till n shifts

- At last entry push plan to result and go back until a shift number can be
  increased. If none can be increased, all possibilities are tested.
  */
}
