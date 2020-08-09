import "./views/shiftSchedule-view";
import "./views/employees-view.js";
// import "./views/testing-view";
import "./style.scss";
import "./src/routing";

// Testing the scheduler
const runScheduler = require("./../src/scheduler/main");
console.log(
  runScheduler(
    1,
    JSON.parse(window.localStorage.getItem("definedEmployees")),
    JSON.parse(window.localStorage.getItem("definedShifts"))
  )
);
