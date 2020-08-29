import { runScheduler } from '../scheduler/DFS.js';

onmessage = (e) => {
  let result = work(e.data);

  postMessage(result);
};

function work(data) {
  console.time('scheduler');
  let result = runScheduler(data.employees, data.shifts, data.dateArray);
  console.timeEnd('scheduler');
  return result;
}
