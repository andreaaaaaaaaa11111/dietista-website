# Database Supabase

Il sito usa Supabase/PostgreSQL per:

- profili e ruolo amministratore;
- servizi;
- richieste di consulenza;
- messaggi di contatto;
- testimonianze;
- statistiche di utilizzo del sito.

Le migrazioni si trovano in `supabase/migrations`. Nel progetto Supabase della
produzione sono già state applicate e i sei servizi ufficiali sono già presenti.

Le tabelle pubbliche hanno Row Level Security attiva: i visitatori possono
inviare moduli, ma soltanto l'amministratore può leggere o modificare i dati
sensibili dalla dashboard.

Non è più necessario configurare `DATABASE_URL` per questi flussi.
