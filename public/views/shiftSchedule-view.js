import { LitElement, html, css } from "https://cdn.pika.dev/lit-element";
import { scheduleConverter } from "./../src/scheduleConverter.js";

class shiftSchedule extends LitElement {
  static get properties() {
    return {
      scheduleToDisplay: { type: Array },
    };
  }

  constructor() {
    super();
    this.scheduleToDisplay = [
      { assignedShifts: [" "], information: { name: "empty" } },
    ];

    document.getElementById("test").addEventListener("click", async () => {
      const createdSchedule = await this.createSchedule();
      if (createdSchedule.status === "success") {
        this.scheduleToDisplay = createdSchedule.result;
        console.log(this.scheduleToDisplay);
      }
    });
  }

  async createSchedule() {
    const data = {
      iterations: 10000,
    };
    const response = await fetch(
      `${window.location.origin}/api/createSchedule`,
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
    `;
  }

  static get styles() {
    return css`
      /* Table */
      table {
        border: 1px solid darkgrey;
        border-collapse: collapse;
        background-color: rgb(20, 20, 20);
        table-layout: fixed;
        overflow: hidden;
        font-family: "Poppins", sans-serif;
        width: 100%;
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
        background-color: var(--green-sheen);
        color: black;
        border-radius: 4px;
      }

      table .N {
        background-color: var(--fire-opal);
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
    `;
  }
}

customElements.define("shift-schedule", shiftSchedule);
