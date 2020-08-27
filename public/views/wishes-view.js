import { LitElement, html, css } from 'lit-element';
import { getDateArr } from '../src/getDateArr';

class WishesView extends LitElement {
  static get properties() {
    return {
      settings: { type: Object },
      dateArray: { type: Array },
      shifts: { type: Array },
      employees: { type: Array },
    };
  }

  constructor() {
    super();

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

    if (window.localStorage.getItem('definedShifts') === null) {
      this.shifts = [];
    } else {
      this.shifts = JSON.parse(window.localStorage.getItem('definedShifts'));
    }

    if (window.localStorage.getItem('definedEmployees') === null) {
      this.employees = [];
    } else {
      this.employees = JSON.parse(
        window.localStorage.getItem('definedEmployees')
      );
    }
  }

  wishChanged(event) {
    let employeeIndex = event.path[0].id.split('_');
    const wishIndex = parseInt(employeeIndex.pop());
    employeeIndex = parseInt(employeeIndex[0]);
    const changedValue = event.path[0].value;

    this.employees[employeeIndex].shiftWishes[wishIndex] = changedValue;
    this.requestUpdate();
  }

  vacationChanged(event) {
    let employeeIndex = event.path[0].id.split('_');
    const vacIndex = parseInt(employeeIndex.pop());
    employeeIndex = parseInt(employeeIndex[0]);
    const changedValue = event.path[0].value;

    this.employees[employeeIndex].shiftVacation[vacIndex] = changedValue;
    this.requestUpdate();
  }

  clearWishes(e) {
    e.preventDefault();
    for (let iE = 0; iE < this.employees.length; iE++) {
      for (let iW = 0; iW < this.employees[iE].shiftWishes.length; iW++) {
        this.employees[iE].shiftWishes[iW] = 0;
      }
    }
    this.requestUpdate();
  }

  clearVacation(e) {
    e.preventDefault();
    for (let iE = 0; iE < this.employees.length; iE++) {
      for (let iV = 0; iV < this.employees[iE].shiftVacation.length; iV++) {
        this.employees[iE].shiftVacation[iV] = 0;
      }
    }
    this.requestUpdate();
  }

  disconnectedCallback() {
    window.localStorage.setItem(
      'definedEmployees',
      JSON.stringify(this.employees)
    );
    super.disconnectedCallback();
  }

  render() {
    const startDate = new Date(this.settings.startDate);
    let newDay = new Date(
      Date.UTC(
        startDate.getFullYear(),
        startDate.getMonth(),
        startDate.getDay()
      )
    );
    return html`
      <div class="wrapper">
        <fieldset>
          <legend>Wishes</legend>
          <table>
            <col span="1" class="fixedWidth" />
            ${this.dateArray.map((item, index) => {
              if (item === 0 || item === 6) {
                return html`<col
                  span="1"
                  style="background-color:lightgrey"
                />`;
              } else if (item === 1) {
                return html`<col span="5" />`;
              } else if (index === 0) {
                return html`<col span="${6 - item}" />`;
              }
            })}
            <thead>
              <tr>
                <th><button @click="${this.clearWishes}">Clear all</button></th>
                ${this.dateArray.map((day, index) => {
                  newDay.setDate(startDate.getDate() + index);
                  let dateString = newDay.toDateString().split(' ');
                  dateString.pop();
                  dateString = dateString.join(' ');
                  return html`<th>
                    ${dateString.split(' ')[0]}<br />
                    ${dateString.split(' ')[2]} ${dateString.split(' ')[1]}
                  </th>`;
                })}
              </tr>
            </thead>
            <tbody>
              ${this.employees.map(
                (employee, employeeIndex) =>
                  html`<tr>
                    <th>${employee.name}</th>
                    ${employee.shiftWishes.map((wish, wishIndex) => {
                      return html`
                        <td
                          class="${parseInt(wish) !== 0
                            ? 'enteredWish'
                            : 'noWish'}"
                        >
                          <select
                            id="${employeeIndex}_${wishIndex}"
                            @change=${this.wishChanged}
                          >
                            ${parseInt(wish) === 0
                              ? html`<option value="0" selected>none</option>`
                              : html`<option value="0">none</option>`}
                            ${wish === ' '
                              ? html`<option value=" " selected>free</option>`
                              : html`<option value=" ">free</option>`}
                            ${this.shifts.map((shift) => {
                              if (wish === shift.id) {
                                return html`
                                  <option value="${shift.id}" selected>
                                    ${shift.name}
                                  </option>
                                `;
                              } else {
                                return html`
                                  <option value="${shift.id}">
                                    ${shift.name}
                                  </option>
                                `;
                              }
                            })}
                          </select>
                        </td>
                      `;
                    })}
                  </tr>`
              )}
            </tbody>
          </table>
        </fieldset>

        <fieldset>
          <legend>Vacation</legend>
          <table>
            <col span="1" class="fixedWidth" />
            ${this.dateArray.map((item, index) => {
              if (item === 0 || item === 6) {
                return html`<col
                  span="1"
                  style="background-color:lightgrey"
                />`;
              } else if (item === 1) {
                return html`<col span="5" />`;
              } else if (index === 0) {
                return html`<col span="${6 - item}" />`;
              }
            })}
            <thead>
              <tr>
                <th>
                  <button @click="${this.clearVacation}">Clear all</button>
                </th>
                ${this.dateArray.map((day, index) => {
                  newDay.setDate(startDate.getDate() + index);
                  let dateString = newDay.toDateString().split(' ');
                  dateString.pop();
                  dateString = dateString.join(' ');
                  return html`<th>
                    ${dateString.split(' ')[0]}<br />
                    ${dateString.split(' ')[2]} ${dateString.split(' ')[1]}
                  </th>`;
                })}
              </tr>
            </thead>
            <tbody>
              ${this.employees.map(
                (employee, employeeIndex) =>
                  html`<tr>
                    <th>${employee.name}</th>
                    ${employee.shiftVacation.map((wish, wishIndex) => {
                      return html`
                        <td
                          class="${parseInt(wish) !== 0
                            ? 'enteredWish'
                            : 'noWish'}"
                        >
                          <select
                            id="${employeeIndex}_${wishIndex}"
                            @change=${this.vacationChanged}
                          >
                            ${parseInt(wish) === 0
                              ? html`<option value="0" selected>none</option>`
                              : html`<option value="0">none</option>`}
                            ${wish === ' '
                              ? html`<option value=" " selected>free</option>`
                              : html`<option value=" ">free</option>`}
                            ${this.shifts.map((shift) => {
                              if (wish === shift.id) {
                                return html`
                                  <option value="${shift.id}" selected>
                                    ${shift.name}
                                  </option>
                                `;
                              } else {
                                return html`
                                  <option value="${shift.id}">
                                    ${shift.name}
                                  </option>
                                `;
                              }
                            })}
                          </select>
                        </td>
                      `;
                    })}
                  </tr>`
              )}
            </tbody>
          </table>
        </fieldset>
      </div>
    `;
  }

  static get styles() {
    return css`
      fieldset {
        display: flex;
        flex-direction: column;
        background-color: rgba(255, 255, 255, 0.6);
      }

      .wrapper {
        display: flex;
        flex-direction: column;
        height: 100%;
        align-items: flex-start;
        justify-content: center;
      }

      select {
        background-color: rgba(255, 255, 255, 0.85);
      }

      table {
        margin: 5px;
        border-collapse: collapse;
        background-color: white;
        table-layout: fixed;
        overflow: hidden;
      }

      td,
      th {
        padding: 1px;
        border: 1px solid rgb(180, 180, 180);
        border-left-color: rgb(225, 225, 225);
        border-right-color: rgb(225, 225, 225);
        text-align: center;
        justify-content: center;
        font-size: 0.9em;
        font-weight: normal;
        border-radius: 4px;
        opacity: 0.85;
        overflow: hidden;
      }

      .enteredWish {
        background-color: #ef476f;
      }
    `;
  }
}

customElements.define('wishes-view', WishesView);
