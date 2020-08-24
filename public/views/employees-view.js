import { LitElement, html, css } from 'lit-element';
import '../components/employee-card.js';
import '../components/edit-employee.js';
import { nanoid } from 'nanoid';
import { randomAvataaarURL } from '../src/randomAvataaarURL';
import { setDefaultShiftDist } from '../src/defaultShiftDist';
import { getDateArr } from '../src/getDateArr';

class EmployeesView extends LitElement {
  static get properties() {
    return {
      employees: { type: Array },
      editEmployee: { type: Boolean },
      editEmployeeObject: { type: Object },
      editPosLeft: { type: Number },
      shifts: { type: Array },
      settings: { type: Object },
      dateArray: { type: Array },
    };
  }

  constructor() {
    super();

    this.editEmployee = false;
    if (window.localStorage.getItem('definedEmployees') === null) {
      this.employees = [];
    } else {
      this.employees = JSON.parse(
        window.localStorage.getItem('definedEmployees')
      );
    }

    if (window.localStorage.getItem('definedShifts') === null) {
      this.shifts = [];
    } else {
      this.shifts = JSON.parse(window.localStorage.getItem('definedShifts'));
    }

    if (window.localStorage.getItem('settings') === null) {
      this.settings = {};
    } else {
      this.settings = JSON.parse(window.localStorage.getItem('settings'));
    }

    this.startDate = new Date(this.settings.startDate);
    this.dateArray = getDateArr(
      this.startDate,
      new Date(this.settings.endDate)
    );
  }

  updated() {
    window.localStorage.setItem(
      'definedEmployees',
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
        name: 'New Employee',
        plannedWorkingTime: 180,
        overtime: 0,
        consecutiveWorkingDays: {
          min: 3,
          max: 5,
          preferred: 4,
        },
        minConsecutiveDaysOff: 2,
        shift: setDefaultShiftDist(this.shifts),
        avatar: randomAvataaarURL(newId),
        shiftWishes: new Array(this.dateArray.length).fill(0),
      },
    ];
    this.openEditEmployee({ detail: { id: newId } });
  }

  openEditEmployee(event) {
    if (event.path !== undefined) {
      const targetPositionLeft = event.path[0].offsetLeft - 175 + 80;
      if (targetPositionLeft < 10) {
        this.editPosLeft = 10;
      } else if (targetPositionLeft + 380 > window.innerWidth) {
        this.editPosLeft = window.innerWidth - 380 - 30;
      } else {
        this.editPosLeft = targetPositionLeft;
      }
    } else {
      this.editPosLeft = window.innerWidth / 2 - 175;
    }

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
            posLeft="${this.editPosLeft}"
            .settings="${this.settings}"
            .employee="${this.editEmployeeObject}"
            .shifts="${this.shifts}"
            .dateArray="${this.dateArray}"
            @close-me="${this.closeEditEmployee}"
            @update-me="${this.updateEmployee}"
          ></edit-employee>`
        : ''}
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

customElements.define('employees-view', EmployeesView);
