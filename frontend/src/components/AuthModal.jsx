import { useState } from 'react'
import { Alert, Button, Col, Form, Modal, Row, Spinner } from 'react-bootstrap'
import { useAuth } from '../context/AuthContext'
import PasswordInput from './PasswordInput'

const EMPTY_LOGIN = { username: '', password: '' }
const EMPTY_REGISTER = {
  firstName: '',
  lastName: '',
  email: '',
  age: '',
  gender: '',
  username: '',
  password: '',
  confirmPassword: '',
}

function AuthModal() {
  const { showAuthModal, closeAuthModal, login, register } = useAuth()
  const [mode, setMode] = useState('login')
  const [loginForm, setLoginForm] = useState(EMPTY_LOGIN)
  const [registerForm, setRegisterForm] = useState(EMPTY_REGISTER)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  function handleLoginChange(field) {
    return (event) => setLoginForm((prev) => ({ ...prev, [field]: event.target.value }))
  }

  function handleRegisterChange(field) {
    return (event) => setRegisterForm((prev) => ({ ...prev, [field]: event.target.value }))
  }

  function handleClose() {
    setMode('login')
    setLoginForm(EMPTY_LOGIN)
    setRegisterForm(EMPTY_REGISTER)
    setError(null)
    closeAuthModal()
  }

  function switchToRegister() {
    setError(null)
    setMode('register')
  }

  async function handleLoginSubmit(event) {
    event.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      await login(loginForm.username, loginForm.password)
      handleClose()
    } catch (err) {
      setError(err.response?.data?.message ?? 'Accesso non riuscito')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleRegisterSubmit(event) {
    event.preventDefault()
    if (registerForm.password !== registerForm.confirmPassword) {
      setError('le password non coincidono')
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      const { confirmPassword: _confirmPassword, age, ...rest } = registerForm
      await register({ ...rest, age: age ? Number(age) : null })
      handleClose()
    } catch (err) {
      setError(err.response?.data?.message ?? 'Registrazione non riuscita')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal show={showAuthModal} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title className="h5">{mode === 'login' ? 'Accedi' : 'Crea account'}</Modal.Title>
      </Modal.Header>

      {mode === 'login' ? (
        <Form onSubmit={handleLoginSubmit}>
          <Modal.Body>
            {error && (
              <Alert variant="danger" className="py-2 small">
                {error}
              </Alert>
            )}
            <Form.Group className="mb-2">
              <Form.Label className="small mb-1">Username</Form.Label>
              <Form.Control value={loginForm.username} onChange={handleLoginChange('username')} required />
            </Form.Group>
            <Form.Group className="mb-0">
              <Form.Label className="small mb-1">Password</Form.Label>
              <PasswordInput value={loginForm.password} onChange={handleLoginChange('password')} required />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer className="d-flex flex-column align-items-stretch gap-2">
            <Button type="submit" variant="primary" disabled={submitting}>
              {submitting ? <Spinner size="sm" animation="border" /> : 'Accedi'}
            </Button>
            <button
              type="button"
              className="btn btn-link btn-sm p-0 text-decoration-none align-self-center"
              onClick={switchToRegister}
            >
              Non sono registrato
            </button>
          </Modal.Footer>
        </Form>
      ) : (
        <Form onSubmit={handleRegisterSubmit}>
          <Modal.Body>
            {error && (
              <Alert variant="danger" className="py-2 small">
                {error}
              </Alert>
            )}
            <Row className="g-2 mb-2">
              <Col>
                <Form.Label className="small mb-1">Nome</Form.Label>
                <Form.Control value={registerForm.firstName} onChange={handleRegisterChange('firstName')} required />
              </Col>
              <Col>
                <Form.Label className="small mb-1">Cognome</Form.Label>
                <Form.Control value={registerForm.lastName} onChange={handleRegisterChange('lastName')} required />
              </Col>
            </Row>
            <Form.Group className="mb-2">
              <Form.Label className="small mb-1">Email</Form.Label>
              <Form.Control type="email" value={registerForm.email} onChange={handleRegisterChange('email')} required />
            </Form.Group>
            <Row className="g-2 mb-2">
              <Col>
                <Form.Label className="small mb-1">Età</Form.Label>
                <Form.Control
                  type="number"
                  min={1}
                  max={120}
                  value={registerForm.age}
                  onChange={handleRegisterChange('age')}
                  required
                />
              </Col>
              <Col>
                <Form.Label className="small mb-1">Sesso</Form.Label>
                <Form.Select value={registerForm.gender} onChange={handleRegisterChange('gender')} required>
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
                <Form.Control value={registerForm.username} onChange={handleRegisterChange('username')} required />
              </Col>
              <Col>
                <Form.Label className="small mb-1">Password</Form.Label>
                <PasswordInput value={registerForm.password} onChange={handleRegisterChange('password')} required />
              </Col>
            </Row>
            <Form.Group className="mb-0">
              <Form.Label className="small mb-1">Conferma password</Form.Label>
              <PasswordInput value={registerForm.confirmPassword} onChange={handleRegisterChange('confirmPassword')} required />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button type="submit" variant="primary" className="w-100" disabled={submitting}>
              {submitting ? <Spinner size="sm" animation="border" /> : 'Crea account'}
            </Button>
          </Modal.Footer>
        </Form>
      )}
    </Modal>
  )
}

export default AuthModal
