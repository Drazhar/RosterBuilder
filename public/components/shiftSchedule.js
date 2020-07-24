import { LitElement, html } from "lit-element";

class shiftSchedule extends LitElement {
  constructor() {
    super();
    this.answer = 42;
    this.scheduleToDisplay = [{ assignedShifts: [""] }];
    document.getElementById("test").addEventListener("click", async () => {
      const createdSchedule = await this.createSchedule();
      if (createdSchedule.status === "success") {
        this.scheduleToDisplay = createdSchedule.result;
      }
      console.log(this.scheduleToDisplay);
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
        <thead>
          <tr>
            <th></th>
            ${this.scheduleToDisplay[0].assignedShifts.map(
              (item, index) => "<th>Day " + index + "</th>"
            )}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Mila</td>
            <td colspan="4" class="shift1">Day</td>
            <td colspan="2" class="off"></td>
            <td class="shift2">NightShift</td>
          </tr>
          <tr>
            <td>Philip</td>
            <td colspan="2" class="shift2">Night</td>
            <td colspan="2" class="off"></td>
            <td colspan="3" class="shift1">Day</td>
          </tr>
          <tr>
            <td>Hans</td>
            <td colspan="2" class="off"></td>
            <td colspan="4" class="shift2">Night</td>
            <td class="off"></td>
          </tr>
        </tbody>
      </table>
    `;
  }
}

customElements.define("shift-schedule", shiftSchedule);
