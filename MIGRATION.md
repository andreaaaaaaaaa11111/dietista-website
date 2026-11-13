# Migrazione dei servizi proprietari

Il progetto non dipende più dalla piattaforma originale: build, risorse e integrazioni sono gestiti dal codice e dai servizi configurati qui sotto.

Le sostituzioni adottate sono:

- build e sviluppo: Vite standard;
- autenticazione: Supabase Auth con email e password;
- AI per l'area amministrativa: Ollama locale, senza invio di contenuti a terzi;
- notifiche email: Resend;
- file: storage S3 compatibile;
- immagine del profilo: asset locale nel progetto.

Per il sito pubblico non sono necessarie credenziali. Per attivare registrazione
e accesso servono l'URL e la chiave pubblica di un progetto Supabase gratuito.
Il catalogo servizi ha un fallback locale e resta visibile anche senza database.
Vedi `.env.example` per tutte le variabili supportate.
