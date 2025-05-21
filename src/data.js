const BASE_URL = 'https://notes-api.dicoding.dev/v2'

export const getArchivedNotes = async () => {
  const response = await fetch(`${BASE_URL}/notes/archived`)
  return response.json()
}

export const archiveNote = async (id) => {
  const response = await fetch(`${BASE_URL}/notes/${id}/archive`, {
    method: 'POST',
  })
  return response.json()
}

export const unarchiveNote = async (id) => {
  const response = await fetch(`${BASE_URL}/notes/${id}/unarchive`, {
    method: 'POST',
  })
  return response.json()
}

export const getNotes = async () => {
  const response = await fetch(`${BASE_URL}/notes`)
  return response.json()
}

export const addNote = async (note) => {
  const response = await fetch(`${BASE_URL}/notes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(note),
  })
  return response.json()
}

export const deleteNote = async (id) => {
  await fetch(`${BASE_URL}/notes/${id}`, { method: 'DELETE' })
}
