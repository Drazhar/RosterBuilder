export function validConsecutiveDays(
  day,
  employee,
  wipPlan,
  employeeInformation
) {
  /*
1. Min days off between shift blocks
  */

  // if (day > 0 && wipPlan[employee][day] > 0 && wipPlan[employee][day - 1] > 0) {
  //   if (wipPlan[employee][day] != wipPlan[employee][day - 1]) {
  //     return false;
  //   } else {
  //     let daysWorked = 1;
  //     for (let i = day - 1; i >= 0; i--) {
  //       if (wipPlan[employee][i] != wipPlan[employee][day]) {
  //         break;
  //       } else {
  //         daysWorked++;
  //       }
  //     }
  //     if (daysWorked > 3) return false;
  //   }
  // }

  return true;
}
