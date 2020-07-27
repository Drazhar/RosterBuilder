import { LitElement, html, css } from "lit-element";

class EmployeesView extends LitElement {
  constructor() {
    super();
  }

  render() {
    return html` <h1>This is the view for the employee settings</h1> `;
  }

  static get styles() {
    return css`
      h1 {
        color: red;
      }
    `;
  }
}

customElements.define("employees-view", EmployeesView);
