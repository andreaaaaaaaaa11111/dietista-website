# Arianna Pelliccioni — Dietista

Versione aggiornata del sito: React, Vite, Express/tRPC, Supabase Auth e Resend.
La build e le risorse non dipendono dal runtime della piattaforma originale.

## Sviluppo

Usare la versione di pnpm indicata in `package.json`.

```sh
pnpm install --frozen-lockfile
cp .env.example .env
pnpm dev
```

Compilare `.env` soltanto sul proprio computer. Non caricare password, chiavi
segrete, esportazioni del database o cartelle `.vercel` nel repository.

## Verifiche

```sh
pnpm check
pnpm exec vitest run server/betterOffers.test.ts
pnpm build:vercel
```

La build genera il frontend in `dist/public` e la funzione in `api/index.js`.
Le configurazioni di pubblicazione sono in `vercel.json`.
Il collegamento Git deve essere effettuato al progetto Vercel esistente
`arianna-pelliccioni-dietista`, senza creare un altro progetto o cambiare dominio.

## Nutrizione sportiva

La pagina pubblica è `/nutrizione-sportiva`, collegata nel menu e nel footer.
Contiene le offerte Better precedentemente presenti nella pagina servizi,
con prezzi, descrizioni e condizioni di validità conservati.
Questo percorso può essere usato come destinazione diretta di un QR code.

## Servizi esterni

- Supabase: accesso utenti e dati; vedere `SUPABASE_SETUP.md` e `DATABASE_SETUP.md`.
- Resend: email; la chiave segreta rimane nell'ambiente server.
- Eventuali servizi locali/opzionali sono descritti in `.env.example`.

L'aggiornamento del codice non esegue automaticamente migrazioni del database,
non modifica gli account e non cambia le impostazioni del dominio.
