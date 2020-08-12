import { LitElement, html } from 'lit-element';

class NotFoundView extends LitElement {
  render() {
    return html`
      <h1>Error 404</h1>
      <p>Requested page not found...</p>
    `;
  }
}
customElements.define('not-found-view', NotFoundView);
