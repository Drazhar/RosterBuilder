import { LitElement, html, css } from "lit-element";

class EmployeeCard extends LitElement {
  static get properties() {
    return {
      name: { type: String },
    };
  }

  constructor() {
    super();
  }

  // Template for custom events
  removeThisEmployee() {
    this.dispatchEvent(
      new CustomEvent("remove-me", {
        detail: {
          name: this.name,
        },
      })
    );
  }

  editThisEmployee() {
    this.dispatchEvent(
      new CustomEvent("edit-me", {
        detail: {
          name: this.name,
        },
      })
    );
  }

  render() {
    return html`
      <div class="card">
        <img
          src="https://avataaars.io/?avatarStyle=Circle&topType=LongHairBun&accessoriesType=Blank&hairColor=PastelPink&facialHairType=Blank&facialHairColor=Blonde&clotheType=Hoodie&clotheColor=Pink&eyeType=Dizzy&eyebrowType=RaisedExcitedNatural&mouthType=Default&skinColor=Pale"
        />
        ${this.name}
        <button @click=${this.removeThisEmployee}>Remove</button>
        <button @click=${this.editThisEmployee}>Edit</button>
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
