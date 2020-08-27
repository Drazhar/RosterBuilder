import { runScheduler } from '../scheduler/main.js';

onmessage = (e) => {
  let result = work(e.data);

  result.then((res) => {
    postMessage(res);
  });
};

async function work(data) {
  let result = await runScheduler(
    data.iterations,
    data.employees,
    data.shifts,
    data.dateArray,
    data.lastBest
  );

  return result;
}
