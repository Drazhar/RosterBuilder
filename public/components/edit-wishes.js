import { LitElement, html, css } from 'lit-element';

class EditWishes extends LitElement {
  static get properties() {
    return {
      shifts: { type: Array },
      dateArray: { type: Array },
      settings: { type: Object },
      employee: { type: Object },
    };
  }

  constructor() {
    super();
  }

  saveChanges(event) {
    event.preventDefault();

    // Dispatch event with this employee object to save it to the database or local storage
    this.dispatchEvent(
      new CustomEvent('save-wishes', {
        detail: {
          dateArray: this.dateArray,
        },
      })
    );
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
    console.log(this.employee);
    return html`
      <div class="eWishes">
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
              ${this.dateArray.map((day, index) => {
                newDay.setDate(startDate.getDate() + index);
                let dateString = newDay.toDateString().split(' ');
                dateString.pop();
                dateString = dateString.join(' ');
                return html`<th>${dateString}</th>`;
              })}
            </tr>
          </thead>
          <tbody>
            <tr>
              ${this.employee.shiftWishes.map((wish, index) => {
                return html`
                  <td>
                    <select id="input_${index}" value="${wish}">
                      <option value="0">none</option>
                      <option value=" ">free</option>
                      ${this.shifts.map(
                        (shift) => html`
                          <option value="${shift.id}">${shift.name}</option>
                        `
                      )}
                    </select>
                  </td>
                `;
              })}
            </tr>
          </tbody>
        </table>
        <button @click="${this.saveChanges}" style="margin-bottom: 0.2vmax">
          Save
        </button>
      </div>
    `;
  }

  static get styles() {
    return css`
      .eWishes {
        position: fixed;
        top: 15%;
        left: 2%;
        right: 2%;
        z-index: 5;
        background-color: white;
        box-shadow: 2px 2px 8px rgba(57, 62, 70, 0.9);
        border-radius: 10px;
        display: flex;
        flex-direction: column;
        align-items: center;
      }
    `;
  }
}

customElements.define('edit-wishes', EditWishes);
