import { LitElement, html, css } from "lit-element";

class EditShift extends LitElement {
  static get properties() {
    return {
      shift: { type: Object },
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
    this.shift.name = this.shadowRoot.getElementById("name").value;

    // Dispatch event with this employee object to save it to the database or local storage
    this.dispatchEvent(
      new CustomEvent("update-me", {
        detail: {
          shift: this.shift,
        },
      })
    );
  }

  render() {
    return html`
      <div class="greyout">
        <div class="edit">
          <button @click="${this.sendCloseEvent}">X</button>
          <form>
            <div class="inputGroup">
              <label>
                Color:
                <input
                  type="color"
                  class="colorInput"
                  id="color"
                  value="#${this.shift.colors.backgroundColor}"
                />
              </label>
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
            </div>
            <button type="submit" @click="${this.saveChanges}">Save</button>
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
        right: 10%;
        bottom: 10%;
        left: 10%;
        z-index: 4;
        background-color: white;
        box-shadow: 2px 2px 8px rgb(57, 62, 70, 0.9);
        border-radius: 20px;
        animation-duration: 0.2s;
        animation-name: popup;
      }

      @keyframes popup {
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
      }
    `;
  }
}

customElements.define("edit-shift", EditShift);
