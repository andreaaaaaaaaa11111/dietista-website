import { TRPCError } from "@trpc/server";
import { ENV } from "./env";

export type EmailPayload = {
  to: string;
  subject: string;
  content: string;
  html?: string;
};

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function brandedEmail(content: string): string {
  const safeContent = escapeHtml(content).replaceAll("\n", "<br />");

  return `<!doctype html>
<html lang="it">
  <body style="margin:0;padding:0;background:#f3f6f3;font-family:Arial,Helvetica,sans-serif;color:#172019;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#f3f6f3;">
      <tr>
        <td align="center" style="padding:32px 16px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:600px;background:#ffffff;border:1px solid #dde7df;border-radius:20px;overflow:hidden;">
            <tr>
              <td align="center" style="padding:30px 32px 22px;background:#f9fbf8;border-bottom:1px solid #e4ece5;">
                <img src="https://ariannapelliccionidietista.it/logo-completo.png" width="245" alt="Arianna Pelliccioni Dietista" style="display:block;width:100%;max-width:245px;height:auto;border:0;" />
              </td>
            </tr>
            <tr>
              <td style="padding:36px 38px;font-size:16px;line-height:1.7;color:#536158;">
                ${safeContent}
              </td>
            </tr>
            <tr>
              <td style="padding:20px 38px 30px;border-top:1px solid #edf2ee;color:#78847c;font-size:12px;line-height:1.6;">
                Dott.ssa Arianna Pelliccioni · Dietista<br />
                <a href="https://ariannapelliccionidietista.it" style="color:#198754;text-decoration:none;">ariannapelliccionidietista.it</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export async function sendEmail({ to, subject, content, html }: EmailPayload): Promise<boolean> {
  if (!to?.includes("@")) {
    throw new TRPCError({ code: "BAD_REQUEST", message: "Email destinatario non valida" });
  }
  if (!subject?.trim() || !content?.trim()) {
    throw new TRPCError({ code: "BAD_REQUEST", message: "Oggetto e contenuto sono richiesti" });
  }
  if (!ENV.resendApiKey || !ENV.emailFrom) {
    console.warn("[Email] RESEND_API_KEY o EMAIL_FROM non configurati");
    return false;
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${ENV.resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: ENV.emailFrom,
        to: [to],
        subject,
        text: content,
        html: html ?? brandedEmail(content),
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.warn(`[Email] Resend ha risposto ${response.status}: ${errorBody.slice(0, 300)}`);
      return false;
    }

    return true;
  } catch (error) {
    console.warn("[Email] Invio tramite Resend non riuscito:", error);
    return false;
  }
}
