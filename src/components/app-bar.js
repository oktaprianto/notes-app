class AppBar extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `<h1 style="padding: 1rem; background-color: #007bff; color: white;">📒 Notes App</h1>`
  }
}

customElements.define('app-bar', AppBar)
