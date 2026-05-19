import { drizzle } from "drizzle-orm/mysql2";
import { emailTemplates } from "./drizzle/schema.ts";

const db = drizzle(process.env.DATABASE_URL);

const defaultTemplate = {
  name: "consultation_confirmation",
  subject: "Conferma Richiesta Consulenza - Studio Dietista",
  body: `Gentile {{name}},

Grazie per aver compilato il questionario per la consulenza nutrizionale!

Ho ricevuto la tua richiesta e ti contatterò a breve per fissare un appuntamento.

**I miei contatti:**
- Email: dietista@example.com
- Telefono: +39 123 456 7890
- Orari: Lun-Ven 9:00-18:00

Puoi contattarmi direttamente a questi recapiti per qualsiasi domanda o per concordare la data della consulenza.

A presto,
Dott.ssa Nome Cognome
Dietista Nutrizionista

---
Questo messaggio è stato inviato a: {{email}}
Telefono fornito: {{phone}}`
};

await db.insert(emailTemplates)
  .values(defaultTemplate)
  .onDuplicateKeyUpdate({ set: { subject: defaultTemplate.subject, body: defaultTemplate.body } });

console.log("Template email creato con successo!");
process.exit(0);
