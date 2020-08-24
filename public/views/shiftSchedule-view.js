import { LitElement, html, css } from 'lit-element';
import { scheduleConverter } from '../src/scheduleConverter';
import * as d3 from 'd3';
import { findIndexOfBest } from '../src/findIndexOfBest';
import { getDateArr } from '../src/getDateArr';

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
    };
  }

  constructor() {
    super();

    this.scheduleFilters = {};
    this.indexToDisplay = 0;
    this.isCreating = 0;

    if (localStorage.getItem('lastSchedule') !== null) {
      this.scheduleToDisplay = JSON.parse(localStorage.getItem('lastSchedule'));
    } else {
      this.scheduleToDisplay = [
        [
          {
            assignedShifts: [' '],
            information: { name: 'empty' },
            schedulingInformation: { hoursWorked: 0 },
            quality: { minConsecutiveDaysOffCheck: 0 },
          },
        ],
      ];
    }

    this.filteredSchedules = this.scheduleToDisplay.filter((item) => {
      for (let key in this.scheduleFilters) {
        if (item[0].quality[key] > this.scheduleFilters[key]) {
          return false;
        }
      }
      return true;
    });

    this.maxQuality = getMaxQuality(this.scheduleToDisplay);

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
    this.isCreating = true;
    let isFirst = true;
    while (this.isCreating) {
      let lastBest = [];
      if (!isFirst) {
        lastBest = this.scheduleToDisplay;
      }

      const createdSchedule = await this.createSchedule(lastBest);
      if (createdSchedule.status === 'success') {
        // console.log(createdSchedule.result);
        this.scheduleToDisplay = createdSchedule.result;
        localStorage.setItem(
          'lastSchedule',
          JSON.stringify(this.scheduleToDisplay)
        );
      }
      isFirst = false;
      this.indexToDisplay = findIndexOfBest(this.filteredSchedules);
      this.maxQuality = getMaxQuality(this.scheduleToDisplay);
    }
  }

  async createSchedule(lastBest) {
    const data = {
      iterations: 50000,
      employees: JSON.parse(window.localStorage.getItem('definedEmployees')),
      shifts: this.shifts,
      lastBest,
      dateArray: this.dateArray,
    };
    const response = await fetch(`http://127.0.0.1:3000/api/createSchedule`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await response.json();
    return json;
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

  render() {
    return html`
      <div class="wrapper">
        <table>
          <col span="1" class="fixedWidth" />
          ${this.dateArray.map((item, index) => {
            if (item === 0 || item === 6) {
              return html`<col span="1" style="background-color:lightgrey" />`;
            } else if (item === 1) {
              return html`<col span="5" />`;
            } else if (index === 0) {
              return html`<col span="${6 - item}" />`;
            }
          })}
          <thead>
            <tr>
              <th></th>
              ${this.dateArray.map((item, index) => {
                let day = this.startDate.getDate() + index;
                return html`<th>${day}.</th>`;
              })}
              <th>WH</th>
            </tr>
          </thead>
          <tbody>
            ${this.filteredSchedules[this.indexToDisplay].map((item) => {
              return html`
                <tr>
                  <th class="employeeNames">${item.information.name}</th>
                  ${scheduleConverter(item.assignedShifts, this.shifts).map(
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
                  <td>
                    ${item.schedulingInformation.hoursWorked}
                  </td>
                </tr>
              `;
            })}
          </tbody>
        </table>

        <table>
          <tbody>
            <tr>
              <td>Quality consecutive days off</td>
              <td>
                ${Math.round(
                  this.filteredSchedules[this.indexToDisplay][0].quality
                    .minConsecutiveDaysOff * 1000
                ) / 1000}
              </td>
            </tr>
            <tr>
              <td>Squared total hour difference</td>
              <td>
                ${Math.round(
                  this.filteredSchedules[this.indexToDisplay][0].quality
                    .totalHourDifference * 1000
                ) / 1000}
              </td>
            </tr>
            <tr>
              <td>Shift distribution</td>
              <td>
                ${Math.round(
                  this.filteredSchedules[this.indexToDisplay][0].quality
                    .shiftDistribution * 1000
                ) / 1000}
              </td>
            </tr>
            <tr>
              <td>Consecutive working days quality</td>
              <td>
                ${Math.round(
                  this.filteredSchedules[this.indexToDisplay][0].quality
                    .consecutiveWorkingDays * 1000
                ) / 1000}
              </td>
            </tr>
            <tr>
              <td>Weekend Nonstop</td>
              <td>
                ${Math.round(
                  this.filteredSchedules[this.indexToDisplay][0].quality
                    .weekendNonstop * 1000
                ) / 1000}
              </td>
            </tr>
            <tr>
              <td>Weekend Dist</td>
              <td>
                ${Math.round(
                  this.filteredSchedules[this.indexToDisplay][0].quality
                    .weekendDistribution * 1000
                ) / 1000}
              </td>
            </tr>
            <tr>
              <td>Target function:</td>
              <td>
                ${Math.round(
                  this.filteredSchedules[this.indexToDisplay][0].target
                )}
              </td>
            </tr>
          </tbody>
        </table>
        <div>
          <button @click="${this.btnCreateSchedule}">
            Start creating roster
          </button>
          <button @click="${this.btnStopCreate}">Stop creating</button>
          <button @click="${this.showNext}">Show next</button>
          <button @click="${this.showPrev}">Show prev</button>
        </div>
        <div id="chart"></div>
        <div class="filters">
          ${Object.keys(this.maxQuality.max).map((key) => {
            return html`
              <label for="${key}"
                >${key}: ${Math.round(this.scheduleFilters[key])}</label
              >
              <input
                @change="${this.setFilter}"
                type="range"
                id="${key}"
                name="${key}"
                min="${this.maxQuality.min[key]}"
                max="${this.maxQuality.max[key]}"
                value="${this.scheduleFilters[key]}"
                step="any"
              />
            `;
          })}
        </div>
        <p>Number of good schedules: ${this.filteredSchedules.length - 1}</p>
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

  updated() {
    this.createChart();
  }

  createChart() {
    // Extract the data into clean arrays
    let data = [];
    let id = 0;
    this.filteredSchedules.forEach((schedule) => {
      data.push({
        id,
        x: schedule[0].quality.totalHourDifference,
        y: schedule[0].quality.shiftDistribution,
        color: schedule[0].quality.consecutiveWorkingDays,
      });
      id++;
    });

    const width = 800;
    const height = 400;

    const chartArea = this.shadowRoot.getElementById('chart');
    chartArea.innerHTML = ''; // delete old chart

    // Create the chart itself
    const svg = d3
      .select(chartArea)
      .append('svg')
      .attr('width', width)
      .attr('height', height);
    // Scales
    const x = d3
      .scaleLinear()
      .range([0, width])
      .domain([0, d3.max(data, (d) => d.x)]);
    const y = d3
      .scaleLinear()
      .range([height, 0])
      .domain([0, d3.max(data, (d) => d.y)]);
    const colorRating = d3
      .scaleLinear()
      .range([0, 255])
      .domain([0, d3.max(data, (d) => d.color)]);

    // Dots there are
    svg
      .selectAll('dot')
      .data(data)
      .enter()
      .append('circle')
      .attr('r', (d) => (d.id === this.indexToDisplay ? 8 : 5))
      .attr('cx', (d) => x(d.x))
      .attr('cy', (d) => y(d.y))
      .attr('fill', (d) =>
        d.id === this.indexToDisplay
          ? `RGB(18, 170, 236)`
          : `RGB(${colorRating(d.color)},0,0)`
      )
      .on('click', (d, i) => {
        this.showIndex(i);
      })
      .attr('class', 'chartPoint')
      .append('svg:title')
      .text((d, i) => `index: ${i} x: ${d.x}   y: ${d.y}`);

    // Creating the axis
    svg
      .append('g')
      .attr('transform', 'translate(0,' + height + ')')
      .call(d3.axisTop(x).ticks(10));
    svg.append('svg').call(d3.axisRight(y).ticks(5));
  }
}

customElements.define('shift-schedule', shiftSchedule);

function getMaxQuality(schedules) {
  let result = { max: {}, min: {} };
  for (let key in schedules[0][0].quality) {
    result.max[key] = 0;
    result.min[key] = Infinity;
  }

  for (let i = 0; i < schedules.length; i++) {
    for (let key in schedules[i][0].quality) {
      if (schedules[i][0].quality[key] > result.max[key]) {
        result.max[key] = schedules[i][0].quality[key];
      }
      if (schedules[i][0].quality[key] < result.min[key]) {
        result.min[key] = schedules[i][0].quality[key];
      }
    }
  }

  return result;
}
