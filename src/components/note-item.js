class NoteItem extends HTMLElement {
  static get observedAttributes() {
    return ['note-id', 'note-title', 'note-body', 'note-date', 'archived']
  }

  constructor() {
    super()
    this.handleDelete = this.handleDelete.bind(this)
    this.handleArchive = this.handleArchive.bind(this)
  }

  attributeChangedCallback() {
    this.render()
  }

  render() {
    const title = this.getAttribute('note-title') || ''
    const body = this.getAttribute('note-body') || ''
    const date = this.getAttribute('note-date') || ''
    const isArchived = this.hasAttribute('archived')

    this.innerHTML = `
        <div class="note-card">
          <div class="note-content">
            <h3>${title}</h3>
            <p>${body}</p>
            <small>${new Date(date).toLocaleString()}</small>
          </div>
          <div class="note-actions">
            <button class="action-btn archive-btn">
              ${isArchived ? '📤 Batalkan Arsip' : '📦 Arsipkan'}
            </button>
            <button class="action-btn delete-btn">🗑️ Hapus</button>
          </div>
        </div>
      `

    this.setupEventListeners()
  }

  setupEventListeners() {
    this.querySelector('.delete-btn').addEventListener(
      'click',
      this.handleDelete
    )
    this.querySelector('.archive-btn').addEventListener(
      'click',
      this.handleArchive
    )
  }

  handleDelete() {
    this.dispatchEvent(
      new CustomEvent('note-action', {
        bubbles: true,
        detail: {
          id: this.getAttribute('note-id'),
          action: 'delete',
        },
      })
    )
  }

  handleArchive() {
    const action = this.hasAttribute('archived') ? 'unarchive' : 'archive'
    this.dispatchEvent(
      new CustomEvent('note-action', {
        bubbles: true,
        detail: {
          id: this.getAttribute('note-id'),
          action: action,
        },
      })
    )
  }

  disconnectedCallback() {
    this.querySelector('.delete-btn')?.removeEventListener(
      'click',
      this.handleDelete
    )
    this.querySelector('.archive-btn')?.removeEventListener(
      'click',
      this.handleArchive
    )
  }
}

customElements.define('note-item', NoteItem)
