/**
 * Autenticazione con Clerk (sostituisce Manus OAuth)
 * 
 * Clerk gestisce login/logout/sessioni automaticamente.
 * Il middleware verifyClerkSession verifica il token JWT di Clerk
 * e restituisce l'utente dal database locale.
 */
import { createClerkClient } from "@clerk/clerk-sdk-node";
import type { Request } from "express";
import * as db from "../db";
import { ENV } from "./env";

export const clerkClient = createClerkClient({
  secretKey: ENV.clerkSecretKey,
});

/**
 * Verifica la sessione Clerk dalla richiesta Express.
 * Restituisce l'utente dal database locale, o null se non autenticato.
 */
export async function authenticateRequest(req: Request) {
  try {
    const authHeader = req.headers.authorization;
    const sessionToken = authHeader?.replace("Bearer ", "") ||
      extractSessionTokenFromCookie(req.headers.cookie);

    if (!sessionToken) return null;

    // Verifica il token con Clerk
    const requestState = await clerkClient.authenticateRequest(req as any, {
      secretKey: ENV.clerkSecretKey,
    });

    if (!requestState.isSignedIn) return null;

    const clerkUserId = requestState.toAuth().userId;
    if (!clerkUserId) return null;

    // Recupera o crea l'utente nel database locale
    let user = await db.getUserByOpenId(clerkUserId);

    if (!user) {
      // Prima volta: recupera info da Clerk e crea utente nel DB
      const clerkUser = await clerkClient.users.getUser(clerkUserId);
      const email = clerkUser.emailAddresses[0]?.emailAddress ?? null;
      const name = [clerkUser.firstName, clerkUser.lastName]
        .filter(Boolean)
        .join(" ") || clerkUser.username || email?.split("@")[0] || "Utente";

      await db.upsertUser({
        openId: clerkUserId,
        name,
        email,
        loginMethod: clerkUser.externalAccounts[0]?.provider ?? "email",
        lastSignedIn: new Date(),
      });

      user = await db.getUserByOpenId(clerkUserId);
    } else {
      // Aggiorna lastSignedIn
      await db.upsertUser({
        openId: clerkUserId,
        lastSignedIn: new Date(),
      });
    }

    return user;
  } catch (error) {
    return null;
  }
}

function extractSessionTokenFromCookie(cookieHeader?: string): string | null {
  if (!cookieHeader) return null;
  const match = cookieHeader.match(/__session=([^;]+)/);
  return match ? match[1] : null;
}
