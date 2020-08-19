import './views/shiftSchedule-view';
import './views/employees-view.js';
// import "./views/testing-view";
import './style.scss';
import './src/routing';

// Testing the scheduler
const { multipleScheduler } = require('./../src/scheduler/main');
console.log(
  multipleScheduler(
    10,
    JSON.parse(window.localStorage.getItem('definedEmployees')),
    JSON.parse(window.localStorage.getItem('definedShifts'))
  )
);
