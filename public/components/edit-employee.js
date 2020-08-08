import { LitElement, html, css } from "lit-element";
import { nanoid } from "nanoid";
import { randomAvataaarURL } from "../src/randomAvataaarURL";

class EditEmployee extends LitElement {
  static get properties() {
    return {
      employee: { type: Object },
      shifts: { type: Array },
      posLeft: { type: Number },
    };
  }

  constructor() {
    super();
  }

  sendCloseEvent() {
    this.dispatchEvent(new CustomEvent("close-me", {}));
  }

  saveChanges(event) {
    event.preventDefault();

    // Update the properties of this class
    this.employee.name = this.shadowRoot.getElementById("name").value;
    this.employee.plannedWorkingTime = this.shadowRoot.getElementById(
      "plannedWorkingTime"
    ).value;
    this.employee.overtime = this.shadowRoot.getElementById("overtime").value;

    this.employee.consecutiveWorkingDays.min = this.shadowRoot.getElementById(
      "cwd_min"
    ).value;
    this.employee.consecutiveWorkingDays.prefered = this.shadowRoot.getElementById(
      "cwd_pref"
    ).value;
    this.employee.consecutiveWorkingDays.max = this.shadowRoot.getElementById(
      "cwd_max"
    ).value;
    this.employee.minConsecutiveDaysOff = this.shadowRoot.getElementById(
      "minConsecutiveDaysOff"
    ).value;

    this.shifts.forEach((shift) => {
      this.employee.shift[shift.id] = this.shadowRoot.getElementById(
        `${shift.id}_weight`
      ).value;
    });

    // Dispatch event with this employee object to save it to the database or local storage
    this.dispatchEvent(
      new CustomEvent("update-me", {
        detail: {
          employee: this.employee,
        },
      })
    );
  }

  randomImage() {
    this.employee.avatar = randomAvataaarURL(nanoid(10));
    this.requestUpdate();
  }

  render() {
    return html`
      <div class="greyout">
        <div class="edit" style="left: ${this.posLeft}px">
          <img src="${this.employee.avatar}" @click="${this.randomImage}" />
          <button @click="${this.sendCloseEvent}" class="x-button">X</button>
          <form>
            <fieldset>
              <legend>General:</legend>
              <label
                >Name:
                <input
                  type="text"
                  id="name"
                  value="${this.employee.name}"
                  isRequired
                />
              </label>
              <label
                >Planned working time [h]:
                <input
                  type="number"
                  id="plannedWorkingTime"
                  value="${this.employee.plannedWorkingTime}"
                  isRequired
                />
              </label>
              <label
                >Overtime [h]:
                <input
                  type="number"
                  id="overtime"
                  value="${this.employee.overtime}"
                  isRequired
                />
              </label>
            </fieldset>
            <fieldset>
              <legend>Working habit:</legend>
              <label
                >Consecutive working days:
                <div>
                  <label
                    >min:
                    <input
                      type="number"
                      id="cwd_min"
                      value="${this.employee.consecutiveWorkingDays.min}"
                      isRequired
                    />
                  </label>
                  <label
                    >prefered:
                    <input
                      type="number"
                      id="cwd_pref"
                      value="${this.employee.consecutiveWorkingDays.prefered}"
                      isRequired
                    />
                  </label>
                  <label
                    >max:
                    <input
                      type="number"
                      id="cwd_max"
                      value="${this.employee.consecutiveWorkingDays.max}"
                      isRequired
                    />
                  </label>
                </div>
              </label>
              <label
                >Min consecutive days off:
                <input
                  type="number"
                  id="minConsecutiveDaysOff"
                  value="${this.employee.minConsecutiveDaysOff}"
                  isRequired
                />
              </label>
            </fieldset>
            <fieldset>
              <legend>
                Shift options:
              </legend>
              ${this.shifts.length > 0
                ? this.shifts.map(
                    (shift) => html`<label
                      >${shift.name}:
                      <input
                        type="number"
                        id="${shift.id}_weight"
                        value="${this.employee.shift[shift.id]}"
                        isRequired
                      />
                    </label>`
                  )
                : html`<p>There are no shifts defined...</p>`}
            </fieldset>
            <button
              type="submit"
              @click="${this.saveChanges}"
              style="margin-bottom: 0.2vmax"
            >
              Save
            </button>
          </form>
        </div>
      </div>
    `;
  }

  static get styles() {
    return css`
      img {
        width: 90px;
      }

      .greyout {
        background-color: rgba(70, 70, 70, 0.7);
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 3;
      }
      .edit {
        position: fixed;
        top: 10%;
        width: 380px;
        z-index: 4;
        background-color: white;
        box-shadow: 2px 2px 8px rgba(57, 62, 70, 0.9);
        border-radius: 10px;
        display: flex;
        flex-direction: column;
        align-items: center;
        /* animation-duration: 0.2s;
        animation-name: popup; */
      }

      .x-button {
        position: absolute;
        border-radius: 10px;
        width: 30px;
        height: 30px;
        right: 0;
        border: 1px solid rgb(57, 62, 70);
      }

      .x-button:hover {
        cursor: pointer;
      }

      form {
        display: flex;
        align-items: center;
        flex-direction: column;
        width: 90%;
      }

      fieldset {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        width: 100%;
        border: 1px solid rgba(57, 62, 70, 0.4);
        margin: 0.2vmax;
        font-size: 0.9em;
      }

      legend {
        color: rgba(57, 62, 70, 0.6);
        font-size: 0.8em;
      }

      label {
        width: 100%;
        display: flex;
        padding: 0.3vh 0;
        flex-direction: row;
        justify-content: space-between;
      }

      #plannedWorkingTime::after {
        content: "h";
      }

      input {
        width: 80px;
      }

      /* @keyframes popup {
        from {
          top: 50%;
          right: 50%;
          bottom: 50%;
          left: 50%;
        }

        to {
          top: 10%;
          right: 10%;
          bottom: 10%;
          left: 10%;
        }
      } */
    `;
  }
}

customElements.define("edit-employee", EditEmployee);
