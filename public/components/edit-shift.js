import { LitElement, html, css } from 'lit-element';
import { autoTextColor } from '../src/autoColorPicker';

class EditShift extends LitElement {
  static get properties() {
    return {
      shift: { type: Object },
      posLeft: { type: Number },
    };
  }

  constructor() {
    super();
  }

  sendCloseEvent() {
    this.dispatchEvent(new CustomEvent('close-me', {}));
  }

  saveChanges(event) {
    event.preventDefault();

    // Update the properties of this class
    this.shift.colors.backgroundColor = this.shadowRoot
      .getElementById('color')
      .value.toString()
      .substr(1);
    this.shift.colors.textColor = autoTextColor(
      this.shift.colors.backgroundColor
    );
    this.shift.name = this.shadowRoot.getElementById('name').value;
    this.shift.workingHours = this.shadowRoot.getElementById('hours').value;
    this.shift.requiredEmployees = this.shadowRoot.getElementById(
      'requiredEmployees'
    ).value;
    this.shift.maxEmployees = this.shadowRoot.getElementById(
      'maxEmployees'
    ).value;

    // Dispatch event with this employee object to save it to the database or local storage
    this.dispatchEvent(
      new CustomEvent('update-me', {
        detail: {
          shift: this.shift,
        },
      })
    );
  }

  render() {
    return html`
      <div class="greyout">
        <div class="edit" style="left: ${this.posLeft}px">
          <button @click="${this.sendCloseEvent}" class="x-button">X</button>
          <form>
            <input
              type="color"
              class="colorInput"
              id="color"
              value="#${this.shift.colors.backgroundColor}"
            />
            <fieldset>
              <legend>General</legend>
              <label
                >Name:
                <input
                  type="text"
                  id="name"
                  value="${this.shift.name}"
                  isRequired
                />
              </label>
              <label
                >Working hours:
                <input
                  type="number"
                  id="hours"
                  value="${this.shift.workingHours}"
                  isRequired
                />
              </label>
              <label
                >Required employees:
                <input
                  type="number"
                  id="requiredEmployees"
                  value="${this.shift.requiredEmployees}"
                  isRequired
                />
              </label>
              <label
                >Max employees:
                <input
                  type="number"
                  id="maxEmployees"
                  value="${this.shift.maxEmployees}"
                  isRequired
                />
              </label>
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
      .colorButton {
        width: 2em;
        height: 2em;
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
        z-index: 4;
        width: 300px;
        background-color: white;
        box-shadow: 2px 2px 8px rgb(57, 62, 70, 0.9);
        border-radius: 20px;
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      #color {
        width: 80%;
        height: 80px;
        border: none;
      }

      #color:hover {
        cursor: pointer;
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
        width: 90%;
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

      input {
        width: 80px;
      }
    `;
  }
}

customElements.define('edit-shift', EditShift);
