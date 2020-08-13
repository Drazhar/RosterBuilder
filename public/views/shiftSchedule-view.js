import { LitElement, html, css } from 'lit-element';
import { scheduleConverter } from '../src/scheduleConverter';
import * as d3 from 'd3';

class shiftSchedule extends LitElement {
  static get properties() {
    return {
      scheduleToDisplay: { type: Array },
      shifts: { type: Array },
      indexToDisplay: { type: Number },
    };
  }

  constructor() {
    super();

    this.indexToDisplay = 0;

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

    if (window.localStorage.getItem('definedShifts') === null) {
      this.shifts = [];
    } else {
      this.shifts = JSON.parse(window.localStorage.getItem('definedShifts'));
    }
  }

  async btnCreateSchedule() {
    const createdSchedule = await this.createSchedule();
    if (createdSchedule.status === 'success') {
      console.log(createdSchedule.result);
      this.scheduleToDisplay = createdSchedule.result;
      localStorage.setItem(
        'lastSchedule',
        JSON.stringify(this.scheduleToDisplay)
      );
    }
  }

  showNext() {
    if (this.indexToDisplay < this.scheduleToDisplay.length - 1) {
      this.indexToDisplay++;
    }
  }

  showPrev() {
    if (this.indexToDisplay > 0) {
      this.indexToDisplay--;
    }
  }

  async createSchedule() {
    const data = {
      iterations: 1000,
      employees: JSON.parse(window.localStorage.getItem('definedEmployees')),
      shifts: this.shifts,
    };
    const response = await fetch(
      // `${window.location.origin}/api/createSchedule`,
      `http://127.0.0.1:3000/api/createSchedule`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }
    );
    const json = await response.json();
    return json;
  }

  render() {
    return html`
      <div class="wrapper">
        <table>
          <col span="1" class="fixedWidth" />
          <thead>
            <tr>
              <th></th>
              ${this.scheduleToDisplay[
                this.indexToDisplay
              ][0].assignedShifts.map((item, index) => html`<th>${index}</th>`)}
              <th>WH</th>
            </tr>
          </thead>
          <tbody>
            ${this.scheduleToDisplay[this.indexToDisplay].map((item) => {
              return html`
                <tr>
                  <th class="employeeNames">${item.information.name}</th>
                  ${scheduleConverter(item.assignedShifts).map((assigned) => {
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
                  })}
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
                  this.scheduleToDisplay[this.indexToDisplay][0].quality
                    .minConsecutiveDaysOff * 1000
                ) / 1000}
              </td>
            </tr>
            <tr>
              <td>Squared total hour difference</td>
              <td>
                ${Math.round(
                  this.scheduleToDisplay[this.indexToDisplay][0].quality
                    .totalHourDifference * 1000
                ) / 1000}
              </td>
            </tr>
            <tr>
              <td>Shift distribution</td>
              <td>
                ${Math.round(
                  this.scheduleToDisplay[this.indexToDisplay][0].quality
                    .shiftDistribution * 1000
                ) / 1000}
              </td>
            </tr>
            <tr>
              <td>Consecutive working days quality</td>
              <td>
                ${Math.round(
                  this.scheduleToDisplay[this.indexToDisplay][0].quality
                    .consecutiveWorkingDays * 1000
                ) / 1000}
              </td>
            </tr>
            <tr>
              <td>Target function:</td>
              <td>
                ${Math.round(
                  this.scheduleToDisplay[this.indexToDisplay][0].target
                )}
              </td>
            </tr>
          </tbody>
        </table>
        <button @click="${this.btnCreateSchedule}">Create new roster</button>
        <div id="chart"></div>
        <p>Number of good schedules: ${this.scheduleToDisplay.length}</p>
        <p>Currently displayed: ${this.indexToDisplay + 1}</p>
        <button @click="${this.showNext}">Show next</button>
        <button @click="${this.showPrev}">Show prev</button>
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
    `;
  }

  updated() {
    this.createChart();
  }

  createChart() {
    // Extract the data into clean arrays
    let data = [];
    this.scheduleToDisplay.forEach((schedule) => {
      data.push({
        x: schedule[0].quality.totalHourDifference,
        y: schedule[0].quality.shiftDistribution,
      });
    });

    console.log(data);

    const width = 800;
    const height = 400;

    const chartArea = this.shadowRoot.getElementById('chart');
    console.log('updating chart');

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

    // Dots there are
    svg
      .selectAll('dot')
      .data(data)
      .enter()
      .append('circle')
      .attr('r', 3)
      .attr('cx', (d) => x(d.x))
      .attr('cy', (d) => y(d.y));

    // Creating the axis
    svg
      .append('g')
      .attr('transform', 'translate(0,' + height + ')')
      .call(d3.axisTop(x).ticks(10));
    svg.append('svg').call(d3.axisRight(y).ticks(5));
  }
}

customElements.define('shift-schedule', shiftSchedule);
