const { parentPort, workerData } = require("worker_threads");
const runScheduler = require("./../scheduler/main");

parentPort.postMessage(
  runScheduler(workerData.iterations, workerData.employees)
);
