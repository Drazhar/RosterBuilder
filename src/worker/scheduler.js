const { parentPort, workerData } = require('worker_threads');
const { multipleScheduler } = require('./../scheduler/main');

parentPort.postMessage(
  multipleScheduler(
    workerData.iterations,
    workerData.employees,
    workerData.shifts
  )
);
