import { LitElement, html, css } from "lit-element";

class ShiftCard extends LitElement {
  static get properties() {
    return {
      shift: { type: Object },
      editShift: { type: Boolean }, // This is just added to trigger updates after changes
    };
  }

  // Template for custom events
  removeThisShift(event) {
    this.dispatchEvent(
      new CustomEvent("remove-me", {
        detail: {
          id: this.shift.id,
        },
      })
    );
    // This line is needed to prevent that the edit event gets also triggered by clicking the div.
    event.stopPropagation();
  }

  editThisShift() {
    this.dispatchEvent(
      new CustomEvent("edit-me", {
        detail: {
          id: this.shift.id,
        },
      })
    );
    this.requestUpdate();
  }

  render() {
    return html`
      <div
        class="card"
        @click=${this.editThisShift}
        style="background-color:#${this.shift.color}"
      >
        ${this.shift.name}
        <button @click=${this.removeThisShift}>Remove</button>
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

customElements.define("shift-card", ShiftCard);