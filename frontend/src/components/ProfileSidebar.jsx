import { useAuth } from '../context/AuthContext'

const GENDER_LABELS = { M: 'Maschio', F: 'Femmina', Altro: 'Altro' }

function Field({ label, value }) {
  return (
    <div className="d-flex justify-content-between align-items-center py-2 border-bottom">
      <span className="text-muted small">{label}</span>
      <span className="small fw-medium text-end">{value || '—'}</span>
    </div>
  )
}

function ProfileSidebar() {
  const { profile } = useAuth()

  if (!profile) {
    return (
      <div>
        <h2 className="h5 mb-2">Dati personali</h2>
        <p className="text-muted small mb-0">Accedi per vedere i tuoi dati personali.</p>
      </div>
    )
  }

  const fullName = `${profile.firstName ?? ''} ${profile.lastName ?? ''}`.trim()

  return (
    <div>
      <h2 className="h5 mb-3">Dati personali</h2>

      <div className="d-flex flex-column align-items-center text-center mb-3">
        <div
          className="rounded-circle avatar-circle text-white d-flex align-items-center justify-content-center mb-2"
          style={{ width: 64, height: 64, fontSize: '1.5rem', fontWeight: 600 }}
        >
          {profile.username.charAt(0).toUpperCase()}
        </div>
        <span className="fw-semibold">{fullName || profile.username}</span>
        <span className="text-muted small">@{profile.username}</span>
      </div>

      <div>
        <Field label="Nome" value={profile.firstName} />
        <Field label="Cognome" value={profile.lastName} />
        <Field label="Email" value={profile.email} />
        <Field label="Età" value={profile.age} />
        <Field label="Sesso" value={GENDER_LABELS[profile.gender] ?? profile.gender} />
      </div>
    </div>
  )
}

export default ProfileSidebar
