import { TRPCError } from "@trpc/server";
import { ENV } from "./env";
import { sendEmail } from "./sendEmail";

export type NotificationPayload = { title: string; content: string };

export async function notifyOwner(payload: NotificationPayload): Promise<boolean> {
  const title = payload.title?.trim();
  const content = payload.content?.trim();
  if (!title || !content) {
    throw new TRPCError({ code: "BAD_REQUEST", message: "Titolo e contenuto sono richiesti" });
  }
  if (title.length > 1200 || content.length > 20000) {
    throw new TRPCError({ code: "BAD_REQUEST", message: "Notifica troppo lunga" });
  }
  return sendEmail({ to: ENV.ownerEmail, subject: title, content });
}
