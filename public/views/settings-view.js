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
        <p>Settings to do:</p>
        <ol>
          <li>Number of Days</li>
          <li>iterations</li>
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
      }
    `;
  }
}

customElements.define("settings-view", settingsView);
