// 0 = Sunday
// 6 = Saturday

export function getDateArr(startDate, endDate) {
  let dayArr = [];
  const msPerDay = 24 * 60 * 60 * 1000;
  const daysCount = (endDate - startDate) / msPerDay;
  console.log('StartDate: ', startDate);

  for (let nDay = 0; nDay < daysCount; nDay++) {
    let newDay = new Date(
      Date.UTC(
        startDate.getFullYear(),
        startDate.getMonth(),
        startDate.getDay()
      )
    );
    newDay.setDate(startDate.getDate() + nDay);
    dayArr.push(newDay.getDay());
  }
  return dayArr;
}
