import { LitElement, html, css } from "lit-element";

class TestingView extends LitElement {
  static get properties() {
    return {
      input: { type: String },
    };
  }

  constructor() {
    super();
  }

  render() {
    return html` <p>${this.input}</p> `;
  }

  static get styles() {
    return css`
      p {
        color: red;
      }
    `;
  }
}

customElements.define("testing-view", TestingView);
