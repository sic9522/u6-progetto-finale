import { useState } from 'react'
import { Alert, Button, Dropdown, Form, Spinner } from 'react-bootstrap'
import { useAuth } from '../context/AuthContext'
import PasswordInput from './PasswordInput'
import RegisterModal from './RegisterModal'

const EMPTY_FORM = { username: '', password: '' }

function LoginMenu() {
  const { username, login, logout } = useAuth()
  const [form, setForm] = useState(EMPTY_FORM)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [showRegister, setShowRegister] = useState(false)

  function handleChange(field) {
    return (event) => setForm((prev) => ({ ...prev, [field]: event.target.value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      await login(form.username, form.password)
      setForm(EMPTY_FORM)
    } catch (err) {
      setError(err.response?.data?.message ?? 'Accesso non riuscito')
    } finally {
      setSubmitting(false)
    }
  }

  if (username) {
    return (
      <Dropdown align="end">
        <Dropdown.Toggle as="button" type="button" className="btn btn-sm btn-outline-secondary">
          {username}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item onClick={logout}>Esci</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    )
  }

  return (
    <>
      <Dropdown align="end" autoClose="outside">
        <Dropdown.Toggle as="button" type="button" className="btn btn-sm btn-primary">
          Login
        </Dropdown.Toggle>
        <Dropdown.Menu className="p-3" style={{ minWidth: 240 }}>
          <Form onSubmit={handleSubmit}>
            {error && (
              <Alert variant="danger" className="py-1 small">
                {error}
              </Alert>
            )}
            <Form.Group className="mb-2">
              <Form.Label className="small mb-1">Username</Form.Label>
              <Form.Control size="sm" value={form.username} onChange={handleChange('username')} required />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label className="small mb-1">Password</Form.Label>
              <PasswordInput size="sm" value={form.password} onChange={handleChange('password')} required />
            </Form.Group>
            <Button type="submit" variant="primary" size="sm" className="w-100 mb-2" disabled={submitting}>
              {submitting ? <Spinner size="sm" animation="border" /> : 'Accedi'}
            </Button>
            <button
              type="button"
              className="btn btn-link btn-sm p-0 text-decoration-none"
              onClick={() => setShowRegister(true)}
            >
              Non sono registrato
            </button>
          </Form>
        </Dropdown.Menu>
      </Dropdown>
      <RegisterModal show={showRegister} onClose={() => setShowRegister(false)} />
    </>
  )
}

export default LoginMenu
