import { ForbiddenError } from "@shared/_core/errors";
import { createClient } from "@supabase/supabase-js";
import type { Request } from "express";
import type { User } from "../../drizzle/schema";
import * as db from "../db";
import { ENV } from "./env";

function bearerToken(req: Request): string | null {
  const authorization = req.get("authorization");
  if (!authorization?.startsWith("Bearer ")) return null;
  return authorization.slice(7).trim() || null;
}

class AuthService {
  async authenticateRequest(req: Request): Promise<User> {
    const token = bearerToken(req);
    if (!token || !ENV.supabaseUrl || !ENV.supabasePublishableKey) {
      throw ForbiddenError("Invalid session");
    }

    const supabase = createClient(ENV.supabaseUrl, ENV.supabasePublishableKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data.user) throw ForbiddenError("Invalid session");

    const authUser = data.user;
    const email = authUser.email ?? null;
    const role: "user" | "admin" =
      authUser.app_metadata?.role === "admin" ||
      (email ? ENV.adminEmails.includes(email.toLowerCase()) : false)
        ? "admin"
        : "user";
    const name =
      role === "admin" && email?.toLowerCase() === "andreapelliccioni12@gmail.com"
        ? "Arianna Pelliccioni"
        : (typeof authUser.user_metadata?.name === "string" && authUser.user_metadata.name.trim()) ||
          email?.split("@")[0] ||
          "Utente";
    const now = new Date();

    if (ENV.databaseUrl) {
      await db.upsertUser({
        openId: authUser.id,
        name,
        email,
        loginMethod: "supabase",
        role,
        lastSignedIn: now,
      });
      const storedUser = await db.getUserByOpenId(authUser.id);
      if (storedUser) return storedUser;
    }

    // Consente l'accesso all'interfaccia anche prima di collegare il database applicativo.
    // Il ruolo admin non viene mai assegnato senza una configurazione esplicita.
    return {
      id: 0,
      openId: authUser.id,
      name,
      email,
      loginMethod: "supabase",
      role,
      createdAt: now,
      updatedAt: now,
      lastSignedIn: now,
    };
  }
}

export const sdk = new AuthService();
