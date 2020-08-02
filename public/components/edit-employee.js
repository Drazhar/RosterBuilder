import { LitElement, html, css } from "lit-element";

class EditEmployee extends LitElement {
  static get properties() {
    return {};
  }

  constructor() {
    super();
  }

  sendCloseEvent() {
    this.dispatchEvent(new CustomEvent("close-me", {}));
  }

  render() {
    return html`
      <div class="greyout" @click="${this.sendCloseEvent}">
        <div class="edit">
          <img
            src="https://avataaars.io/?avatarStyle=Circle&topType=LongHairBun&accessoriesType=Blank&hairColor=PastelPink&facialHairType=Blank&facialHairColor=Blonde&clotheType=Hoodie&clotheColor=Pink&eyeType=Dizzy&eyebrowType=RaisedExcitedNatural&mouthType=Default&skinColor=Pale"
          />
          <button @click="${this.sendCloseEvent}">X</button>
          <form>
            <div class="inputGroup">
              <label>Name: </label>
              <input type="text" id="name" value="name" isRequired />
            </div>
            <button type="submit">Save</button>
          </form>
        </div>
      </div>
    `;
  }

  static get styles() {
    return css`
      .greyout {
        background-color: rgba(70, 70, 70, 0.7);
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 3;
      }
      .edit {
        position: fixed;
        top: 10%;
        right: 10%;
        bottom: 10%;
        left: 10%;
        z-index: 4;
        background-color: white;
        box-shadow: 2px 2px 8px rgb(57, 62, 70, 0.9);
        border-radius: 20px;
        animation-duration: 0.2s;
        animation-name: popup;
      }

      @keyframes popup {
        from {
          top: 50%;
          right: 50%;
          bottom: 50%;
          left: 50%;
        }

        to {
          top: 10%;
          right: 10%;
          bottom: 10%;
          left: 10%;
        }
      }
    `;
  }
}

customElements.define("edit-employee", EditEmployee);
