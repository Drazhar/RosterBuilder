import { LitElement, html, css } from "lit-element";

class ShiftsView extends LitElement {
  static get properties() {
    return {
      scheduleToDisplay: { type: Array },
    };
  }

  constructor() {
    super();
  }

  render() {
    return html` <h1>Shift settings</h1> `;
  }

  static get styles() {
    return css``;
  }
}

customElements.define("shifts-view", ShiftsView);
