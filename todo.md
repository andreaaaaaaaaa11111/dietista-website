# Dietista Website - TODO

## Database & Schema
- [x] Creare tabella servizi (id, titolo, descrizione, durata, prezzo, attivo)
- [x] Creare tabella appuntamenti (id, userId, servizioId, data, ora, stato, note, paymentStatus, paymentIntentId)
- [x] Creare tabella articoli blog (id, titolo, slug, contenuto, immagine, categoria, pubblicato, dataCreazione, dataAggiornamento)
- [x] Creare tabella testimonianze (id, nome, contenuto, rating, immagine, approvato, dataCreazione)
- [x] Creare tabella richieste contatto (id, nome, email, telefono, tipoConsulenza, messaggio, stato, dataCreazione)
- [x] Creare tabella slot disponibilità (id, giornoSettimana, oraInizio, oraFine, attivo)
- [x] Creare tabella categorie blog (id, nome, slug, descrizione)

## Backend API (tRPC Procedures)
- [x] Procedure pubbliche per recuperare servizi
- [x] Procedure pubbliche per recuperare articoli blog pubblicati
- [x] Procedure pubbliche per recuperare testimonianze approvate
- [x] Procedure pubbliche per inviare richiesta contatto con notifica email
- [x] Procedure pubbliche per verificare slot disponibili
- [x] Procedure pubbliche per creare prenotazione con pagamento Stripe
- [x] Procedure protette admin per gestire servizi (CRUD)
- [x] Procedure protette admin per gestire appuntamenti (visualizza, aggiorna stato, cancella)
- [x] Procedure protette admin per gestire articoli blog (CRUD)
- [x] Procedure protette admin per gestire testimonianze (approva, rifiuta, elimina)
- [x] Procedure protette admin per visualizzare richieste contatto
- [x] Procedure protette admin per gestire slot disponibilità
- [x] Procedure protette admin per assistente AI generazione contenuti blog

## Frontend - Pagine Pubbliche
- [x] Homepage con hero section, presentazione dietista, servizi in evidenza, testimonianze, CTA prenotazione
- [x] Pagina Servizi con lista dettagliata e descrizioni complete
- [x] Pagina Chi Sono con biografia, formazione, certificazioni, approccio metodologico
- [x] Pagina Blog con lista articoli, filtri per categoria, ricerca
- [x] Pagina dettaglio articolo blog con contenuto completo
- [x] Pagina Prenotazione con selezione servizio, calendario interattivo, selezione orari, form dati cliente
- [x] Pagina Contatti con form completo e informazioni studio
- [x] Pagina Testimonianze con recensioni clienti

## Frontend - Dashboard Admin
- [x] Layout dashboard con sidebar navigazione
- [x] Pagina gestione appuntamenti con calendario e lista
- [ ] Pagina gestione servizi (aggiungi, modifica, elimina)
- [x] Pagina gestione articoli blog con editor ricco
- [ ] Pagina gestione testimonianze (approva, modera)
- [ ] Pagina visualizzazione richieste contatto
- [ ] Pagina gestione disponibilità orari
- [x] Pagina assistente AI per generazione contenuti blog

## Integrazione Pagamenti Stripe
- [x] Configurare Stripe con webdev_add_feature
- [x] Implementare creazione Payment Intent per prenotazioni
- [x] Implementare conferma pagamento e aggiornamento stato appuntamento
- [x] Gestire webhook Stripe per conferme pagamento

## Sistema Notifiche Email
- [x] Email conferma prenotazione al cliente
- [x] Notifica alla dietista per nuova prenotazione
- [x] Notifica alla dietista per nuova richiesta contatto

## Assistente AI
- [x] Interfaccia chat per generare bozze articoli blog
- [x] Generazione ricette salutari con AI
- [x] Suggerimenti contenuti educativi

## Design & Styling
- [x] Definire palette colori elegante e professionale
- [x] Configurare tipografia raffinata
- [x] Creare componenti UI riutilizzabili
- [x] Implementare design responsive per mobile
- [ ] Ottimizzare immagini e performance

## Testing & Deployment
- [x] Scrivere test Vitest per procedure critiche
- [x] Testare flusso prenotazione completo
- [ ] Testare integrazione pagamenti
- [ ] Testare notifiche email
- [ ] Verificare responsive design
- [ ] Creare checkpoint finale

## Bug Fixes
- [x] Correggere errore nested anchor tag in pagina prenotazione

## Sistema Autenticazione e Area Utente
- [x] Creare componente LoginButton per header
- [x] Implementare protezione route admin con redirect
- [x] Creare pagina Area Personale utente
- [x] Mostrare lista prenotazioni utente in area personale
- [x] Permettere cancellazione prenotazioni da area utente
- [x] Aggiornare flusso prenotazione per associare appuntamenti all'utente loggato
- [x] Aggiungere link area personale nel menu utente
- [x] Testare flusso completo login -> prenotazione -> gestione

## Miglioramenti Dashboard Admin
- [x] Creare sidebar elegante con navigazione admin
- [x] Aggiungere funzionalità modifica articoli blog esistenti
- [x] Implementare editor ricco per contenuti blog
- [x] Potenziare assistente AI con più opzioni (articoli, ricette, consigli)
- [x] Aggiungere anteprima articolo in tempo reale
- [x] Migliorare layout dashboard con statistiche

## Semplificazione Sistema Prenotazione
- [x] Rimuovere integrazione Stripe e pagamenti
- [x] Rimuovere tabella appuntamenti e logica prenotazione online
- [x] Creare tabella consultation_requests nel database
- [x] Aggiornare db.ts con funzioni consultation requests
- [x] Aggiornare routers.ts senza Stripe e appointments
- [x] Creare questionario contatto per richiesta consulenza
- [x] Implementare invio email automatica al paziente con contatti dietista
- [x] Aggiornare pagina prenotazione con nuovo questionario
- [x] Aggiornare dashboard admin per gestire richieste consulenza
- [x] Testare invio email e flusso completo

## Funzionalità Area Utente
- [x] Creare tabella blog_likes per salvare like degli utenti agli articoli
- [x] Creare tabella saved_posts per salvare articoli preferiti
- [x] Creare tabella user_preferences per salvare preferenze tema e altre impostazioni
- [x] Aggiungere procedure backend per like/unlike articoli
- [x] Aggiungere procedure backend per salvare/rimuovere articoli
- [x] Aggiungere procedure backend per salvare/recuperare preferenze uten- [x] Creare pagina Area Personale utente con dashboard
- [x] Implementare calcolatore BMI nell'area personale
- [x] Implementare sezione articoli salvati nell'area personale
- [x] Aggiungere pulsanti like e salva negli articoli blog
- [x] Implementare personalizzazione tema sito (light/dark/system)
- [x] Testare tutte le funzionalità area utente e applicarle automaticamente
- [x] Testare tutte le funzionalità area utente

## Personalizzazione Email e Privacy
- [x] Creare tabella email_templates per salvare template email personalizzabili
- [x] Aggiungere pagina admin per modificare contenuto email automatica
- [x] Aggiungere checkbox consenso privacy nel questionario consulenza
- [x] Validare che il consenso sia obbligatorio prima dell'invio
- [x] Salvare stato consenso nel database con timestamp
- [x] Implementare logica invio email con template personalizzato

## Invio Email Paziente
- [x] Implementare invio email reale al paziente usando notifyOwner
- [x] Formattare email con template personalizzato
- [x] Aggiungere pulsante "Torna alla Home" nella pagina conferma
- [x] Testare invio email completo

## Sistema Email Dual Notification
- [x] Aggiungere campo emailVerified e verificationToken in consultationRequests
- [x] Creare tabella app_settings per email admin configurabile
- [x] Implementare generazione token verifica univoco
- [x] Creare endpoint pubblico per verifica email tramite token
- [x] Modificare invio notifiche per inviare a admin e paziente
- [x] Aggiungere pagina conferma email con messaggio successo
- [x] Creare pagina admin per modificare email notifiche
- [x] Testare flusso completo verifica email e notifiche dual
- [x] Creare test vitest per sistema consultazioni (11/11 passati)

## Sistema Email Paziente Unificato
- [x] Modificare endpoint consultations.submit per inviare email al paziente con template personalizzabile
- [x] Usare notifyOwner per inviare email al paziente come alla dietista
- [x] Integrare template email dalla dashboard EmailSettings
- [x] Inviare notifica separata alla dietista
- [x] Risolvere problema duplicazione header nella pagina VerifyEmail
- [x] Aggiungere rotta /verifica-email con PublicLayout

## Pannello Gestione Consulenze
- [x] Creare pagina ConsultationManagement.tsx nella dashboard admin
- [x] Visualizzare tabella con tutte le richieste di consulenza
- [x] Aggiungere pulsante per visualizzare dettagli completi
- [x] Aggiungere pulsante per eliminare consulenze
- [x] Aggiungere rotta /admin/gestione-consulenze
- [x] Aggiungere link nel menu admin sidebar
- [x] Implementare dialog per visualizzare dettagli consulenza


## Bug Fix - Email Paziente
- [x] Implementare invio email reale all'indirizzo email del paziente (non solo a owner)
- [x] Usare Forge API per inviare email con contatti dietista al paziente
- [x] Testare invio email al paziente
- [x] Riaggiungere sezione testimonianze nella homepage


## Bug Fix - Contact Form
- [x] Aggiungere router contact con endpoint submit nel routers.ts
- [x] Implementare funzione createContactRequest nel db.ts (già esistente)
- [x] Inviare notifica email al proprietario quando viene compilato il form
- [x] Testare il form di contatto


## Bug Fix - Header Duplicato e Blog
- [x] Risolvere problema header duplicato nella pagina /prenota
- [x] Aggiungere endpoint blog.generateContent nel routers
- [x] Creare pagina admin /admin/contatti per gestire messaggi
- [x] Aggiungere funzione updateContactRequest nel db.ts
- [x] Implementare opzione marcare come "letto" o "risposto"
- [x] Aggiungere endpoint contact.delete per eliminare messaggi
- [x] Aggiungere link Messaggi Contatto nel menu admin
- [x] Correggere errori TypeScript (consultations.listAll, contact.listAll, blog.categories)


## Sistema Recensioni Utenti
- [x] Creare form per utenti loggati per aggiungere recensioni
- [x] Creare pagina admin per approvare/eliminare recensioni
- [x] Aggiungere endpoint testimonials.submit per utenti
- [x] Aggiungere endpoint testimonials.approve e testimonials.delete per admin
- [x] Mostrare solo recensioni approvate nella pagina pubblica

## Sistema Commenti Blog
- [x] Creare tabella blog_comments nel database
- [x] Aggiungere endpoint per creare/eliminare commenti (blogComments router)
- [x] Visualizzare commenti sotto ogni articolo blog
- [x] Permettere agli utenti loggati di commentare

## Visualizzazione Email Utente
- [x] Mostrare email utente cliccando sull'avatar nei commenti
- [x] Aggiungere dialog con email per contatto
- [x] Implementare in commenti blog e recensioni


## Sistema Risposte Commenti Blog
- [x] Aggiungere campo parentId e isAdminReply alla tabella blog_comments
- [x] Aggiornare funzioni db.ts per gestire risposte (getCommentsByPostId con risposte annidate)
- [x] Aggiungere endpoint blogComments.adminReply per rispondere ai commenti
- [x] Aggiornare UI BlogPost per mostrare risposte sotto i commenti
- [x] Aggiungere pulsante "Rispondi" visibile solo alla dietista (admin)
- [x] Testare sistema risposte completo (15/15 test passati)


## Bug Fix - Email Paziente Non Arriva
- [ ] Verificare la funzione sendEmail nel server
- [ ] Controllare che l'API Forge sia configurata correttamente
- [ ] Testare invio email reale al paziente
- [ ] Verificare i log per errori di invio

## Sistema Menzioni @utente
- [ ] Creare componente per autocomplete menzioni
- [ ] Aggiungere parsing delle menzioni nel contenuto commenti
- [ ] Evidenziare le menzioni nel testo visualizzato
- [ ] Opzionale: notificare utenti menzionati


## Rimozione Sistema Commenti Blog
- [x] Rimuovere sezione CommentsSection dalla pagina BlogPost.tsx
- [x] Rimuovere router blogComments dal routers.ts
- [x] Rimuovere funzioni blog comments dal db.ts
- [x] Rimuovere import blogComments dal db.ts
- [x] Rimuovere file test blogComments.test.ts
- [x] Aggiornare pagina conferma questionario con contatti diretti


## Miglioramenti Dashboard
- [x] Rimuovere Email Settings dalla dashboard admin
- [x] Rimuovere rotta /admin/email-settings dal App.tsx
- [x] Rimuovere link Email Settings dal menu AdminLayout
- [x] Aggiungere pulsante "Torna alla Home" nella dashboard admin
- [x] Aggiungere pulsante "Torna alla Home" nella dashboard utente (DashboardLayout)


## Sistema Diete Private Pazienti
- [x] Creare tabella diets nel database con userId e contenuto
- [x] Aggiungere funzioni db per creare/leggere/aggiornare diete
- [x] Aggiungere router diets con endpoint admin e user
- [x] Creare sezione La Tua Dieta nella dashboard utente
- [x] Creare pagina admin per caricare diete per i pazienti
- [x] Implementare visualizzazione dieta con formattazione
- [x] Testare accesso privato alle diete

## Sistema Diete - Upload PDF e Ottimizzazioni
- [x] Aggiornare schema database per salvare URL PDF e fileKey
- [x] Modificare funzioni backend per gestire upload PDF su S3
- [x] Aggiornare router diets per upload file
- [x] Modificare pagina admin con input file per upload PDF
- [x] Aggiornare dashboard utente con pulsante download PDF
- [x] Rimuovere campi content e notes non più necessari
- [x] Ottimizzare performance: lazy loading immagini
- [x] Ottimizzare performance: CSS hardware acceleration
- [x] Ottimizzare performance: smooth scrolling
- [x] Testare upload e download PDF

## Ricerca Pazienti in Gestione Diete
- [x] Modificare query getAllDiets per includere dati utente (nome, email)
- [x] Aggiungere campo di ricerca nella pagina admin
- [x] Implementare filtro client-side per nome/email
- [x] Mostrare nome e email nella tabella diete
- [x] Testare funzionalità ricerca

## Selezione Paziente per Nome/Email nel Form Dieta
- [x] Creare endpoint backend per lista pazienti che hanno compilato questionario
- [x] Implementare Select searchable con autocomplete nel form
- [x] Rimuovere campo manuale ID Paziente
- [x] Mostrare nome + email in dropdown
- [x] Testare selezione e caricamento dieta

## Bug Fix e Nuove Feature Diete
- [x] Diagnosticare perché la dieta non appare al paziente (utente sbagliato selezionato)
- [x] Sistema funziona correttamente - problema era selezione utente
- [x] Testare caricamento e visualizzazione dieta con utente corretto
- [x] Modificare schema database per storico versioni (aggiungere campo version/date)
- [x] Implementare salvataggio multiplo versioni invece di sovrascrittura
- [x] Aggiungere endpoint backend per storico e mark as viewed
- [x] Creare UI per visualizzare storico versioni nella dashboard paziente
- [x] Aggiungere badge "Nuova" quando dieta viene caricata/aggiornata
- [x] Implementare logica per marcare dieta come "vista" dal paziente

## UI Improvements
- [x] Ingrandire dialog dettagli consulenza per migliorare leggibilità

## Nuove Feature Richieste
- [ ] Aggiungere campo immagine nello schema blog
- [ ] Implementare upload immagini per articoli blog
- [ ] Convertire AdminLayout a menu drawer laterale
- [ ] Aggiungere nome dietista Arianna Pelliccioni nella homepage

## Nuove Feature Richieste
- [ ] Aggiungere campo immagine nello schema blog
- [ ] Implementare upload immagini per articoli blog
- [ ] Convertire AdminLayout a menu drawer laterale
- [ ] Aggiungere nome dietista Arianna Pelliccioni nella homepage


## Personalizzazione Finale Sito
- [x] Modificare sezione contatti con dati Arianna (testi singolari)
- [x] Rimuovere orari di apertura dalla pagina contatti
- [x] Cambiare email notifiche a pelliccioniarianna.dietista@gmail.com (verificato: sistema usa notifyOwner)
- [x] Aggiornare servizi nella sezione footer
- [x] Aggiungere foto profilo nella sezione hero


## Modifiche Richieste - Sessione Gennaio 2026
- [x] Rimuovere numeri hardcoded dalla homepage (500+ clienti, 10+ anni, 95% tasso, 4.9/5 valutazione)
- [x] Impostare tutti i numeri a zero e farli aggiornare automaticamente con le recensioni
- [x] Rimuovere "Anni di Esperienza" dalla sezione statistiche
- [x] Cambiare "Tasso di Successo" in "Grado di Soddisfazione dei Pazienti"
- [x] Rimuovere Assistente AI dalla dashboard admin
- [x] Rimuovere Blog dalla dashboard admin
- [x] Migliorare layout sezione messaggi nella dashboard admin
- [x] Eliminare completamente il sistema di invio diete attraverso il sito
- [x] Aggiornare tendina "Tipo di Consulenza" con servizi reali (da sezione servizi)
- [x] Configurare email admin pelliccioniarianna.dietista@gmail.com per ricevere tutte le notifiche
- [x] Disabilitare invio email dal form contatti (richieste salvate solo in Dashboard Admin)


## Ottimizzazione Indicizzazione Google - Febbraio 2026
- [x] Ridurre visibilità pagine secondarie nei risultati Google (Chi Sono, Servizi)
- [x] Dare priorità alla homepage come risultato principale
- [x] Aggiornare robots.txt per ottimizzare crawling
- [x] Modificare meta tags delle pagine secondarie
- [x] Aggiornare sitemap.xml con priorità corrette
- [x] Testare le modifiche SEO
- [ ] Creare checkpoint finale


## Favicon e Logo Sito - Febbraio 2026
- [x] Estrarre e ottimizzare logo dalla screenshot
- [x] Generare favicon in formato ICO e PNG
- [x] Generare apple-touch-icon per iOS
- [x] Aggiungere favicon nella cartella public
- [x] Aggiornare meta tags in index.html
- [x] Testare favicon nel browser
- [x] Creare checkpoint finale


## Logo Completo e Pattern Decorativo - Febbraio 2026
- [x] Caricare logo completo (icona + testo Arianna Pelliccioni DIETISTA)
- [x] Caricare pattern decorativo con foglie ripetute
- [x] Sostituire testo con logo nell'Header
- [x] Aggiungere logo nel Footer
- [x] Aggiungere pattern decorativo nella pagina Contatti
- [x] Testare su tutte le pagine
- [x] Creare checkpoint finale


## Correzione Pattern Decorativo - Febbraio 2026
- [x] Modificare CSS per mostrare pattern solo dietro le card
- [x] Testare visibilità pattern nella pagina Contatti
- [x] Creare checkpoint finale


## Aumento Visibilità Pattern - Febbraio 2026
- [x] Aumentare opacità pattern da 0.08 a 0.5 per massima visibilità
- [x] Testare visibilità pattern dietro le card
- [x] Creare checkpoint finale


## Pattern Verde Dentro Card - Febbraio 2026
- [x] Rimuovere pattern da sfondo pagina
- [x] Applicare pattern come sfondo delle card bianche
- [x] Mantenere sfondo beige/crema esterno
- [x] Testare visibilità e leggibilità
- [x] Creare checkpoint finale


## Ripristino Card Bianche - Febbraio 2026
- [x] Rimuovere pattern verde dalle card
- [x] Rimuovere overlay semi-trasparente
- [x] Ripristinare sfondo bianco pulito originale
- [ ] Creare checkpoint finale

## Foto Professionale Sezione Chi Sono
- [x] Caricare foto professionale della dietista in alta qualità (4K)
- [x] Integrare foto nella pagina Chi Sono con layout ottimizzato
- [x] Mantenere qualità originale dell'immagine

## Correzioni UI e Configurazioni
- [x] Cambiare "Dashboard Admin" in "Pannello di Controllo"
- [x] Impostare tema predefinito su chiaro (light) invece di scuro
- [x] Correggere visibilità logo in modalità scura
- [x] Cambiare nome account admin da "io rossi" a "Dottoressa Pelliccioni"

## UI Dialog Dettagli Consulenza
- [x] Allargare il dialog dei dettagli consulenza per migliorare leggibilità

## Favicon Aggiornato (Icona Scheda Browser)
- [x] Creare favicon quadrato dall'icona foglia fornita dall'utente
- [x] Generare favicon in tutte le dimensioni (16x16, 32x32, 180x180, 512x512)
- [x] Ripristinare logo header originale (non modificato)
- [x] Ingrandire favicon riducendo padding (da 8% a 2%) per icona più visibile

## Ottimizzazioni SEO
- [x] Correggere titolo homepage (30-60 caratteri) - ora 64 caratteri
- [x] Aggiungere meta description per tutte le pagine principali
- [x] Implementare Open Graph tags per social sharing
- [x] Aggiungere canonical URLs per tutte le pagine
- [x] Aggiornare sitemap.xml con priorità corrette
- [x] Creare componente SEO riutilizzabile
- [ ] Aggiungere structured data (LocalBusiness, Person, Service)
- [ ] Ottimizzare alt text delle immagini

## Form Prenotazione Multi-Step
- [x] Riscrivere Booking.tsx con Step 1 (dati contatto + servizio) e Step 2 (dati clinici facoltativi)
- [x] Aggiungere barra di avanzamento visiva tra i due step
- [x] Aggiungere pulsante "Indietro" nello Step 2
- [x] Mantenere validazione campi obbligatori solo sullo Step 1

## Fix Login Apple + Area Utente Arricchita
- [x] Correggere flusso OAuth per login Apple (nome vuoto al secondo accesso, fallback da email)
- [x] Aggiungere Diario Alimentare nell'area utente (per pasto, con calorie)
- [x] Aggiungere Tracker Peso e Misure nell'area utente (storico, trend)
- [x] Aggiungere tab navigazione nell'area utente (Panoramica, Diario, Peso, Salvati, Impostazioni)
- [x] Creare tabelle food_diary e body_measurements nel database
- [x] Aggiungere procedure tRPC per diario alimentare e misurazioni corporee

## Ripristino Area Utente Semplice
- [x] Ripristinare UserDashboard con solo BMI e tema del sito
- [x] Aggiungere sezione stato consulenza/prenotazione
- [x] Aggiungere procedura backend per leggere consulenze per email utente

## Fix Area Utente - Consulenze e Tema
- [x] Correggere visualizzazione consulenze (ricerca per userId oltre che email, fallback email)
- [x] Abilitare ThemeProvider come switchable per permettere cambio tema
- [x] Correggere logica tema con toggleTheme nativo (no reload)

## Fix Definitivo Consulenze Area Utente
- [x] Salvare userId dell'utente loggato quando invia richiesta di consulenza
- [x] Unire risultati per userId e per email (OR) nella query getMyConsultations
- [x] Collegare consulenze esistenti all'account Apple nel database
- [x] Gestire utenti Apple con multipli record (stessa email, diversi openId)


## MIGRAZIONE COMPLETA DA MANUS A HOSTING GRATUITO

### Fase 1: Pianificazione e Setup Servizi
- [ ] Creare account PlanetScale (database MySQL gratuito)
- [ ] Creare account Supabase (autenticazione gratuita)
- [ ] Creare account Cloudinary (storage immagini gratuito)
- [ ] Creare account Render (backend Node.js gratuito)
- [ ] Creare account Vercel (frontend React gratuito)
- [ ] Creare repository GitHub privato per il progetto

### Fase 2: Esportare Codice da Manus
- [ ] Clonare repository Git dal progetto Manus
- [ ] Esportare schema database (drizzle schema.ts)
- [ ] Esportare variabili ambiente (.env.example)
- [ ] Documentare tutte le procedure tRPC attuali
- [ ] Fare backup completo del database Manus

### Fase 3: Migrare Database
- [ ] Creare database su PlanetScale
- [ ] Esportare dati da TiDB Manus
- [ ] Importare dati in PlanetScale
- [ ] Aggiornare connection string nel codice
- [ ] Testare query e procedure database

### Fase 4: Riscrivere Autenticazione
- [ ] Configurare Supabase Auth
- [ ] Riscrivere server/_core/oauth.ts per Supabase
- [ ] Aggiornare client/src/lib/trpc.ts per Supabase
- [ ] Migrare utenti da Manus a Supabase
- [ ] Testare login/logout/sessioni

### Fase 5: Riconfigurare Storage
- [ ] Configurare Cloudinary API
- [ ] Riscrivere server/storage.ts per Cloudinary
- [ ] Migrare immagini da Manus S3 a Cloudinary
- [ ] Aggiornare URL immagini nel database
- [ ] Testare upload e download immagini

### Fase 6: Deploy Frontend e Backend
- [ ] Configurare Vercel per deploy frontend
- [ ] Configurare Render per deploy backend
- [ ] Setup GitHub Actions per CI/CD
- [ ] Configurare variabili ambiente su Vercel e Render
- [ ] Deploy versione di test

### Fase 7: Riconfigurare Stripe e Dominio
- [ ] Aggiornare webhook Stripe verso nuovo endpoint Render
- [ ] Testare flusso pagamento completo
- [ ] Aggiornare DNS per dominio personalizzato
- [ ] Configurare SSL/HTTPS
- [ ] Testare dominio personalizzato

### Fase 8: Testing Completo
- [ ] Test login (email, Apple, Google)
- [ ] Test prenotazione consulenza
- [ ] Test pagamento Stripe
- [ ] Test upload immagini
- [ ] Test area admin
- [ ] Test responsività mobile
- [ ] Test performance e velocità caricamento

### Fase 9: Cutover Finale
- [ ] Backup finale database Manus
- [ ] Aggiornare DNS verso Vercel/Render
- [ ] Monitorare traffico e errori
- [ ] Preparare rollback plan
- [ ] Cancellare hosting Manus (dopo 1 mese di verifica)
