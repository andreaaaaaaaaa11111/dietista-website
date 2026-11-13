# Email di benvenuto Supabase

Il template `confirm-signup.html` è destinato a:

**Authentication → Email Templates → Confirm signup**

Oggetto:

`Benvenuto/a — conferma il tuo account | Arianna Pelliccioni Dietista`

Il template `recovery.html` è destinato a:

**Authentication → Email Templates → Reset password**

Oggetto:

`Reimposta la tua password | Arianna Pelliccioni Dietista`

Il logo usa l'indirizzo pubblico HTTPS del sito, verificato come raggiungibile.
Il pulsante conserva `{{ .ConfirmationURL }}`, quindi la conferma continua a
essere gestita in sicurezza da Supabase Auth.

## Attivazione sul piano gratuito

Per i progetti gratuiti creati dopo il 3 giugno 2026, Supabase richiede un SMTP
personalizzato prima di consentire la modifica delle email. La soluzione scelta
è Resend:

1. creare un account gratuito su `https://resend.com`;
2. aggiungere e verificare il dominio `ariannapelliccionidietista.it`;
3. nel pannello DNS Aruba aggiungere esattamente i record mostrati da Resend:
   `resend._domainkey` (TXT), `send` (MX), `send` (TXT) e, consigliato,
   `_dmarc` (TXT). Usare sempre il pulsante **Copy** di Resend per copiare i
   valori completi, mai il testo abbreviato visibile a schermo;
4. tornare in Resend e premere **I've added the records**. La verifica richiede
   normalmente alcuni minuti, ma la propagazione DNS può richiedere più tempo;
5. in Resend aprire **Integrations → Supabase**, collegare il progetto e scegliere
   `noreply@ariannapelliccionidietista.it` come mittente;
6. in Supabase aprire **Authentication → Email Templates → Confirm signup**;
7. incollare l'oggetto e il contenuto dei due file presenti in questa cartella.

In alternativa all'integrazione automatica, in **Supabase → Authentication →
Email → SMTP Settings** usare:

- host: `smtp.resend.com`
- porta: `465`
- username: `resend`
- password: la chiave API Resend
- sender: `Arianna Pelliccioni Dietista <noreply@ariannapelliccionidietista.it>`

La chiave API non deve mai essere inserita nel frontend o condivisa in chat.

Il piano gratuito Resend comprende 3.000 email al mese, con un massimo di 100
email al giorno.
