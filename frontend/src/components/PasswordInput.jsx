import { Eye, EyeSlash } from '@phosphor-icons/react'
import { useState } from 'react'
import { Form } from 'react-bootstrap'

// La password si vede solo finche' l'occhiello resta premuto: niente stato "svelata" da richiudere a mano.
function PasswordInput({ value, onChange, size, required, placeholder }) {
  const [visible, setVisible] = useState(false)

  return (
    <div className="position-relative">
      <Form.Control
        type={visible ? 'text' : 'password'}
        size={size}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        style={{ paddingRight: '2.25rem' }}
      />
      <button
        type="button"
        className="btn btn-sm btn-link text-muted position-absolute top-50 end-0 translate-middle-y p-1"
        onMouseDown={() => setVisible(true)}
        onMouseUp={() => setVisible(false)}
        onMouseLeave={() => setVisible(false)}
        onTouchStart={() => setVisible(true)}
        onTouchEnd={() => setVisible(false)}
        tabIndex={-1}
        aria-label="Mostra la password"
      >
        {visible ? <EyeSlash size={16} aria-hidden="true" /> : <Eye size={16} aria-hidden="true" />}
      </button>
    </div>
  )
}

export default PasswordInput
