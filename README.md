# Social network (progetto finale)

Prima di tutto leggi **[`Documentazione/Progettazione/Scrittura/1-Primo da leggere.txt`](Documentazione/Progettazione/Scrittura/1-Primo%20da%20leggere.txt)**.

Progetto D5: creazione di post con una o più foto (fotocamera o upload), posizione associata al
post (mappa o indirizzo), documenti caricati sul profilo con estrazione testo via OCR.

## Struttura

- `backend/` - Spring Boot (Java), API REST
- `frontend/` - React + Vite
- `Documentazione/Progettazione/Scrittura/` - entità, controller, service, tecnologie e decisioni
  prese, spiegati in modo discorsivo
- `docs/` - appunti di lavoro, non versionati

## Branch

- `master` - solo le funzionalità richieste dalle slide
- `extra` - funzionalità aggiuntive (login e registrazione)

## Avvio

### Backend

1. Copia `backend/src/main/resources/application.properties.example` in
   `application.properties` e completa credenziali database e chiavi API.
2. `cd backend && ./mvnw.cmd spring-boot:run` (Windows) o `./mvnw spring-boot:run`

Gira su `http://localhost:3001`.

### Frontend

1. Copia `frontend/.env.example` in `.env` e completa la chiave Google Maps.
2. `cd frontend && npm install && npm run dev`

Gira su `http://localhost:5173`.
