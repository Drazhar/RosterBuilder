import { LitElement, html, css } from "lit-element";
import { scheduleConverter } from "../src/scheduleConverter";

class shiftSchedule extends LitElement {
  static get properties() {
    return {
      scheduleToDisplay: { type: Array },
    };
  }

  constructor() {
    super();

    if (localStorage.getItem("lastSchedule") !== null) {
      this.scheduleToDisplay = JSON.parse(localStorage.getItem("lastSchedule"));
    } else {
      this.scheduleToDisplay = [
        {
          assignedShifts: [" "],
          information: { name: "empty" },
          schedulingInformation: { hoursWorked: 0 },
          quality: { minConsecutiveDaysOffCheck: 0 },
        },
      ];
    }
  }

  async btnCreateSchedule() {
    const createdSchedule = await this.createSchedule();
    if (createdSchedule.status === "success") {
      this.scheduleToDisplay = createdSchedule.result;
      localStorage.setItem(
        "lastSchedule",
        JSON.stringify(this.scheduleToDisplay)
      );
    }
  }

  async createSchedule() {
    const data = {
      iterations: 10000,
    };
    const response = await fetch(
      // `${window.location.origin}/api/createSchedule`,
      `http://127.0.0.1:3000/api/createSchedule`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
              ${this.scheduleToDisplay[0].assignedShifts.map(
                (item, index) => html`<th>${index}</th>`
              )}
              <th>WH</th>
            </tr>
          </thead>
          <tbody>
            ${this.scheduleToDisplay.map((item, index) => {
              return html`
                <tr>
                  <th class="employeeNames">${item.information.name}</th>
                  ${scheduleConverter(item.assignedShifts).map((assigned) => {
                    return html`
                      <td colspan=${assigned.count} class="${assigned.value}">
                        ${assigned.value !== " "
                          ? assigned.value + " " + assigned.count
                          : ""}
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
                  this.scheduleToDisplay[0].quality.minConsecutiveDaysOffCheck *
                    1000
                ) / 1000}
              </td>
            </tr>
            <tr>
              <td>Shift distribution</td>
              <td>
                ${Math.round(
                  this.scheduleToDisplay[0].quality.shiftDistribution * 1000
                ) / 1000}
              </td>
            </tr>
            <tr>
              <td>Squared total hour difference</td>
              <td>
                ${Math.round(
                  this.scheduleToDisplay[0].quality.totalHourDifference * 1000
                ) / 1000}
              </td>
            </tr>
          </tbody>
        </table>
        <button @click="${this.btnCreateSchedule}">Create new roster</button>
      </div>
    `;
  }

  static get styles() {
    return css`
      /* Table */
      * {
        font-family: "Poppins", sans-serif;
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
        border: 1px solid darkgrey;
        border-collapse: collapse;
        background-color: white;
        table-layout: fixed;
        overflow: hidden;
        width: 99%;
      }

      td,
      th {
        border: 1px solid rgb(60, 60, 60);
        padding: 2px 6px 2px 6px;
        text-align: center;
        justify-content: center;
        width: 1fr;
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

      table .D {
        background-color: green;
        color: black;
        border-radius: 4px;
      }

      table .N {
        background-color: red;
        color: white;
        border-radius: 4px;
      }

      .D,
      .N {
        opacity: 0.85;
      }

      .D:hover,
      .N:hover {
        transition: all 0.4s ease-out;
        opacity: 1;
        cursor: pointer;
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
    `;
  }
}

customElements.define("shift-schedule", shiftSchedule);
