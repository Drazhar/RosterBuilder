import { LitElement, html, css } from "lit-element";

class EmployeeCard extends LitElement {
  static get properties() {
    return {
      id: { type: String },
      name: { type: String },
      avatar: { type: String },
    };
  }

  constructor() {
    super();
  }

  // Template for custom events
  removeThisEmployee(event) {
    this.dispatchEvent(
      new CustomEvent("remove-me", {
        detail: {
          id: this.id,
        },
      })
    );
    event.stopPropagation(); // This line is needed to prevent that the edit event gets also triggered by clicking the div.
  }

  editThisEmployee() {
    this.dispatchEvent(
      new CustomEvent("edit-me", {
        detail: {
          id: this.id,
        },
      })
    );
  }

  render() {
    return html`
      <div class="card" @click=${this.editThisEmployee}>
        <img src="${this.avatar}" />
        ${this.name}
        <button @click=${this.removeThisEmployee}>Remove</button>
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
    `;
  }
}

customElements.define("employee-card", EmployeeCard);
