import { LitElement, html, css } from "lit-element";

class EmployeeCard extends LitElement {
  static get properties() {
    return {
      employee: { type: Object },
      editEmployee: { type: Boolean }, // This is just added to trigger updates after changes
    };
  }

  // Template for custom events
  removeThisEmployee(event) {
    this.dispatchEvent(
      new CustomEvent("remove-me", {
        detail: {
          id: this.employee.id,
        },
      })
    );
    // This line is needed to prevent that the edit event gets also triggered by clicking the div.
    event.stopPropagation();
  }

  editThisEmployee() {
    this.dispatchEvent(
      new CustomEvent("edit-me", {
        detail: {
          id: this.employee.id,
        },
      })
    );
    this.requestUpdate();
  }

  render() {
    return html`
      <div class="card" @click=${this.editThisEmployee}>
        <img src="${this.employee.avatar}" />
        ${this.employee.name}
        <button @click=${this.removeThisEmployee}>X</button>
      </div>
    `;
  }

  static get styles() {
    return css`
      .card {
        display: flex;
        flex-direction: column;
        flex-wrap: nowrap;
        align-items: center;
        justify-content: center;
        width: 160px;
        height: 200px;
        background-color: white;
        box-shadow: 2px 2px 8px rgb(57, 62, 70, 0.9);
        border-radius: 15px;
        user-select: none;
        transition: 0.5s ease;
        margin: 0.5vmax;
      }

      .card:hover {
        cursor: pointer;
        transform: scale(1.1) translateY(-10px);
        box-shadow: 2px 2px 8px rgb(57, 62, 70, 0.6);
      }

      .card img {
        width: 90px;
        margin-bottom: 8px;
      }

      button {
        visibility: hidden;
        position: absolute;
        border-radius: 10px;
        width: 30px;
        height: 30px;
        right: 0;
        top: 0;
        border: 1px solid rgb(57, 62, 70);
      }

      button:hover {
        cursor: pointer;
      }

      .card:hover button {
        visibility: visible;
      }
    `;
  }
}

customElements.define("employee-card", EmployeeCard);
