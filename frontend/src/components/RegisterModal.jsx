import { useState } from 'react'
import { Alert, Button, Col, Form, Modal, Row, Spinner } from 'react-bootstrap'
import { useAuth } from '../context/AuthContext'
import PasswordInput from './PasswordInput'

const EMPTY_FORM = {
  firstName: '',
  lastName: '',
  email: '',
  age: '',
  gender: '',
  username: '',
  password: '',
  confirmPassword: '',
}

function RegisterModal({ show, onClose }) {
  const { register } = useAuth()
  const [form, setForm] = useState(EMPTY_FORM)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  function handleChange(field) {
    return (event) => setForm((prev) => ({ ...prev, [field]: event.target.value }))
  }

  function handleClose() {
    setForm(EMPTY_FORM)
    setError(null)
    onClose()
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (form.password !== form.confirmPassword) {
      setError('le password non coincidono')
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      const { confirmPassword: _confirmPassword, age, ...rest } = form
      await register({ ...rest, age: age ? Number(age) : null })
      handleClose()
    } catch (err) {
      setError(err.response?.data?.message ?? 'Registrazione non riuscita')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title className="h5">Crea account</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {error && (
            <Alert variant="danger" className="py-2 small">
              {error}
            </Alert>
          )}
          <Row className="g-2 mb-2">
            <Col>
              <Form.Label className="small mb-1">Nome</Form.Label>
              <Form.Control value={form.firstName} onChange={handleChange('firstName')} required />
            </Col>
            <Col>
              <Form.Label className="small mb-1">Cognome</Form.Label>
              <Form.Control value={form.lastName} onChange={handleChange('lastName')} required />
            </Col>
          </Row>
          <Form.Group className="mb-2">
            <Form.Label className="small mb-1">Email</Form.Label>
            <Form.Control type="email" value={form.email} onChange={handleChange('email')} required />
          </Form.Group>
          <Row className="g-2 mb-2">
            <Col>
              <Form.Label className="small mb-1">Età</Form.Label>
              <Form.Control type="number" min={1} max={120} value={form.age} onChange={handleChange('age')} required />
            </Col>
            <Col>
              <Form.Label className="small mb-1">Sesso</Form.Label>
              <Form.Select value={form.gender} onChange={handleChange('gender')} required>
                <option value="" disabled>
                  Seleziona...
                </option>
                <option value="F">Femmina</option>
                <option value="M">Maschio</option>
                <option value="Altro">Altro</option>
              </Form.Select>
            </Col>
          </Row>
          <Row className="g-2 mb-2">
            <Col>
              <Form.Label className="small mb-1">Username</Form.Label>
              <Form.Control value={form.username} onChange={handleChange('username')} required />
            </Col>
            <Col>
              <Form.Label className="small mb-1">Password</Form.Label>
              <PasswordInput value={form.password} onChange={handleChange('password')} required />
            </Col>
          </Row>
          <Form.Group className="mb-0">
            <Form.Label className="small mb-1">Conferma password</Form.Label>
            <PasswordInput value={form.confirmPassword} onChange={handleChange('confirmPassword')} required />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button type="submit" variant="primary" className="w-100" disabled={submitting}>
            {submitting ? <Spinner size="sm" animation="border" /> : 'Crea account'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}

export default RegisterModal
