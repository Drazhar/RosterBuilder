import { LitElement, html, css } from 'lit-element';
import { scheduleConverter } from '../src/scheduleConverter';
import * as d3 from 'd3';
import { findIndexOfBest } from '../src/findIndexOfBest';
import { getDateArr } from '../src/getDateArr';
import Worker from 'worker-loader!../src/schedulerSRC/worker/scheduler.worker.js';

class shiftSchedule extends LitElement {
  static get properties() {
    return {
      scheduleToDisplay: { type: Array },
      shifts: { type: Array },
      indexToDisplay: { type: Number },
      isCreating: { type: Boolean },
      dateArray: { type: Array },
      maxQuality: {},
      scheduleFilters: { type: Object },
      filteredSchedules: { type: Object },
      settings: { type: Object },
      employees: { type: Object },
    };
  }

  constructor() {
    super();

    this.scheduleFilters = {};
    this.indexToDisplay = 0;

    this.employees = JSON.parse(
      window.localStorage.getItem('definedEmployees')
    );

    if (localStorage.getItem('lastSchedule') !== null) {
      this.scheduleToDisplay = JSON.parse(localStorage.getItem('lastSchedule'));
    } else {
      this.scheduleToDisplay = [
        {
          quality: { qualityRating: 1, secondRating: 2 },
          assignedShifts: [[1, 1, 1, 1, 0, 0, 0]],
        },
      ];
    }

    this.filteredSchedules = this.scheduleToDisplay;

    if (window.localStorage.getItem('definedShifts') === null) {
      this.shifts = [];
    } else {
      this.shifts = JSON.parse(window.localStorage.getItem('definedShifts'));
    }

    if (window.localStorage.getItem('settings') === null) {
      this.settings = {};
    } else {
      this.settings = JSON.parse(window.localStorage.getItem('settings'));
    }

    this.startDate = new Date(this.settings.startDate);
    this.dateArray = getDateArr(
      this.startDate,
      new Date(this.settings.endDate)
    );
  }

  showIndex(index) {
    this.indexToDisplay = index;
  }

  showNext() {
    if (this.indexToDisplay < this.filteredSchedules.length - 1) {
      this.indexToDisplay++;
    }
  }

  showPrev() {
    if (this.indexToDisplay > 0) {
      this.indexToDisplay--;
    }
  }

  btnStopCreate() {
    this.isCreating = false;
  }

  async btnCreateSchedule() {
    this.myWorker = new Worker();

    await this.createSchedule();
  }

  async createSchedule() {
    const data = {
      employees: this.employees,
      shifts: this.shifts,
      dateArray: this.dateArray,
    };
    this.myWorker.postMessage(data);

    this.myWorker.onmessage = (e) => {
      this.scheduleToDisplay = e.data;
      // localStorage.setItem(
      //   'lastSchedule',
      //   JSON.stringify(this.scheduleToDisplay)
      // );

      this.indexToDisplay = 0;

      this.filteredSchedules = this.scheduleToDisplay;

      this.requestUpdate();

      this.myWorker.terminate();
    };
  }

  setFilter(event) {
    this.scheduleFilters[event.path[0].id] = event.path[0].value;
    this.filteredSchedules = this.scheduleToDisplay.filter((item) => {
      for (let key in this.scheduleFilters) {
        if (item[0].quality[key] > this.scheduleFilters[key]) {
          return false;
        }
      }
      return true;
    });
    this.indexToDisplay = findIndexOfBest(this.filteredSchedules);
  }

  disconnectedCallback() {
    if (this.myWorker) {
      this.myWorker.terminate();
    }
    super.disconnectedCallback();
  }

  render() {
    return html`
      <div class="wrapper">
        <table>
          <col span="1" class="fixedWidth" />
          ${this.dateArray.map((item) => {
            if (item === 0 || item === 6) {
              return html`<col span="1" style="background-color:lightgrey" />`;
            } else {
              return html`<col span="1" />`;
            }
          })}
          <thead>
            <tr>
              <th></th>
              ${this.dateArray.map((item, index) => {
                let day = this.startDate.getDate() + index - 1;
                return html`<th>${day}.</th>`;
              })}
            </tr>
          </thead>
          <tbody>
            ${this.filteredSchedules.length == 0
              ? ''
              : this.filteredSchedules[this.indexToDisplay].assignedShifts.map(
                  (item, index) => {
                    return html`
                      <tr>
                        <th class="employeeNames">
                          ${this.employees[index].name}
                        </th>
                        ${scheduleConverter(item, this.shifts).map(
                          (assigned) => {
                            return html`
                              <td
                                colspan=${assigned.count}
                                style="${this.shifts.filter(
                                  (item) => item.id === assigned.value
                                ).length > 0
                                  ? `background-color:#${
                                      this.shifts.filter(
                                        (item) => item.id === assigned.value
                                      )[0].colors.backgroundColor
                                    }; color:#${
                                      this.shifts.filter(
                                        (item) => item.id === assigned.value
                                      )[0].colors.textColor
                                    }`
                                  : ''}"
                              >
                                ${this.shifts.filter(
                                  (item) => item.id === assigned.value
                                ).length > 0
                                  ? this.shifts.filter(
                                      (item) => item.id === assigned.value
                                    )[0].name +
                                    ' ' +
                                    assigned.count
                                  : ''}
                              </td>
                            `;
                          }
                        )}
                      </tr>
                    `;
                  }
                )}
          </tbody>
        </table>

        <div>
          <button @click="${this.btnCreateSchedule}">
            Start creating roster
          </button>
          <button @click="${this.showNext}">Show next</button>
          <button @click="${this.showPrev}">Show prev</button>
        </div>
        <p>Number of good schedules: ${this.filteredSchedules.length}</p>
        <p>Currently displayed: ${this.indexToDisplay}</p>
      </div>
    `;
  }

  static get styles() {
    return css`
      /* Table */
      * {
        font-family: 'Poppins', sans-serif;
      }

      .wrapper {
        display: flex;
        flex-direction: column;
        height: 100%;
        align-items: flex-start;
        justify-content: center;
      }

      table {
        margin: 5px;
        border-collapse: collapse;
        background-color: white;
        table-layout: fixed;
        overflow: hidden;
        width: 99%;
      }

      td,
      th {
        padding: 1px;
        border: 1px solid rgb(180, 180, 180);
        border-left-color: rgb(225, 225, 225);
        border-right-color: rgb(225, 225, 225);
        text-align: center;
        justify-content: center;
        width: 1fr;
        border-radius: 4px;
        opacity: 0.85;
        overflow: hidden;
        white-space: nowrap;
      }

      .qualityCells td {
        border: none;
      }

      td:hover {
        transition: all 0.4s ease-out;
        opacity: 1;
        /* cursor: pointer; */
      }

      .fixedWidth {
        width: 85px;
      }

      .employeeNames {
        font-weight: 500;
        padding: 6px;
        letter-spacing: 1px;
        text-align: left;
      }

      button {
        margin: 5px;
        padding: 10px;
        background-color: black;
        color: rgb(210, 210, 210);
        border: 1px solid blue;
        transition: background-color 0.3s ease-out, color 0.3s ease-out;
      }

      button:hover {
        cursor: pointer;
        background-color: blue;
        color: white;
      }

      #chart {
        width: 800px;
        height: 400px;
        background-color: white;
        border: 1px solid black;
      }

      .chartPoint:hover {
        cursor: pointer;
        fill: rgb(18, 170, 236);
      }

      .filters {
        display: flex;
        flex-direction: column;
      }
    `;
  }
}

customElements.define('shift-schedule', shiftSchedule);
