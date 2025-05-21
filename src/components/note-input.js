class NoteInput extends HTMLElement {
  constructor() {
    super()
    this._isSubmitting = false
    this._boundValidate = this.validate.bind(this)
    this._boundHandleSubmit = this.handleSubmit.bind(this)
  }

  connectedCallback() {
    this.render()
    this.setupEventListeners()
  }

  disconnectedCallback() {
    this.cleanupEventListeners()
  }

  render() {
    this.innerHTML = `
        <form id="noteForm">
          <input 
            type="text" 
            id="title" 
            placeholder="Judul catatan (min 5 karakter)" 
            required
            ${this._isSubmitting ? 'disabled' : ''}
          />
          <textarea 
            id="body" 
            placeholder="Isi catatan" 
            required
            ${this._isSubmitting ? 'disabled' : ''}
          ></textarea>
          <button type="submit" disabled>
            ${this._isSubmitting ? 'Menambahkan...' : 'Tambah Catatan'}
          </button>
        </form>
      `
  }

  validate() {
    const titleInput = this.querySelector('#title')
    const bodyInput = this.querySelector('#body')
    const submitBtn = this.querySelector('button')

    const isValid =
      titleInput.value.trim().length >= 5 &&
      bodyInput.value.trim().length > 0 &&
      !this._isSubmitting
    submitBtn.disabled = !isValid
  }

  async handleSubmit(e) {
    e.preventDefault()
    const form = this.querySelector('#noteForm')
    const titleInput = this.querySelector('#title')
    const bodyInput = this.querySelector('#body')

    this._isSubmitting = true
    this.render()

    try {
      this.dispatchEvent(
        new CustomEvent('note-submitted', {
          detail: {
            title: titleInput.value.trim(),
            body: bodyInput.value.trim(),
          },
          bubbles: true,
        })
      )

      form.reset()
    } catch (error) {
      console.error('Submission error:', error)
    } finally {
      this._isSubmitting = false
      this.render()
      // Re-attach event listeners after render
      this.setupEventListeners()
    }
  }

  setupEventListeners() {
    const form = this.querySelector('#noteForm')
    const titleInput = this.querySelector('#title')
    const bodyInput = this.querySelector('#body')

    titleInput.addEventListener('input', this._boundValidate)
    bodyInput.addEventListener('input', this._boundValidate)
    form.addEventListener('submit', this._boundHandleSubmit)
  }

  cleanupEventListeners() {
    const form = this.querySelector('#noteForm')
    const titleInput = this.querySelector('#title')
    const bodyInput = this.querySelector('#body')

    if (form && titleInput && bodyInput) {
      titleInput.removeEventListener('input', this._boundValidate)
      bodyInput.removeEventListener('input', this._boundValidate)
      form.removeEventListener('submit', this._boundHandleSubmit)
    }
  }
}

customElements.define('note-input', NoteInput)
