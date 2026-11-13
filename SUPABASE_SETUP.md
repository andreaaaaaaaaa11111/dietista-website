# Attivare l'accesso con Supabase

1. Crea un progetto gratuito su `https://supabase.com/dashboard`.
2. Nel pannello del progetto apri **Connect** e copia:
   - Project URL;
   - Publishable key.
3. Crea un file `.env` nella cartella del sito e inserisci:

   ```env
   VITE_SUPABASE_URL=https://tuo-progetto.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=la-tua-chiave-pubblica
   ADMIN_EMAILS=pelliccioniarianna.dietista@gmail.com,andreapelliccioni12@gmail.com
   ```

4. In **Authentication > URL Configuration** imposta:
   - Site URL: `http://localhost:3000` durante lo sviluppo;
   - Redirect URL: `http://localhost:3000/**`.
5. Ricostruisci e riavvia il sito.

La chiave richiesta è pubblicabile nel browser. Non inserire mai nel frontend la
`service_role` key. L'email indicata in `ADMIN_EMAILS` riceve il ruolo admin solo
dopo un accesso Supabase valido.

Il progetto include anche le migrazioni PostgreSQL in `supabase/migrations`.
