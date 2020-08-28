import { runScheduler } from '../scheduler/DFS.js';

onmessage = (e) => {
  let result = work(e.data);

  return result;
};

function work(data) {
  let result = runScheduler(data.employees, data.shifts, data.dateArray);

  return result;
}
