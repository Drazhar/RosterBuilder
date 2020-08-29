// 0 = Sunday
// 6 = Saturday

export function getDateArr(startDate, endDate) {
  let dayArr = [];
  let loop = startDate;
  while (loop < endDate) {
    dayArr.push(loop.getDay());
    let newDate = loop.setDate(loop.getDate() + 1);
    loop = new Date(newDate);
  }

  return dayArr;
}
