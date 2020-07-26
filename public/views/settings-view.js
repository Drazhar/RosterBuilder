import { LitElement, html, css } from "https://cdn.pika.dev/lit-element";

class settingsView extends LitElement {
  static get properties() {
    return {
      display: { type: Boolean },
    };
  }

  constructor() {
    super();

    if (sessionStorage.getItem("lastView") === "settings") {
      this.display = true;
    } else {
      this.display = false;
    }
  }

  render() {
    if (this.display) {
      return html`
        <div class="wrapper">
          <div class="employeeInfo">
            <h1>Employee settings</h1>
            <button>
              +
            </button>
          </div>
          <div class="shiftInfo"><h1>Shift settings</h1></div>
          <div class="general">
            <h1>General settings</h1>
            <form>
              <div class="inputGroup">
                <label for="nDays">Number of Days to calculate:</label>
                <input type="number" name="nDays" id="nDays" required />
              </div>
              <div class="inputGroup">
                <label for="itCount">Number of iterations:</label>
                <input type="number" name="itCount" id="itCount" required />
              </div>
            </form>
          </div>
        </div>

        <p>Settings to do:</p>
        <ol>
          <li>employee information</li>
          <li>shift information</li>
        </ol>
      `;
    } else {
      return html``;
    }
  }

  static get styles() {
    return css`
      /* Table */
      * {
        font-family: "Poppins", sans-serif;
        color: rgba(0, 0, 0, 0.9);
        font-size: 0.96em;
      }

      h1 {
        font-size: 1.2em;
      }

      button {
        text-align: center;
        line-height: 30px;
        padding: 0px;
        margin: 0px;
        width: 1em;
        height: 1em;
        background-color: rgba(0, 0, 0, 0);
        color: var(--celadon-blue);
        font-weight: 400;
        font-size: 2em;
        border: 1px solid var(--celadon-blue);
      }

      button:hover {
        cursor: pointer;
      }

      .wrapper {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        margin: 0;
        padding: 0;
      }

      .employeeInfo,
      .shiftInfo,
      .general {
        padding: 0.5vw;
        margin: 0.35vw;
        border-radius: 10px;
        background-color: rgba(255, 255, 255, 0.6);
      }

      .inputGroup {
        display: flex;
        justify-content: space-between;
        align-items: stretch;
        padding: 0.5em;
      }
    `;
  }
}

customElements.define("settings-view", settingsView);
