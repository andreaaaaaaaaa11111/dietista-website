/**
 * Invio email con SendGrid (sostituisce Manus Forge Email)
 * 
 * Usa SendGrid per inviare email transazionali.
 * Free tier: 100 email/giorno, sufficiente per un sito di una dietista.
 */
import { TRPCError } from "@trpc/server";
import { ENV } from "./env";

export type EmailPayload = {
  to: string;
  subject: string;
  content: string;
  from?: string;
  fromName?: string;
};

/**
 * Invia un'email a un indirizzo specifico usando SendGrid.
 * Restituisce true se l'email è stata inviata con successo.
 */
export async function sendEmail(payload: EmailPayload): Promise<boolean> {
  const { to, subject, content, from, fromName } = payload;

  if (!to || !to.includes("@")) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Email destinatario non valida",
    });
  }

  if (!subject || subject.trim().length === 0) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Oggetto email richiesto",
    });
  }

  if (!content || content.trim().length === 0) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Contenuto email richiesto",
    });
  }

  const sendgridApiKey = ENV.sendgridApiKey;

  // Se SendGrid non è configurato, logga solo l'email
  if (!sendgridApiKey) {
    console.log(`[Email] (SendGrid non configurato) A: ${to} | Oggetto: ${subject}`);
    return false;
  }

  const fromEmail = from || ENV.ownerEmail;
  const fromDisplayName = fromName || "Studio Dietista";

  try {
    const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sendgridApiKey}`,
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: to }] }],
        from: { email: fromEmail, name: fromDisplayName },
        subject,
        content: [{ type: "text/html", value: content }],
      }),
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      console.warn(
        `[Email] SendGrid error (${response.status})${detail ? `: ${detail}` : ""}`
      );
      return false;
    }

    return true;
  } catch (error) {
    console.warn("[Email] SendGrid request failed:", error);
    return false;
  }
}
