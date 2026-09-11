import { Card } from 'react-bootstrap'

// Contenuto finto e statico, solo per riempire la colonna nella grafica.
const NEWS = [
  {
    title: 'Nuovo: caricamento multiplo',
    excerpt: 'Ora puoi aggiungere più foto a un singolo post in un colpo solo.',
  },
  {
    title: 'Posizione sui post',
    excerpt: 'Cerca un indirizzo o clicca direttamente sulla mappa per taggare dove sei.',
  },
  {
    title: 'Documenti sul profilo',
    excerpt: 'Carica un documento e leggi il testo estratto automaticamente.',
  },
  {
    title: 'Suggerimenti indirizzo più rapidi',
    excerpt: 'La ricerca sulla mappa ora propone gli indirizzi mentre scrivi.',
  },
]

function NewsSidebar() {
  return (
    <div>
      <h2 className="h6 text-muted text-uppercase text-center mb-3">Notizie</h2>
      {NEWS.map((item) => (
        <Card key={item.title} className="mb-3">
          <Card.Body>
            <Card.Title className="h6">{item.title}</Card.Title>
            <Card.Text className="small text-muted mb-0">{item.excerpt}</Card.Text>
          </Card.Body>
        </Card>
      ))}
    </div>
  )
}

export default NewsSidebar
