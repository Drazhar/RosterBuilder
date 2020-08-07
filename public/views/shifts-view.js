import { LitElement, html, css } from "lit-element";
import { nanoid } from "nanoid";
import "../components/shift-card";
import "../components/edit-shift";
import { autoColor } from "../src/autoColorPicker";

class ShiftsView extends LitElement {
  static get properties() {
    return {
      shifts: { type: Array },
      editShift: { type: Boolean },
      editShiftObject: { type: Object },
    };
  }

  constructor() {
    super();

    this.editShift = false;
    if (window.localStorage.getItem("definedShifts") === null) {
      this.shifts = [];
    } else {
      this.shifts = JSON.parse(window.localStorage.getItem("definedShifts"));
    }
  }

  updated() {
    window.localStorage.setItem("definedShifts", JSON.stringify(this.shifts));
  }

  addNewShift() {
    const newId = nanoid(8);
    this.shifts = [
      ...this.shifts,
      {
        id: newId,
        name: "New Shift",
        colors: autoColor(this.shifts),
        workingHours: 12,
        autoAssign: true,
        requiredEmployees: 1,
      },
    ];
    //this.openEditShift({ detail: { id: newId } });
  }

  openEditShift(event) {
    this.editShiftObject = this.shifts.filter(
      (item) => item.id === event.detail.id
    )[0];
    this.editShift = true;
  }

  closeEditShift() {
    this.editShift = false;
  }

  removeShift(event) {
    this.shifts = [
      ...this.shifts.filter((item) => item.id !== event.detail.id),
    ];
  }

  updateShift(event) {
    for (let i = 0; i < this.shifts.length; i++) {
      if (this.shifts[i].id === event.detail.shift.id) {
        this.shifts[i] = event.detail.shift;
      }
    }
    this.editShift = false;
  }

  render() {
    return html`
      ${this.editShift
        ? html`<edit-shift
            .shift="${this.editShiftObject}"
            @close-me="${this.closeEditShift}"
            @update-me="${this.updateShift}"
          ></edit-shift>`
        : ""}
      <div class="cardWrapper">
        ${this.shifts.map(
          (shift) =>
            html`<shift-card
              ?editShift="${this.editShift}"
              .shift="${shift}"
              @remove-me="${this.removeShift}"
              @edit-me="${this.openEditShift}"
            ></shift-card>`
        )}
        <div @click="${this.addNewShift}" class="addNew">
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

customElements.define("shifts-view", ShiftsView);
