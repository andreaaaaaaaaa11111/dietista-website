/**
 * Notifiche al proprietario del sito via email (SendGrid)
 * Sostituisce il servizio Manus Forge Notification
 * 
 * Usa SendGrid per inviare notifiche email alla Dottoressa Pelliccioni.
 * Se SENDGRID_API_KEY non è configurato, le notifiche vengono solo loggate.
 */
import { TRPCError } from "@trpc/server";
import { ENV } from "./env";

export type NotificationPayload = {
  title: string;
  content: string;
};

const TITLE_MAX_LENGTH = 1200;
const CONTENT_MAX_LENGTH = 20000;

const trimValue = (value: string): string => value.trim();
const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

const validatePayload = (input: NotificationPayload): NotificationPayload => {
  if (!isNonEmptyString(input.title)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Notification title is required.",
    });
  }
  if (!isNonEmptyString(input.content)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Notification content is required.",
    });
  }

  const title = trimValue(input.title);
  const content = trimValue(input.content);

  if (title.length > TITLE_MAX_LENGTH) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Notification title must be at most ${TITLE_MAX_LENGTH} characters.`,
    });
  }

  if (content.length > CONTENT_MAX_LENGTH) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Notification content must be at most ${CONTENT_MAX_LENGTH} characters.`,
    });
  }

  return { title, content };
};

/**
 * Invia una notifica al proprietario del sito via email (SendGrid).
 * Restituisce true se l'email è stata inviata, false altrimenti.
 */
export async function notifyOwner(
  payload: NotificationPayload
): Promise<boolean> {
  const { title, content } = validatePayload(payload);

  const ownerEmail = ENV.ownerEmail;
  const sendgridApiKey = ENV.sendgridApiKey;

  // Se SendGrid non è configurato, logga solo la notifica
  if (!sendgridApiKey) {
    console.log(`[Notification] (SendGrid non configurato) ${title}: ${content}`);
    return false;
  }

  try {
    const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sendgridApiKey}`,
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: ownerEmail }] }],
        from: { email: ownerEmail, name: "Studio Dietista" },
        subject: `[Studio Dietista] ${title}`,
        content: [{ type: "text/plain", value: content }],
      }),
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      console.warn(
        `[Notification] SendGrid error (${response.status})${detail ? `: ${detail}` : ""}`
      );
      return false;
    }

    return true;
  } catch (error) {
    console.warn("[Notification] SendGrid request failed:", error);
    return false;
  }
}
