import { LitElement, html, css } from 'lit-element';

class SettingsView extends LitElement {
  static get properties() {
    return {
      scheduleToDisplay: { type: Array },
      settings: { type: Object },
    };
  }

  constructor() {
    super();

    if (window.localStorage.getItem('settings') === null) {
      this.settings = {};
    } else {
      this.settings = JSON.parse(window.localStorage.getItem('settings'));
    }
  }

  setLocalVar(e) {
    const value = new Date(e.path[0].value);
    const key = e.path[0].id;

    this.settings[key] = value;
    window.localStorage.setItem('settings', JSON.stringify(this.settings));
  }

  render() {
    return html`
      <h1>General settings</h1>
      <fieldset>
        <legend>Dates</legend>
        <label for="startDate">
          Start:
          <input
            type="date"
            id="startDate"
            name="startDate"
            value="${new Date(this.settings.startDate).toLocaleDateString(
              'en-CA'
            )}"
            @change="${this.setLocalVar}"
          />
        </label>
        <label for="endDate">
          End:
          <input
            type="date"
            id="endDate"
            name="endDate"
            value="${new Date(this.settings.endDate).toLocaleDateString(
              'en-CA'
            )}"
            @change="${this.setLocalVar}"
          />
        </label>
      </fieldset>
    `;
  }

  static get styles() {
    return css`
      fieldset {
        display: flex;
        flex-direction: column;
      }
    `;
  }
}

customElements.define('settings-view', SettingsView);
