/**
 * Route di autenticazione con Clerk (sostituisce Manus OAuth)
 *
 * Clerk gestisce il login/logout tramite il frontend SDK.
 * Questo file registra il webhook di Clerk per sincronizzare
 * gli utenti nel database locale quando si registrano/cancellano.
 */
import type { Express, Request, Response } from "express";
import * as db from "../db";
import { ENV } from "./env";
import { Webhook } from "svix";

export function registerOAuthRoutes(app: Express) {
  /**
   * Webhook Clerk: sincronizza utenti nel database locale
   * Configurare in Clerk Dashboard → Webhooks → endpoint: /api/clerk/webhook
   * Events: user.created, user.updated, user.deleted
   */
  app.post("/api/clerk/webhook", async (req: Request, res: Response) => {
    const svixId = req.headers["svix-id"] as string;
    const svixTimestamp = req.headers["svix-timestamp"] as string;
    const svixSignature = req.headers["svix-signature"] as string;

    if (!svixId || !svixTimestamp || !svixSignature) {
      return res.status(400).json({ error: "Missing svix headers" });
    }

    const webhookSecret = ENV.clerkWebhookSecret;
    if (!webhookSecret) {
      console.warn("[Clerk Webhook] CLERK_WEBHOOK_SECRET not set, skipping verification");
      return res.json({ received: true });
    }

    let event: any;
    try {
      const wh = new Webhook(webhookSecret);
      const body = JSON.stringify(req.body);
      event = wh.verify(body, {
        "svix-id": svixId,
        "svix-timestamp": svixTimestamp,
        "svix-signature": svixSignature,
      });
    } catch (err) {
      console.error("[Clerk Webhook] Verification failed:", err);
      return res.status(400).json({ error: "Webhook verification failed" });
    }

    const { type, data } = event;
    console.log(`[Clerk Webhook] Event: ${type}`);

    try {
      if (type === "user.created" || type === "user.updated") {
        const email = data.email_addresses?.[0]?.email_address ?? null;
        const name = [data.first_name, data.last_name]
          .filter(Boolean)
          .join(" ") || data.username || email?.split("@")[0] || "Utente";

        await db.upsertUser({
          openId: data.id,
          name,
          email,
          loginMethod: data.external_accounts?.[0]?.provider ?? "email",
          lastSignedIn: new Date(),
        });
      } else if (type === "user.deleted") {
        console.log(`[Clerk Webhook] User deleted: ${data.id}`);
      }
    } catch (err) {
      console.error("[Clerk Webhook] DB sync failed:", err);
    }

    return res.json({ received: true });
  });

  /**
   * Logout: Clerk gestisce il logout lato frontend.
   * Questa route è mantenuta per compatibilità con il codice esistente.
   */
  app.post("/api/auth/logout", (_req: Request, res: Response) => {
    res.json({ success: true });
  });
}
