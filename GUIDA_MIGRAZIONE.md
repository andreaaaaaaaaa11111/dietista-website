# Guida Completa: Migrazione e Deploy su Stack Gratuito

**Studio Dietista Arianna Pelliccioni** — Guida tecnica per la migrazione da Manus hosting a stack gratuito.

---

## Panoramica dello Stack

Il sito è stato migrato da Manus (piattaforma proprietaria) a uno stack completamente gratuito e portabile:

| Componente | Servizio | Piano gratuito |
| --- | --- | --- |
| **Frontend** | [Vercel](https://vercel.com) | 100 GB banda/mese, deploy illimitati |
| **Backend API** | [Railway](https://railway.app) | 5 USD di crediti/mese (sufficiente per traffico basso) |
| **Database** | [TiDB Serverless](https://tidbcloud.com) | 5 GB storage, 50M righe/mese |
| **Autenticazione** | [Clerk](https://clerk.com) | 10.000 utenti attivi/mese |
| **Storage immagini** | [Cloudinary](https://cloudinary.com) | 25 GB storage, 25 GB banda/mese |
| **Email** | [SendGrid](https://sendgrid.com) | 100 email/giorno |

---

## Fase 1: Configurare PlanetScale (Database)

### 1.1 Creare il database

1. Registrarsi su [app.planetscale.com](https://app.planetscale.com)

1. Creare una nuova organizzazione e un database chiamato `dietista-website`

1. Selezionare la regione più vicina all'Italia (es. `eu-west-1` o `eu-central-1`)

1. Attendere che il database sia pronto (circa 1 minuto)

### 1.2 Ottenere la connection string

1. Aprire il database → **Connect**

1. Selezionare **Node.js** come framework

1. Copiare la connection string nel formato:

   ```
   mysql://username:password@host/database?ssl={"rejectUnauthorized":true}
   ```

1. Salvare questa stringa come `DATABASE_URL`

### 1.3 Eseguire le migrazioni

Una volta configurato il backend su Railway (Fase 4), eseguire:

```bash
# Dalla directory del progetto
pnpm run db:push
```

Questo comando crea tutte le tabelle nel database PlanetScale.

---

## Fase 2: Configurare Clerk (Autenticazione)

### 2.1 Creare l'applicazione Clerk

1. Registrarsi su [dashboard.clerk.com](https://dashboard.clerk.com)

1. Creare una nuova applicazione chiamata "Studio Dietista"

1. Selezionare i metodi di login desiderati:
  - **Email** (consigliato, gratuito)
  - **Google** (opzionale, richiede configurazione OAuth)
  - **Apple** (opzionale, richiede account Apple Developer)

### 2.2 Ottenere le chiavi API

1. Aprire **API Keys** nella sidebar di Clerk

1. Copiare:
  - `VITE_CLERK_PUBLISHABLE_KEY` (inizia con `pk_live_` o `pk_test_`)
  - `CLERK_SECRET_KEY` (inizia con `sk_live_` o `sk_test_`)

### 2.3 Configurare il webhook

Il webhook sincronizza gli utenti Clerk nel database locale quando si registrano o modificano il profilo.

1. Aprire **Webhooks** nella sidebar di Clerk

1. Cliccare **Add Endpoint**

1. Inserire l'URL: `https://RAILWAY_BACKEND_URL/api/clerk/webhook`(sostituire con l'URL reale di Railway dopo il deploy )

1. Selezionare gli eventi:
  - `user.created`
  - `user.updated`
  - `user.deleted`

1. Copiare il **Signing Secret** (`whsec_...`) come `CLERK_WEBHOOK_SECRET`

### 2.4 Configurare l'utente admin

Dopo il primo login con l'email `pelliccioniarianna.dietista@gmail.com`, il sistema assegna automaticamente il ruolo `admin` grazie alla variabile `OWNER_EMAIL`. Non è necessaria nessuna configurazione manuale.

---

## Fase 3: Configurare Cloudinary (Storage)

### 3.1 Creare l'account

1. Registrarsi su [cloudinary.com](https://cloudinary.com)

1. Completare la configurazione dell'account

### 3.2 Ottenere le credenziali

1. Aprire la **Dashboard** di Cloudinary

1. Copiare:
  - `CLOUDINARY_CLOUD_NAME` (es. `my-cloud-name`)
  - `CLOUDINARY_API_KEY` (numero di 15 cifre)
  - `CLOUDINARY_API_SECRET` (stringa alfanumerica)

---

## Fase 4: Deploy del Backend su Railway

### 4.1 Creare il progetto Railway

1. Registrarsi su [railway.app](https://railway.app) con GitHub

1. Cliccare **New Project** → **Deploy from GitHub repo**

1. Selezionare il repository del progetto

### 4.2 Configurare le variabili d'ambiente

Nella sezione **Variables** del servizio Railway, aggiungere:

```
DATABASE_URL=mysql://...
CLERK_SECRET_KEY=sk_live_...
CLERK_WEBHOOK_SECRET=whsec_...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
OWNER_EMAIL=pelliccioniarianna.dietista@gmail.com
JWT_SECRET=<generare con: openssl rand -base64 32>
NODE_ENV=production
```

Variabili opzionali:

```
SENDGRID_API_KEY=SG....
OPENAI_API_KEY=sk-...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### 4.3 Configurare il build

Railway usa automaticamente il file `railway.toml` presente nel progetto. Il comando di build è:

```bash
pnpm install && pnpm run build:backend
```

Il comando di avvio è:

```bash
pnpm run start
```

### 4.4 Ottenere l'URL del backend

Dopo il deploy, Railway assegna un URL del tipo `https://dietista-website-production.up.railway.app`. Salvare questo URL per la configurazione di Vercel e del webhook Clerk.

---

## Fase 5: Deploy del Frontend su Vercel

### 5.1 Creare il progetto Vercel

1. Registrarsi su [vercel.com](https://vercel.com) con GitHub

1. Cliccare **New Project** → importare il repository

1. Configurare:
  - **Framework Preset**: Other
  - **Build Command**: `pnpm run build:frontend`
  - **Output Directory**: `dist/public`
  - **Install Command**: `pnpm install`

### 5.2 Configurare le variabili d'ambiente

Nella sezione **Environment Variables** di Vercel, aggiungere:

```
VITE_CLERK_PUBLISHABLE_KEY=pk_live_...
```

### 5.3 Configurare il proxy API

Il file `vercel.json` nel progetto configura il proxy per le chiamate API verso Railway. **Importante**: aggiornare l'URL Railway nel file `vercel.json`:

```json
{
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://RAILWAY_BACKEND_URL/api/:path*"
    }
  ]
}
```

Sostituire `RAILWAY_BACKEND_URL` con l'URL reale del backend Railway.

### 5.4 Configurare il dominio personalizzato

1. In Vercel → **Settings** → **Domains**

1. Aggiungere `ariannapelliccionidietista.it`

1. Seguire le istruzioni per aggiornare i record DNS:
  - Aggiungere record `A` che punta a `76.76.21.21`
  - Aggiungere record `CNAME` per `www` che punta a `cname.vercel-dns.com`

---

## Fase 6: Migrare i Dati dal Database Manus

### 6.1 Esportare i dati da Manus

Accedere al database Manus tramite il pannello di controllo e eseguire le seguenti query per esportare i dati in formato CSV o SQL:

```sql
-- Esportare utenti
SELECT * FROM users;

-- Esportare richieste di consulenza
SELECT * FROM consultation_requests;

-- Esportare articoli blog
SELECT * FROM blog_posts;

-- Esportare testimonianze
SELECT * FROM testimonials;

-- Esportare servizi
SELECT * FROM services;
```

### 6.2 Importare i dati in PlanetScale

Dopo aver eseguito le migrazioni (`pnpm run db:push` ), importare i dati:

```sql
-- Importare utenti (adattare i valori)
INSERT INTO users (open_id, name, email, role, login_method, last_signed_in)
VALUES ('clerk_user_id', 'Nome Utente', 'email@example.com', 'user', 'email', NOW());

-- L'admin viene creato automaticamente al primo login con OWNER_EMAIL
```

**Nota importante**: Gli `openId` degli utenti cambieranno da ID Manus a ID Clerk. Gli utenti dovranno registrarsi nuovamente su Clerk, ma le loro consulenze possono essere collegate tramite email.

### 6.3 Ricaricare le immagini su Cloudinary

Le immagini attualmente su Manus CDN (`files.manuscdn.com`) devono essere migrate su Cloudinary. Le immagini principali sono:

- **Foto professionale** (About page): `https://files.manuscdn.com/user_upload_by_module/session_file/310519663236549894/ZvkScbyffEuXkoBy.JPG`

- **Logo completo**: `/logo-completo.png` (file locale nel progetto )

- **Logo icona**: `/logo-icon.png` (file locale nel progetto)

Per le immagini nel database (es. PDF diete), scaricarle e ricaricarle tramite il pannello admin dopo il deploy.

---

## Fase 7: Aggiornare il DNS

### 7.1 Trasferire il dominio

Il dominio `ariannapelliccionidietista.it` è attualmente configurato per puntare a Manus. Per trasferirlo a Vercel:

1. Accedere al pannello del registrar del dominio (es. Aruba, Register.it)

1. Modificare i nameserver o i record DNS:

| Tipo | Nome | Valore |
| --- | --- | --- |
| `A` | `@` | `76.76.21.21` |
| `CNAME` | `www` | `cname.vercel-dns.com` |

1. Attendere la propagazione DNS (da 1 a 48 ore)

### 7.2 Verificare il certificato SSL

Vercel genera automaticamente il certificato SSL (HTTPS) tramite Let's Encrypt. Non è necessaria nessuna configurazione aggiuntiva.

---

## Checklist Finale

Prima di rendere il sito pubblico su Vercel, verificare:

- [ ] Database PlanetScale creato e migrazioni eseguite (`pnpm run db:push`)

- [ ] Clerk configurato con webhook attivo

- [ ] Cloudinary configurato con le immagini caricate

- [ ] Backend Railway in esecuzione e raggiungibile

- [ ] Variabili d'ambiente configurate su Railway e Vercel

- [ ] URL Railway aggiornato in `vercel.json`

- [ ] Frontend Vercel in esecuzione

- [ ] Login con email admin funzionante

- [ ] Ruolo admin assegnato automaticamente

- [ ] DNS aggiornato (se si usa dominio personalizzato)

- [ ] Dati migrati dal database Manus

---

## Risoluzione Problemi Comuni

### Il login non funziona

Verificare che `VITE_CLERK_PUBLISHABLE_KEY` sia configurato su Vercel e che `CLERK_SECRET_KEY` sia configurato su Railway. Controllare che il webhook Clerk punti all'URL corretto del backend Railway.

### Le immagini non si caricano

Verificare che `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY` e `CLOUDINARY_API_SECRET` siano configurati su Railway. Testare l'upload di un'immagine dal pannello admin.

### Il database non si connette

Verificare che `DATABASE_URL` sia nel formato corretto per PlanetScale con SSL abilitato. PlanetScale richiede `?ssl={"rejectUnauthorized":true}` nella connection string.

### L'utente admin non ha i permessi

Verificare che `OWNER_EMAIL` su Railway corrisponda all'email usata per il login su Clerk. Al primo login, il sistema assegna automaticamente il ruolo admin.

---

## Costi Stimati

Con il traffico atteso per un sito di una dietista professionista (< 1.000 visitatori/mese), tutti i servizi rientrano nei piani gratuiti:

| Servizio | Piano | Costo |
| --- | --- | --- |
| Vercel | Hobby | Gratuito |
| Railway | Starter | ~1-2 USD/mese (crediti gratuiti) |
| TiDB Serverless | Starter | Gratuito |
| Clerk | Free | Gratuito |
| Cloudinary | Free | Gratuito |
| SendGrid | Free | Gratuito |
| **Totale** |  | **~0-2 USD/mese** |

---

*Guida generata automaticamente durante la migrazione del sito Studio Dietista Arianna Pelliccioni.*

