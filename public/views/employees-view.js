import { LitElement, html, css } from "lit-element";

class EmployeesView extends LitElement {
  constructor() {
    super();
  }

  render() {
    return html`
      <div class="cardWrapper">
        <employee-card name="Mila Trauth"></employee-card>
        <employee-card name="Philip Trauth"></employee-card>
        <employee-card name="Jim Trauth"></employee-card>
        <employee-card name="Leo Trauth"></employee-card>
        <employee-card name="Martina Trauth"></employee-card>
        <div class="addNew">
          +
        </div>
      </div>
    `;
  }

  static get styles() {
    return css`
      .cardWrapper {
        margin: 1vmax;
        display: flex;
        flex-wrap: wrap;
        align-content: center;
        height: 100%;
        align-items: center;
        justify-content: flex-start;
      }

      .addNew {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 160px;
        height: 200px;
        background-color: white;
        font-size: 120px;
        box-shadow: 2px 2px 8px rgb(57, 62, 70, 0.9);
        border-radius: 15px;
        color: rgba(240, 240, 240);
        text-shadow: 0 0 40px rgb(18, 170, 236), 0 0 15px rgb(18, 170, 236),
          0 0 7px rgba(18, 170, 236, 0.5);
        user-select: none;
        transition: 0.5s ease;
        margin: 0.5vmax;
      }

      .addNew:hover {
        cursor: pointer;
        transform: scale(1.1) translateY(-10px);
        box-shadow: 2px 2px 8px rgb(57, 62, 70, 0.6);
      }
    `;
  }
}

customElements.define("employees-view", EmployeesView);
