import { Newspaper } from '@phosphor-icons/react'
import { useState } from 'react'
import { Card, Modal } from 'react-bootstrap'
import { Autoplay } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'

// Contenuto finto e statico, solo per riempire la colonna nella grafica.
const NEWS = [
  {
    title: 'Uomo taggato in un post non suo denuncia "invasione della privacy della mia pigrizia"',
    excerpt: 'Il diretto interessato era solo nella foto sullo sfondo, in pigiama, a comprare il pane.',
    detail:
      'Il diretto interessato era solo nella foto sullo sfondo, in pigiama, a comprare il pane. Secondo la sua ricostruzione, non aveva alcuna intenzione di essere visto in quello stato da oltre duecento persone. Gli avvocati contattati hanno risposto ridendo e chiudendo la chiamata.',
  },
  {
    title: 'Sviluppatore trova un bug alle 2 di notte, lo risolve, poi scopre di aver sognato tutto',
    excerpt: 'Il commit esiste ancora. Nessuno sa spiegare come.',
    detail:
      'Il commit esiste ancora. Nessuno sa spiegare come. Il messaggio recita semplicemente "fix", l\'orario è le 2:14 e il diff è perfettamente funzionante. Il diretto interessato giura di aver sognato l\'intera sessione e si rifiuta di toccare di nuovo quel file per superstizione.',
  },
  {
    title: 'Gatto locale carica 400 foto di se stesso, l\'algoritmo lo promuove a influencer',
    excerpt: 'Il proprietario nega ogni responsabilità. Il gatto non ha rilasciato dichiarazioni.',
    detail:
      'Il proprietario nega ogni responsabilità e sostiene di aver lasciato il telefono incustodito "per due minuti al massimo". Il gatto, che nel frattempo ha superato le diecimila visualizzazioni, non ha rilasciato dichiarazioni ma continua a fissare la fotocamera con aria soddisfatta.',
  },
  {
    title: 'Scoperta una posizione taggata su una mappa che in realtà è il frigorifero di casa',
    excerpt: 'Gli esperti confermano: "Tecnicamente è un luogo".',
    detail:
      'Gli esperti confermano: "Tecnicamente è un luogo". Le coordinate riportano con precisione millimetrica lo scomparto delle verdure. L\'utente sostiene si sia trattato di un tocco accidentale, ma il post resta taggato da tre settimane.',
  },
  {
    title: 'Utente scrive una descrizione lunga tre paragrafi per una foto dei propri piedi',
    excerpt: 'Critici letterari la definiscono "sorprendentemente ben strutturata".',
    detail:
      'Critici letterari la definiscono "sorprendentemente ben strutturata", con un incipit, uno sviluppo e persino un colpo di scena nel terzo paragrafo. Il tema centrale resta comunque un paio di infradito comprate in saldo.',
  },
  {
    title: 'Notifica push fraintesa come dichiarazione d\'amore, era solo "Mario ha commentato"',
    excerpt: 'La coppia si è comunque fidanzata. Il post aveva 2 like.',
    detail:
      'La coppia si è comunque fidanzata. Il post aveva 2 like, uno dei quali dello stesso Mario. Ricostruendo i fatti, la notifica diceva solo "ha commentato il tuo post", ma il tono vibrante dello smartphone ha fatto il resto.',
  },
  {
    title: 'Registrazione utente completata in 4 secondi, battuto il record personale di procrastinazione',
    excerpt: 'La persona festeggia rimandando tutto il resto della giornata.',
    detail:
      'La persona festeggia rimandando tutto il resto della giornata, complimenti compresi. Il modulo aveva solo tre campi, ma restava comunque aperto in un\'altra scheda da sei mesi prima di essere compilato.',
  },
  {
    title: 'Documento caricato sul profilo risulta essere la lista della spesa del 2019',
    excerpt: 'Il testo estratto automaticamente conferma: mancava ancora il latte.',
    detail:
      'Il testo estratto automaticamente conferma: mancava ancora il latte. L\'utente non ricorda di aver mai caricato il file, ma riconosce la propria calligrafia nella voce "non dimenticare il latte" scritta tre volte.',
  },
  {
    title: 'Local business scopre di avere 3 follower, tutti e 3 familiari del proprietario',
    excerpt: 'Il report mensile parla comunque di "crescita del pubblico".',
    detail:
      'Il report mensile parla comunque di "crescita del pubblico" perché a inizio mese i follower erano 2. Il terzo si è aggiunto dopo che la madre del proprietario ha finalmente capito come funziona il pulsante "segui".',
  },
  {
    title: 'Filtro di ricerca indirizzi trova il Polo Nord, utente stava solo cercando "P"',
    excerpt: 'La mappa si è zoomata da sola. Nessuno ha capito perché.',
    detail:
      'La mappa si è zoomata da sola e nessuno ha capito perché. L\'utente digitava semplicemente "P" per "Piazza", ma il suggerimento più vicino era, a quanto pare, il Polo Nord. Il viaggio non è stato confermato.',
  },
  {
    title: 'Post cancellato per sbaglio, ricreato identico dieci minuti dopo con più like',
    excerpt: 'L\'autore sostiene sia "una strategia", i colleghi non ci credono.',
    detail:
      'L\'autore sostiene sia "una strategia", i colleghi non ci credono. Il secondo post, parola per parola identico al primo, ha ottenuto il doppio dei like, alimentando una teoria non confermata sull\'algoritmo e sul destino.',
  },
  {
    title: 'Commento "bellissimo" ricevuto sotto una foto di una bolletta per errore',
    excerpt: 'L\'utente non ha corretto nessuno. La bolletta resta comunque alta.',
    detail:
      'L\'utente non ha corretto nessuno. La bolletta resta comunque alta, ma il commento ha ricevuto sette risposte in cui vari conoscenti si complimentano per "lo stile del layout".',
  },
  {
    title: 'Swiper delle foto scorso 47 volte avanti e indietro per pura noia in riunione',
    excerpt: 'Le foto erano sempre le stesse tre. Nessun rimpianto.',
    detail:
      'Le foto erano sempre le stesse tre. Nessun rimpianto, dichiara l\'utente, che ha comunque imparato a memoria l\'ordine esatto delle immagini e potrebbe recitarlo a richiesta.',
  },
  {
    title: 'Profilo con foto profilo di dieci anni fa segnalato per "eccessivo ottimismo"',
    excerpt: 'L\'utente promette di aggiornarla "la settimana prossima" dal 2019.',
    detail:
      'L\'utente promette di aggiornarla "la settimana prossima" dal 2019. Gli amici confermano che la promessa viene rinnovata puntualmente ogni capodanno, senza mai arrivare a un vero aggiornamento.',
  },
  {
    title: 'Password dimenticata per la terza volta nello stesso pomeriggio, record del team',
    excerpt: 'Il reset via email è ormai il preferito nei segnalibri del browser.',
    detail:
      'Il reset via email è ormai il preferito nei segnalibri del browser, sopra persino alla pagina di login. Il team ha proposto di intitolargli una scorciatoia da tastiera dedicata.',
  },
  {
    title: 'Tag di posizione mette a Roma un post scattato chiaramente in cucina',
    excerpt: 'L\'utente insiste: "È il Colosseo del microonde".',
    detail:
      'L\'utente insiste: "È il Colosseo del microonde". La geolocalizzazione automatica non è stata corretta, e il post resta ufficialmente taggato nel centro storico della capitale.',
  },
]

const VISIBLE_SLIDES = 4
const SLIDE_HEIGHT = 120
const SLIDE_GAP = 12
const cardStyle = { height: SLIDE_HEIGHT, cursor: 'pointer' }
const clampStyle = { display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }

function NewsSidebar() {
  const [selected, setSelected] = useState(null)

  return (
    <div>
      <h2 className="h6 text-uppercase text-center mb-3 d-flex align-items-center justify-content-center gap-2 fw-bold">
        <Newspaper size={18} weight="bold" className="text-primary" aria-hidden="true" />
        Fake News
      </h2>
      <Swiper
        modules={[Autoplay]}
        direction="vertical"
        slidesPerView={VISIBLE_SLIDES}
        spaceBetween={SLIDE_GAP}
        loop
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        style={{ height: VISIBLE_SLIDES * SLIDE_HEIGHT + (VISIBLE_SLIDES - 1) * SLIDE_GAP }}
      >
        {NEWS.map((item) => (
          <SwiperSlide key={item.title}>
            <Card
              style={cardStyle}
              className="news-card"
              onClick={() => setSelected(item)}
              role="button"
              tabIndex={0}
              onKeyDown={(event) => event.key === 'Enter' && setSelected(item)}
            >
              <Card.Body className="p-2 d-flex flex-column justify-content-center">
                <span className="news-card-kicker">In edicola</span>
                <Card.Title className="news-card-headline mb-1" style={clampStyle}>{item.title}</Card.Title>
                <Card.Text className="small text-muted mb-0" style={clampStyle}>{item.excerpt}</Card.Text>
              </Card.Body>
            </Card>
          </SwiperSlide>
        ))}
      </Swiper>

      <Modal show={Boolean(selected)} onHide={() => setSelected(null)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="h5">{selected?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="mb-0">{selected?.detail}</p>
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default NewsSidebar
