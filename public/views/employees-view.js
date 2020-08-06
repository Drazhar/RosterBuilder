import { LitElement, html, css } from "lit-element";
import "../components/employee-card.js";
import "../components/edit-employee.js";
import { nanoid } from "nanoid";
import { randomAvataaarURL } from "../src/randomAvataaarURL";

class EmployeesView extends LitElement {
  static get properties() {
    return {
      employees: { type: Array },
      editEmployee: { type: Boolean },
      editEmployeeObject: { type: Object },
    };
  }

  constructor() {
    super();

    this.editEmployee = false;
    if (window.localStorage.getItem("definedEmployees") === null) {
      this.employees = [];
    } else {
      this.employees = JSON.parse(
        window.localStorage.getItem("definedEmployees")
      );
    }
  }

  updated() {
    window.localStorage.setItem(
      "definedEmployees",
      JSON.stringify(this.employees)
    );
  }

  // Add a new employee to the list
  addNewEmployee() {
    const newId = nanoid(10);
    this.employees = [
      ...this.employees,
      {
        id: newId,
        name: "New Employee",
        plannedWorkingTime: 180,
        overtime: 0,
        consecutiveWorkingDays: {
          min: 3,
          max: 5,
          prefered: 4,
        },
        minConsecutiveDaysOff: 2,
        shift: {
          distribution: [0, 1, 1, 1],
        },
        avatar: randomAvataaarURL(newId),
      },
    ];
    this.openEditEmployee({ detail: { id: newId } });
  }

  openEditEmployee(event) {
    this.editEmployeeObject = this.employees.filter(
      (item) => item.id === event.detail.id
    )[0];
    this.editEmployee = true;
  }

  closeEditEmployee() {
    this.editEmployee = false;
  }

  removeEmployee(event) {
    this.employees = [
      ...this.employees.filter((item) => item.id !== event.detail.id),
    ];
  }

  updateEmployee(event) {
    for (let i = 0; i < this.employees.length; i++) {
      if (this.employees[i].id === event.detail.employee.id) {
        this.employees[i] = event.detail.employee;
      }
    }
    this.editEmployee = false;
  }

  render() {
    return html`
      ${this.editEmployee
        ? html`<edit-employee
            .employee="${this.editEmployeeObject}"
            @close-me="${this.closeEditEmployee}"
            @update-me="${this.updateEmployee}"
          ></edit-employee>`
        : ""}
      <div class="cardWrapper">
        ${this.employees.map(
          (employee) =>
            html`<employee-card
              ?editEmployee="${this.editEmployee}"
              .employee="${employee}"
              @remove-me="${this.removeEmployee}"
              @edit-me="${this.openEditEmployee}"
            ></employee-card>`
        )}
        <div @click="${this.addNewEmployee}" class="addNew">
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
