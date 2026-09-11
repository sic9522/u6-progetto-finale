import { Rocket } from '@phosphor-icons/react'

function ProfileChannelsAside() {
  return (
    <div>
      <h2 className="h5 mb-3">Canali</h2>
      <aside className="d-flex flex-column align-items-center text-center gap-2 py-5 px-3 rounded-3 bg-light border">
        <Rocket size={32} className="text-primary" aria-hidden="true" />
        <span className="fw-semibold">Presto in arrivo</span>
        <p className="text-muted small mb-0">Stiamo lavorando ai canali: torna a trovarci a breve.</p>
      </aside>
    </div>
  )
}

export default ProfileChannelsAside
