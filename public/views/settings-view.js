import { LitElement, html, css } from "lit-element";

class SettingsView extends LitElement {
  static get properties() {
    return {
      scheduleToDisplay: { type: Array },
    };
  }

  constructor() {
    super();
  }

  render() {
    return html` <h1>General settings</h1> `;
  }

  static get styles() {
    return css``;
  }
}

customElements.define("settings-view", SettingsView);
