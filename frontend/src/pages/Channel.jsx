import { Plus } from '@phosphor-icons/react'
import { useState } from 'react'
import { Button, Form } from 'react-bootstrap'

// Solo grafica per ora, nessun backend: i canali restano nel browser (localStorage).
const STORAGE_KEY = 'social-network:channels'

function readChannels() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function writeChannels(channels) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(channels))
  } catch {
    // se il browser blocca il localStorage i canali semplicemente non restano tra una visita e l'altra
  }
}

function generateChannelId() {
  return Math.random().toString(36).slice(2, 8).toUpperCase()
}

function Channel() {
  const [channels, setChannels] = useState(readChannels)
  const [query, setQuery] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [newChannelName, setNewChannelName] = useState('')

  const filtered = channels.filter((channel) => {
    const term = query.trim().toLowerCase()
    if (!term) {
      return true
    }
    return channel.name.toLowerCase().includes(term) || channel.id.toLowerCase().includes(term)
  })

  function handleAddChannel(event) {
    event.preventDefault()
    if (!newChannelName.trim()) {
      return
    }
    const next = [...channels, { id: generateChannelId(), name: newChannelName.trim() }]
    setChannels(next)
    writeChannels(next)
    setNewChannelName('')
    setShowAddForm(false)
  }

  return (
    <div>
      <h1 className="h3 mb-3">Canale</h1>

      <Form.Control
        className="mb-3"
        placeholder="Cerca un canale per nome o id..."
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />

      {showAddForm ? (
        <Form onSubmit={handleAddChannel} className="d-flex gap-2 mb-3">
          <Form.Control
            placeholder="Nome del nuovo canale"
            value={newChannelName}
            onChange={(event) => setNewChannelName(event.target.value)}
            autoFocus
          />
          <Button type="submit">Crea</Button>
          <Button type="button" variant="outline-secondary" onClick={() => setShowAddForm(false)}>
            Annulla
          </Button>
        </Form>
      ) : (
        <Button
          type="button"
          variant="outline-primary"
          className="mb-3 d-inline-flex align-items-center gap-2"
          onClick={() => setShowAddForm(true)}
        >
          <Plus size={16} aria-hidden="true" />
          Aggiungi un nuovo canale
        </Button>
      )}

      {filtered.length === 0 ? (
        <p className="text-muted">{channels.length === 0 ? 'Nessun canale ancora.' : 'Nessun canale trovato.'}</p>
      ) : (
        <ul className="list-unstyled">
          {filtered.map((channel) => (
            <li key={channel.id} className="d-flex justify-content-between align-items-center p-2 border rounded-3 mb-2">
              <span>{channel.name}</span>
              <span className="text-muted small">#{channel.id}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Channel
