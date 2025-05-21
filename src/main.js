import '../styles/style.css'
import './components/note-item.js'
import './components/note-input.js'
import './components/app-bar.js'
import {
    getNotes,
    addNote,
    deleteNote,
    archiveNote,
    unarchiveNote,
    getArchivedNotes,
} from './data.js'

const notesContainer = document.getElementById('notesContainer')
const loadingOverlay = document.getElementById('loadingOverlay')
const activeTabBtn = document.getElementById('activeNotesTab')
const archivedTabBtn = document.getElementById('archivedNotesTab')

let currentView = 'active' // 'active' | 'archived'

// ======================== FUNGSI UTILITAS ========================
const setLoading = (isLoading) => {
    loadingOverlay.style.display = isLoading ? 'flex' : 'none'
}

const showError = (message) => {
    notesContainer.innerHTML = `
    <div class="error-message">
      <p>${message}</p>
      <button onclick="window.location.reload()">Muat Ulang</button>
    </div>
  `
}

// ======================== FUNGSIONALITAS INTI ========================
const renderNotes = async () => {
    try {
        setLoading(true)
        notesContainer.innerHTML = ''

        // Dapatkan data berdasarkan tampilan saat ini
        const { data: notes } =
            currentView === 'active' ? await getNotes() : await getArchivedNotes()

        if (!notes.length) {
            notesContainer.innerHTML = `
        <p class="empty-state">
          ${currentView === 'active' ? 'Belum ada catatan' : 'Tidak ada catatan di arsip'}
        </p>
      `
            return
        }

        // Render each note
        notes.forEach((note) => {
            const noteElement = document.createElement('note-item')
            noteElement.setAttribute('note-id', note.id)
            noteElement.setAttribute('note-title', note.title)
            noteElement.setAttribute('note-body', note.body)
            noteElement.setAttribute('note-date', note.createdAt)

            if (currentView === 'archived') {
                noteElement.setAttribute('archived', '')
            }

            notesContainer.appendChild(noteElement)
        })
    } catch (error) {
        console.error('Render error:', error)
        showError('Gagal memuat catatan. Silakan coba lagi.')
    } finally {
        setLoading(false)
    }
}

// ======================== EVENT HANDLERS ========================
const handleNoteSubmission = async (e) => {
    try {
        setLoading(true)
        await addNote({
            title: e.detail.title,
            body: e.detail.body,
        })

        if (currentView === 'active') {
            await renderNotes()
        }
    } catch (error) {
        console.error('Submission error:', error)
        alert('Gagal menambahkan catatan!')
    } finally {
        setLoading(false)
    }
}

const handleNoteAction = async (e) => {
    try {
        setLoading(true)
        const { id, action } = e.detail

        switch (action) {
            case 'delete':
                await deleteNote(id)
                break
            case 'archive':
                await archiveNote(id)
                break
            case 'unarchive':
                await unarchiveNote(id)
                break
        }

        await renderNotes()
    } catch (error) {
        console.error('Action error:', error)
        alert(`Gagal melakukan aksi: ${e.detail.action}`)
    } finally {
        setLoading(false)
    }
}

const switchTab = (tab) => {
    currentView = tab
    activeTabBtn.classList.toggle('active', tab === 'active')
    archivedTabBtn.classList.toggle('active', tab === 'archived')
    renderNotes()
}

// ======================== INITIALIZATION ========================
const initialize = () => {
    // Setup event listeners
    document
        .querySelector('note-input')
        .addEventListener('note-submitted', handleNoteSubmission)

    document.addEventListener('note-action', handleNoteAction)

    activeTabBtn.addEventListener('click', () => switchTab('active'))
    archivedTabBtn.addEventListener('click', () => switchTab('archived'))

    // Initial render
    switchTab('active')
}

document.addEventListener('DOMContentLoaded', initialize)
