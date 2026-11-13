var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/_core/env.ts
var ENV;
var init_env = __esm({
  "server/_core/env.ts"() {
    "use strict";
    ENV = {
      appId: process.env.APP_ID ?? "dietista-website",
      databaseUrl: process.env.DATABASE_URL ?? "",
      ownerOpenId: process.env.OWNER_USER_ID ?? "",
      ownerEmail: process.env.OWNER_EMAIL ?? "pelliccioniarianna.dietista@gmail.com",
      supabaseUrl: process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "https://zrdmcgixgagjippeebhs.supabase.co",
      supabasePublishableKey: process.env.SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY || "sb_publishable_BogAD2zmTGJfrBvEBxBVSg_NT02P-HG",
      adminEmails: (process.env.ADMIN_EMAILS ?? process.env.OWNER_EMAIL ?? "").split(",").map((email) => email.trim().toLowerCase()).filter(Boolean),
      isProduction: process.env.NODE_ENV === "production",
      localAiUrl: process.env.LOCAL_AI_URL ?? "http://127.0.0.1:11434",
      localAiModel: process.env.LOCAL_AI_MODEL ?? "llama3.2",
      resendApiKey: process.env.RESEND_API_KEY ?? "",
      emailFrom: process.env.EMAIL_FROM ?? "",
      s3Bucket: process.env.S3_BUCKET ?? "",
      s3Region: process.env.S3_REGION ?? "eu-central-1",
      s3Endpoint: process.env.S3_ENDPOINT ?? "",
      s3PublicUrl: process.env.S3_PUBLIC_URL ?? ""
    };
  }
});

// server/_core/llm.ts
var llm_exports = {};
__export(llm_exports, {
  invokeLLM: () => invokeLLM
});
async function invokeLLM(params) {
  assertLocalEndpoint();
  const {
    messages,
    tools,
    toolChoice,
    tool_choice,
    outputSchema,
    output_schema,
    responseFormat,
    response_format
  } = params;
  const payload = {
    model: ENV.localAiModel,
    messages: messages.map(normalizeMessage)
  };
  if (tools && tools.length > 0) {
    payload.tools = tools;
  }
  const normalizedToolChoice = normalizeToolChoice(
    toolChoice || tool_choice,
    tools
  );
  if (normalizedToolChoice) {
    payload.tool_choice = normalizedToolChoice;
  }
  payload.max_tokens = params.maxTokens ?? params.max_tokens ?? 32768;
  const normalizedResponseFormat = normalizeResponseFormat({
    responseFormat,
    response_format,
    outputSchema,
    output_schema
  });
  if (normalizedResponseFormat) {
    payload.response_format = normalizedResponseFormat;
  }
  const response = await fetch(resolveApiUrl(), {
    method: "POST",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify(payload)
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `LLM invoke failed: ${response.status} ${response.statusText} \u2013 ${errorText}`
    );
  }
  return await response.json();
}
var ensureArray, normalizeContentPart, normalizeMessage, normalizeToolChoice, resolveApiUrl, assertLocalEndpoint, normalizeResponseFormat;
var init_llm = __esm({
  "server/_core/llm.ts"() {
    "use strict";
    init_env();
    ensureArray = (value) => Array.isArray(value) ? value : [value];
    normalizeContentPart = (part) => {
      if (typeof part === "string") {
        return { type: "text", text: part };
      }
      if (part.type === "text") {
        return part;
      }
      if (part.type === "image_url") {
        return part;
      }
      if (part.type === "file_url") {
        return part;
      }
      throw new Error("Unsupported message content part");
    };
    normalizeMessage = (message) => {
      const { role, name, tool_call_id } = message;
      if (role === "tool" || role === "function") {
        const content = ensureArray(message.content).map((part) => typeof part === "string" ? part : JSON.stringify(part)).join("\n");
        return {
          role,
          name,
          tool_call_id,
          content
        };
      }
      const contentParts = ensureArray(message.content).map(normalizeContentPart);
      if (contentParts.length === 1 && contentParts[0].type === "text") {
        return {
          role,
          name,
          content: contentParts[0].text
        };
      }
      return {
        role,
        name,
        content: contentParts
      };
    };
    normalizeToolChoice = (toolChoice, tools) => {
      if (!toolChoice) return void 0;
      if (toolChoice === "none" || toolChoice === "auto") {
        return toolChoice;
      }
      if (toolChoice === "required") {
        if (!tools || tools.length === 0) {
          throw new Error(
            "tool_choice 'required' was provided but no tools were configured"
          );
        }
        if (tools.length > 1) {
          throw new Error(
            "tool_choice 'required' needs a single tool or specify the tool name explicitly"
          );
        }
        return {
          type: "function",
          function: { name: tools[0].function.name }
        };
      }
      if ("name" in toolChoice) {
        return {
          type: "function",
          function: { name: toolChoice.name }
        };
      }
      return toolChoice;
    };
    resolveApiUrl = () => `${ENV.localAiUrl.replace(/\/$/, "")}/v1/chat/completions`;
    assertLocalEndpoint = () => {
      const hostname = new URL(ENV.localAiUrl).hostname;
      if (!["127.0.0.1", "localhost", "::1"].includes(hostname)) {
        throw new Error("LOCAL_AI_URL must point to a local Ollama instance");
      }
    };
    normalizeResponseFormat = ({
      responseFormat,
      response_format,
      outputSchema,
      output_schema
    }) => {
      const explicitFormat = responseFormat || response_format;
      if (explicitFormat) {
        if (explicitFormat.type === "json_schema" && !explicitFormat.json_schema?.schema) {
          throw new Error(
            "responseFormat json_schema requires a defined schema object"
          );
        }
        return explicitFormat;
      }
      const schema = outputSchema || output_schema;
      if (!schema) return void 0;
      if (!schema.name || !schema.schema) {
        throw new Error("outputSchema requires both name and schema");
      }
      return {
        type: "json_schema",
        json_schema: {
          name: schema.name,
          schema: schema.schema,
          ...typeof schema.strict === "boolean" ? { strict: schema.strict } : {}
        }
      };
    };
  }
});

// server/storage.ts
var storage_exports = {};
__export(storage_exports, {
  storageGet: () => storageGet,
  storagePut: () => storagePut
});
import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
function normalizeKey(relKey) {
  const normalized = relKey.replace(/^\/+/, "").replace(/\\/g, "/");
  if (!normalized || normalized.split("/").includes("..")) {
    throw new Error("Invalid storage key");
  }
  return normalized;
}
function getStorage() {
  if (!ENV.s3Bucket) throw new Error("S3_BUCKET is not configured");
  return {
    bucket: ENV.s3Bucket,
    client: new S3Client({
      region: ENV.s3Region,
      ...ENV.s3Endpoint ? { endpoint: ENV.s3Endpoint, forcePathStyle: true } : {}
    })
  };
}
async function storagePut(relKey, data, contentType = "application/octet-stream") {
  const key = normalizeKey(relKey);
  const { bucket, client: client2 } = getStorage();
  await client2.send(new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: data,
    ContentType: contentType
  }));
  const publicBase = ENV.s3PublicUrl.replace(/\/$/, "");
  return {
    key,
    url: publicBase ? `${publicBase}/${key}` : (await storageGet(key)).url
  };
}
async function storageGet(relKey) {
  const key = normalizeKey(relKey);
  const publicBase = ENV.s3PublicUrl.replace(/\/$/, "");
  if (publicBase) return { key, url: `${publicBase}/${key}` };
  const { bucket, client: client2 } = getStorage();
  const url = await getSignedUrl(
    client2,
    new GetObjectCommand({ Bucket: bucket, Key: key }),
    { expiresIn: 3600 }
  );
  return { key, url };
}
var init_storage = __esm({
  "server/storage.ts"() {
    "use strict";
    init_env();
  }
});

// server/_core/app.ts
import express from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";

// server/_core/cookies.ts
function isSecureRequest(req) {
  if (req.protocol === "https") return true;
  const forwardedProto = req.headers["x-forwarded-proto"];
  if (!forwardedProto) return false;
  const protoList = Array.isArray(forwardedProto) ? forwardedProto : forwardedProto.split(",");
  return protoList.some((proto) => proto.trim().toLowerCase() === "https");
}
function getSessionCookieOptions(req) {
  return {
    httpOnly: true,
    path: "/",
    sameSite: "none",
    secure: isSecureRequest(req)
  };
}

// shared/const.ts
var COOKIE_NAME = "app_session_id";
var ONE_YEAR_MS = 1e3 * 60 * 60 * 24 * 365;
var UNAUTHED_ERR_MSG = "Please login (10001)";
var NOT_ADMIN_ERR_MSG = "You do not have required permission (10002)";

// server/_core/systemRouter.ts
import { z } from "zod";

// server/_core/notification.ts
init_env();
import { TRPCError as TRPCError2 } from "@trpc/server";

// server/_core/sendEmail.ts
init_env();
import { TRPCError } from "@trpc/server";
function escapeHtml(value) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}
function brandedEmail(content) {
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
                Dott.ssa Arianna Pelliccioni \xB7 Dietista<br />
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
async function sendEmail({ to, subject, content, html }) {
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
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: ENV.emailFrom,
        to: [to],
        subject,
        text: content,
        html: html ?? brandedEmail(content)
      })
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

// server/_core/notification.ts
async function notifyOwner(payload) {
  const title = payload.title?.trim();
  const content = payload.content?.trim();
  if (!title || !content) {
    throw new TRPCError2({ code: "BAD_REQUEST", message: "Titolo e contenuto sono richiesti" });
  }
  if (title.length > 1200 || content.length > 2e4) {
    throw new TRPCError2({ code: "BAD_REQUEST", message: "Notifica troppo lunga" });
  }
  return sendEmail({ to: ENV.ownerEmail, subject: title, content });
}

// server/_core/trpc.ts
import { initTRPC, TRPCError as TRPCError3 } from "@trpc/server";
import superjson from "superjson";
var t = initTRPC.context().create({
  transformer: superjson
});
var router = t.router;
var publicProcedure = t.procedure;
var requireUser = t.middleware(async (opts) => {
  const { ctx, next } = opts;
  if (!ctx.user) {
    throw new TRPCError3({ code: "UNAUTHORIZED", message: UNAUTHED_ERR_MSG });
  }
  return next({
    ctx: {
      ...ctx,
      user: ctx.user
    }
  });
});
var protectedProcedure = t.procedure.use(requireUser);
var adminProcedure = t.procedure.use(
  t.middleware(async (opts) => {
    const { ctx, next } = opts;
    if (!ctx.user || ctx.user.role !== "admin") {
      throw new TRPCError3({ code: "FORBIDDEN", message: NOT_ADMIN_ERR_MSG });
    }
    return next({
      ctx: {
        ...ctx,
        user: ctx.user
      }
    });
  })
);

// server/_core/systemRouter.ts
var systemRouter = router({
  health: publicProcedure.input(
    z.object({
      timestamp: z.number().min(0, "timestamp cannot be negative")
    })
  ).query(() => ({
    ok: true
  })),
  notifyOwner: adminProcedure.input(
    z.object({
      title: z.string().min(1, "title is required"),
      content: z.string().min(1, "content is required")
    })
  ).mutation(async ({ input }) => {
    const delivered = await notifyOwner(input);
    return {
      success: delivered
    };
  })
});

// server/routers.ts
import { z as z2 } from "zod";
import { TRPCError as TRPCError4 } from "@trpc/server";
init_llm();

// server/db.ts
import { eq, desc, and, gte, lte, or } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";

// drizzle/schema.ts
import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean } from "drizzle-orm/mysql-core";
var users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull()
});
var services = mysqlTable("services", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  duration: int("duration").notNull(),
  // durata in minuti
  price: int("price").notNull(),
  // prezzo in centesimi (es. 5000 = 50.00€)
  active: boolean("active").default(true).notNull(),
  order: int("order").default(0).notNull(),
  // per ordinamento visualizzazione
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
});
var blogCategories = mysqlTable("blog_categories", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  description: text("description"),
  createdAt: timestamp("createdAt").defaultNow().notNull()
});
var blogPosts = mysqlTable("blog_posts", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  content: text("content").notNull(),
  excerpt: text("excerpt"),
  // breve descrizione per anteprima
  imageUrl: varchar("imageUrl", { length: 500 }),
  imageKey: varchar("imageKey", { length: 500 }),
  // chiave S3 per l'immagine
  categoryId: int("categoryId").references(() => blogCategories.id),
  published: boolean("published").default(false).notNull(),
  publishedAt: timestamp("publishedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
});
var blogComments = mysqlTable("blog_comments", {
  id: int("id").autoincrement().primaryKey(),
  postId: int("postId").notNull().references(() => blogPosts.id),
  userId: int("userId").notNull().references(() => users.id),
  parentId: int("parentId"),
  // ID del commento padre per le risposte (null = commento principale)
  content: text("content").notNull(),
  isAdminReply: boolean("isAdminReply").default(false).notNull(),
  // true se è una risposta della dietista
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
});
var testimonials = mysqlTable("testimonials", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"),
  // collegamento all'utente (opzionale per recensioni manuali)
  name: varchar("name", { length: 100 }).notNull(),
  email: varchar("email", { length: 320 }),
  // email per contatto
  content: text("content").notNull(),
  rating: int("rating").notNull(),
  // 1-5 stelle
  imageUrl: varchar("imageUrl", { length: 500 }),
  approved: boolean("approved").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull()
});
var contactRequests = mysqlTable("contact_requests", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  consultationType: varchar("consultationType", { length: 100 }),
  message: text("message").notNull(),
  status: mysqlEnum("status", ["new", "read", "replied"]).default("new").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull()
});
var consultationRequests = mysqlTable("consultation_requests", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").references(() => users.id),
  serviceId: int("serviceId").references(() => services.id),
  // Dati cliente
  name: varchar("name", { length: 100 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  // Questionario
  age: int("age"),
  weight: int("weight"),
  // in kg
  height: int("height"),
  // in cm
  goal: text("goal"),
  // obiettivo nutrizionale
  medicalConditions: text("medicalConditions"),
  // condizioni mediche
  allergies: text("allergies"),
  // allergie/intolleranze
  currentDiet: text("currentDiet"),
  // alimentazione attuale
  message: text("message"),
  // messaggio aggiuntivo
  privacyConsent: boolean("privacyConsent").default(false).notNull(),
  // consenso trattamento dati
  privacyConsentDate: timestamp("privacyConsentDate"),
  // data consenso
  // Verifica email
  emailVerified: boolean("emailVerified").default(false).notNull(),
  verificationToken: varchar("verificationToken", { length: 64 }),
  verifiedAt: timestamp("verifiedAt"),
  // Stato richiesta
  status: mysqlEnum("status", ["pending_verification", "new", "contacted", "scheduled", "completed"]).default("pending_verification").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
});
var blogLikes = mysqlTable("blog_likes", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  postId: int("postId").notNull().references(() => blogPosts.id),
  createdAt: timestamp("createdAt").defaultNow().notNull()
});
var savedPosts = mysqlTable("saved_posts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  postId: int("postId").notNull().references(() => blogPosts.id),
  createdAt: timestamp("createdAt").defaultNow().notNull()
});
var userPreferences = mysqlTable("user_preferences", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique().references(() => users.id),
  theme: mysqlEnum("theme", ["light", "dark", "system"]).default("system").notNull(),
  // Dati BMI
  weight: int("weight"),
  // peso in kg
  height: int("height"),
  // altezza in cm
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
});
var emailTemplates = mysqlTable("email_templates", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  // es. "consultation_confirmation"
  subject: varchar("subject", { length: 255 }).notNull(),
  body: text("body").notNull(),
  // supporta placeholder come {{name}}, {{email}}, {{phone}}
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
});
var diets = mysqlTable("diets", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  // rimosso unique per permettere multiple versioni
  title: varchar("title", { length: 255 }).notNull(),
  // es. "Dieta Personalizzata - Gennaio 2025"
  pdfUrl: text("pdfUrl").notNull(),
  // URL pubblico del PDF su S3
  fileKey: text("fileKey").notNull(),
  // chiave del file su S3 per gestione
  fileName: varchar("fileName", { length: 255 }).notNull(),
  // nome originale del file
  fileSize: int("fileSize").notNull(),
  // dimensione file in bytes
  version: int("version").notNull().default(1),
  // numero versione incrementale
  isActive: boolean("isActive").notNull().default(true),
  // solo l'ultima versione è attiva
  viewedAt: timestamp("viewedAt"),
  // quando il paziente ha visualizzato la dieta
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
});
var foodDiary = mysqlTable("food_diary", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  date: varchar("date", { length: 10 }).notNull(),
  // YYYY-MM-DD
  mealType: mysqlEnum("mealType", ["colazione", "spuntino_mattina", "pranzo", "spuntino_pomeriggio", "cena"]).notNull(),
  description: text("description").notNull(),
  calories: int("calories"),
  // calorie stimate (opzionale)
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
});
var bodyMeasurements = mysqlTable("body_measurements", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  date: varchar("date", { length: 10 }).notNull(),
  // YYYY-MM-DD
  weight: int("weight"),
  // peso in kg * 10 (es. 705 = 70.5 kg)
  waist: int("waist"),
  // girovita in mm
  hips: int("hips"),
  // fianchi in mm
  chest: int("chest"),
  // petto in mm
  arm: int("arm"),
  // braccio in mm
  thigh: int("thigh"),
  // coscia in mm
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull()
});
var appSettings = mysqlTable("app_settings", {
  id: int("id").autoincrement().primaryKey(),
  key: varchar("key", { length: 100 }).notNull().unique(),
  // es. "admin_notification_email"
  value: text("value").notNull(),
  description: text("description"),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
});

// server/db.ts
init_env();
var _db = null;
async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}
async function upsertUser(user) {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }
  try {
    const values = {
      openId: user.openId
    };
    const updateSet = {};
    const textFields = ["name", "email", "loginMethod"];
    const assignNullable = (field) => {
      const value = user[field];
      if (value === void 0) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };
    textFields.forEach(assignNullable);
    if (user.lastSignedIn !== void 0) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== void 0) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }
    if (!values.lastSignedIn) {
      values.lastSignedIn = /* @__PURE__ */ new Date();
    }
    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = /* @__PURE__ */ new Date();
    }
    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}
async function getUserByOpenId(openId) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return void 0;
  }
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : void 0;
}
async function getAllBlogCategories() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(blogCategories);
}
async function getPublishedBlogPosts() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(blogPosts).where(eq(blogPosts.published, true)).orderBy(desc(blogPosts.publishedAt));
}
async function getAllBlogPosts() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(blogPosts).orderBy(desc(blogPosts.createdAt));
}
async function getBlogPostBySlug(slug) {
  const db = await getDb();
  if (!db) return void 0;
  const result = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug)).limit(1);
  return result[0];
}
async function getBlogPostById(id) {
  const db = await getDb();
  if (!db) return void 0;
  const result = await db.select().from(blogPosts).where(eq(blogPosts.id, id)).limit(1);
  return result[0];
}
async function createBlogPost(post) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(blogPosts).values(post);
  return result;
}
async function updateBlogPost(id, post) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(blogPosts).set(post).where(eq(blogPosts.id, id));
}
async function deleteBlogPost(id) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(blogPosts).where(eq(blogPosts.id, id));
}
async function toggleBlogLike(userId, postId) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const existing = await db.select().from(blogLikes).where(and(eq(blogLikes.userId, userId), eq(blogLikes.postId, postId))).limit(1);
  if (existing.length > 0) {
    await db.delete(blogLikes).where(eq(blogLikes.id, existing[0].id));
    return { liked: false };
  } else {
    await db.insert(blogLikes).values({ userId, postId });
    return { liked: true };
  }
}
async function getUserBlogLikes(userId) {
  const db = await getDb();
  if (!db) return [];
  const likes = await db.select({ postId: blogLikes.postId }).from(blogLikes).where(eq(blogLikes.userId, userId));
  return likes.map((l) => l.postId);
}
async function getBlogLikesCount(postId) {
  const db = await getDb();
  if (!db) return 0;
  const likes = await db.select().from(blogLikes).where(eq(blogLikes.postId, postId));
  return likes.length;
}
async function toggleSavedPost(userId, postId) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const existing = await db.select().from(savedPosts).where(and(eq(savedPosts.userId, userId), eq(savedPosts.postId, postId))).limit(1);
  if (existing.length > 0) {
    await db.delete(savedPosts).where(eq(savedPosts.id, existing[0].id));
    return { saved: false };
  } else {
    await db.insert(savedPosts).values({ userId, postId });
    return { saved: true };
  }
}
async function getUserSavedPosts(userId) {
  const db = await getDb();
  if (!db) return [];
  const saved = await db.select({
    post: blogPosts
  }).from(savedPosts).innerJoin(blogPosts, eq(savedPosts.postId, blogPosts.id)).where(eq(savedPosts.userId, userId)).orderBy(desc(savedPosts.createdAt));
  return saved.map((s) => s.post);
}
async function getUserSavedPostIds(userId) {
  const db = await getDb();
  if (!db) return [];
  const saved = await db.select({ postId: savedPosts.postId }).from(savedPosts).where(eq(savedPosts.userId, userId));
  return saved.map((s) => s.postId);
}
async function getUserPreferences(userId) {
  const db = await getDb();
  if (!db) return void 0;
  const prefs = await db.select().from(userPreferences).where(eq(userPreferences.userId, userId)).limit(1);
  return prefs[0];
}
async function upsertUserPreferences(userId, preferences) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const existing = await getUserPreferences(userId);
  if (existing) {
    await db.update(userPreferences).set(preferences).where(eq(userPreferences.userId, userId));
  } else {
    await db.insert(userPreferences).values({
      userId,
      ...preferences
    });
  }
}
async function getEmailTemplate(name) {
  const db = await getDb();
  if (!db) return void 0;
  const templates = await db.select().from(emailTemplates).where(eq(emailTemplates.name, name)).limit(1);
  return templates[0];
}
async function getAllEmailTemplates() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(emailTemplates);
}
async function upsertEmailTemplate(template) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const existing = await getEmailTemplate(template.name);
  if (existing) {
    await db.update(emailTemplates).set({
      subject: template.subject,
      body: template.body
    }).where(eq(emailTemplates.name, template.name));
  } else {
    await db.insert(emailTemplates).values(template);
  }
}
async function getAppSetting(key) {
  const db = await getDb();
  if (!db) return void 0;
  const settings = await db.select().from(appSettings).where(eq(appSettings.key, key)).limit(1);
  return settings[0];
}
async function getAdminNotificationEmail() {
  return await getAppSetting("ADMIN_NOTIFICATION_EMAIL");
}
async function getConsultationRequestByToken(token) {
  const db = await getDb();
  if (!db) return void 0;
  const result = await db.select().from(consultationRequests).where(eq(consultationRequests.verificationToken, token)).limit(1);
  return result[0];
}
async function verifyConsultationEmail(id) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(consultationRequests).set({
    emailVerified: true,
    verifiedAt: /* @__PURE__ */ new Date(),
    status: "new"
  }).where(eq(consultationRequests.id, id));
}
async function getDietByUserId(userId) {
  const db = await getDb();
  if (!db) return void 0;
  const result = await db.select().from(diets).where(and(eq(diets.userId, userId), eq(diets.isActive, true))).orderBy(desc(diets.version)).limit(1);
  return result[0];
}
async function getAllDiets() {
  const db = await getDb();
  if (!db) return [];
  const result = await db.select({
    id: diets.id,
    userId: diets.userId,
    title: diets.title,
    pdfUrl: diets.pdfUrl,
    fileKey: diets.fileKey,
    fileName: diets.fileName,
    fileSize: diets.fileSize,
    version: diets.version,
    isActive: diets.isActive,
    viewedAt: diets.viewedAt,
    createdAt: diets.createdAt,
    updatedAt: diets.updatedAt,
    userName: users.name,
    userEmail: users.email
  }).from(diets).leftJoin(users, eq(diets.userId, users.id)).where(eq(diets.isActive, true)).orderBy(desc(diets.updatedAt));
  return result;
}
async function createOrUpdateDiet(userId, diet) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  if (!userId || typeof userId !== "number") {
    throw new Error(`Invalid userId: ${userId}`);
  }
  const existing = await getDietByUserId(userId);
  if (existing) {
    await db.update(diets).set({ isActive: false }).where(eq(diets.id, existing.id));
    const insertData = {
      userId: Number(userId),
      title: diet.title,
      pdfUrl: diet.pdfUrl,
      fileKey: diet.fileKey,
      fileName: diet.fileName,
      fileSize: diet.fileSize,
      version: existing.version + 1,
      isActive: true,
      viewedAt: null
      // Reset viewedAt per la nuova versione
    };
    await db.insert(diets).values(insertData);
  } else {
    const insertData = {
      userId: Number(userId),
      title: diet.title,
      pdfUrl: diet.pdfUrl,
      fileKey: diet.fileKey,
      fileName: diet.fileName,
      fileSize: diet.fileSize,
      version: 1,
      isActive: true,
      viewedAt: null
    };
    await db.insert(diets).values(insertData);
  }
}
async function deleteDiet(userId) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(diets).where(eq(diets.userId, userId));
}
async function getAllUsers() {
  const db = await getDb();
  if (!db) return [];
  const result = await db.select({
    id: users.id,
    name: users.name,
    email: users.email,
    role: users.role
  }).from(users).orderBy(users.name);
  return result;
}
async function getDietHistory(userId) {
  const db = await getDb();
  if (!db) return [];
  const result = await db.select().from(diets).where(eq(diets.userId, userId)).orderBy(desc(diets.version));
  return result;
}
async function markDietAsViewed(dietId) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(diets).set({ viewedAt: /* @__PURE__ */ new Date() }).where(eq(diets.id, dietId));
}
async function getFoodDiaryByDate(userId, date) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(foodDiary).where(and(eq(foodDiary.userId, userId), eq(foodDiary.date, date))).orderBy(foodDiary.mealType);
}
async function getFoodDiaryByDateRange(userId, startDate, endDate) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(foodDiary).where(and(
    eq(foodDiary.userId, userId),
    gte(foodDiary.date, startDate),
    lte(foodDiary.date, endDate)
  )).orderBy(desc(foodDiary.date), foodDiary.mealType);
}
async function createFoodDiaryEntry(entry) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(foodDiary).values(entry);
}
async function deleteFoodDiaryEntry(id) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(foodDiary).where(eq(foodDiary.id, id));
}
async function getBodyMeasurements(userId, limit = 30) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(bodyMeasurements).where(eq(bodyMeasurements.userId, userId)).orderBy(desc(bodyMeasurements.date)).limit(limit);
}
async function createBodyMeasurement(measurement) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(bodyMeasurements).values(measurement);
}
async function deleteBodyMeasurement(id) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(bodyMeasurements).where(eq(bodyMeasurements.id, id));
}

// server/supabaseDb.ts
init_env();
import { createClient } from "@supabase/supabase-js";
function requestAccessToken(req) {
  const authorization = req.get("authorization");
  if (!authorization?.startsWith("Bearer ")) return void 0;
  return authorization.slice(7).trim() || void 0;
}
function client(accessToken) {
  if (!ENV.supabaseUrl || !ENV.supabasePublishableKey) {
    throw new Error("Supabase non configurato");
  }
  return createClient(ENV.supabaseUrl, ENV.supabasePublishableKey, {
    global: accessToken ? { headers: { Authorization: `Bearer ${accessToken}` } } : void 0,
    auth: { persistSession: false, autoRefreshToken: false }
  });
}
function assertOk(error) {
  if (error) throw new Error(error.message);
}
function serviceFromRow(row) {
  return {
    id: Number(row.id),
    title: row.title,
    description: row.description,
    duration: Number(row.duration),
    price: Number(row.price),
    active: Boolean(row.active),
    order: Number(row.display_order),
    createdAt: row.created_at ? new Date(row.created_at) : /* @__PURE__ */ new Date(),
    updatedAt: row.updated_at ? new Date(row.updated_at) : /* @__PURE__ */ new Date()
  };
}
function consultationFromRow(row) {
  return {
    id: Number(row.id),
    userId: null,
    serviceId: row.service_id == null ? null : Number(row.service_id),
    name: row.name,
    email: row.email,
    phone: row.phone,
    age: row.age == null ? null : Number(row.age),
    weight: row.weight == null ? null : Number(row.weight),
    height: row.height == null ? null : Number(row.height),
    goal: row.goal,
    medicalConditions: row.medical_conditions,
    allergies: row.allergies,
    currentDiet: row.current_diet,
    message: row.message,
    privacyConsent: Boolean(row.privacy_consent),
    privacyConsentDate: row.privacy_consent_date ? new Date(row.privacy_consent_date) : null,
    emailVerified: true,
    verificationToken: null,
    verifiedAt: null,
    status: row.status,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at)
  };
}
function contactFromRow(row) {
  return {
    id: Number(row.id),
    name: row.name,
    email: row.email,
    phone: row.phone,
    consultationType: row.consultation_type,
    message: row.message,
    status: row.status,
    createdAt: new Date(row.created_at)
  };
}
function testimonialFromRow(row) {
  return {
    id: Number(row.id),
    userId: null,
    name: row.name,
    email: row.email,
    content: row.content,
    rating: Number(row.rating),
    imageUrl: row.image_url,
    approved: Boolean(row.approved),
    createdAt: new Date(row.created_at)
  };
}
async function getActiveServices() {
  const { data, error } = await client().from("services").select("*").eq("active", true).order("display_order", { ascending: true });
  assertOk(error);
  return (data ?? []).map(serviceFromRow);
}
async function getAllServices(accessToken) {
  const { data, error } = await client(accessToken).from("services").select("*").order("display_order", { ascending: true });
  assertOk(error);
  return (data ?? []).map(serviceFromRow);
}
async function getServiceById(id) {
  const { data, error } = await client().from("services").select("*").eq("id", id).maybeSingle();
  assertOk(error);
  return data ? serviceFromRow(data) : void 0;
}
async function createService(accessToken, input) {
  const { error } = await client(accessToken).from("services").insert({
    title: input.title,
    description: input.description,
    duration: input.duration,
    price: input.price,
    active: input.active ?? true,
    display_order: input.order ?? 0
  });
  assertOk(error);
}
async function updateService(accessToken, id, input) {
  const values = { ...input };
  if ("order" in values) {
    values.display_order = values.order;
    delete values.order;
  }
  const { error } = await client(accessToken).from("services").update(values).eq("id", id);
  assertOk(error);
}
async function createConsultationRequest(accessToken, input, userUid) {
  const { error } = await client(accessToken).from("consultation_requests").insert({
    user_uid: userUid ?? null,
    service_id: input.serviceId ?? null,
    name: input.name,
    email: input.email,
    phone: input.phone || null,
    age: input.age ?? null,
    weight: input.weight ?? null,
    height: input.height ?? null,
    goal: input.goal || null,
    medical_conditions: input.medicalConditions || null,
    allergies: input.allergies || null,
    current_diet: input.currentDiet || null,
    message: input.message || null,
    privacy_consent: input.privacyConsent,
    privacy_consent_date: (/* @__PURE__ */ new Date()).toISOString(),
    status: "new"
  });
  assertOk(error);
}
async function getAllConsultationRequests(accessToken) {
  const { data, error } = await client(accessToken).from("consultation_requests").select("*").order("created_at", { ascending: false });
  assertOk(error);
  return (data ?? []).map(consultationFromRow);
}
async function getMyConsultations(accessToken) {
  const { data, error } = await client(accessToken).from("consultation_requests").select("*").order("created_at", { ascending: false });
  assertOk(error);
  return (data ?? []).map(consultationFromRow);
}
async function getConsultationRequestById(accessToken, id) {
  const { data, error } = await client(accessToken).from("consultation_requests").select("*").eq("id", id).maybeSingle();
  assertOk(error);
  return data ? consultationFromRow(data) : void 0;
}
async function updateConsultationStatus(accessToken, id, status) {
  const { error } = await client(accessToken).from("consultation_requests").update({ status }).eq("id", id);
  assertOk(error);
}
async function deleteConsultationRequest(accessToken, id) {
  const { error } = await client(accessToken).from("consultation_requests").delete().eq("id", id);
  assertOk(error);
}
async function createContactRequest(accessToken, input) {
  const { error } = await client(accessToken).from("contact_requests").insert({
    name: input.name,
    email: input.email,
    phone: input.phone || null,
    consultation_type: input.consultationType || null,
    message: input.message,
    status: "new"
  });
  assertOk(error);
}
async function getAllContactRequests(accessToken) {
  const { data, error } = await client(accessToken).from("contact_requests").select("*").order("created_at", { ascending: false });
  assertOk(error);
  return (data ?? []).map(contactFromRow);
}
async function updateContactRequestStatus(accessToken, id, status) {
  const { error } = await client(accessToken).from("contact_requests").update({ status }).eq("id", id);
  assertOk(error);
}
async function deleteContactRequest(accessToken, id) {
  const { error } = await client(accessToken).from("contact_requests").delete().eq("id", id);
  assertOk(error);
}
async function getPublishedTestimonials() {
  const { data, error } = await client().from("testimonials").select("*").eq("approved", true).order("created_at", { ascending: false });
  assertOk(error);
  return (data ?? []).map(testimonialFromRow);
}
async function getAllTestimonials(accessToken) {
  const { data, error } = await client(accessToken).from("testimonials").select("*").order("created_at", { ascending: false });
  assertOk(error);
  return (data ?? []).map(testimonialFromRow);
}
async function createTestimonial(accessToken, input, userUid) {
  const { error } = await client(accessToken).from("testimonials").insert({
    user_uid: userUid ?? null,
    name: input.name,
    email: input.email || null,
    content: input.content,
    rating: input.rating,
    approved: Boolean(input.approved)
  });
  assertOk(error);
}
async function updateTestimonial(accessToken, id, input) {
  const { error } = await client(accessToken).from("testimonials").update(input).eq("id", id);
  assertOk(error);
}
async function deleteTestimonial(accessToken, id) {
  const { error } = await client(accessToken).from("testimonials").delete().eq("id", id);
  assertOk(error);
}
async function trackEvent(accessToken, input, userUid) {
  const { error } = await client(accessToken).from("site_events").insert({
    user_uid: userUid ?? null,
    event_type: input.eventType,
    path: input.path.slice(0, 500),
    service_id: input.serviceId ?? null
  });
  assertOk(error);
}
async function getDashboardStats(accessToken) {
  const db = client(accessToken);
  const since = /* @__PURE__ */ new Date();
  since.setDate(since.getDate() - 6);
  since.setHours(0, 0, 0, 0);
  const [consultationsResult, contactsResult, testimonialsResult, profilesResult, eventsResult, servicesResult] = await Promise.all([
    db.from("consultation_requests").select("*").order("created_at", { ascending: false }),
    db.from("contact_requests").select("*").order("created_at", { ascending: false }),
    db.from("testimonials").select("*"),
    db.from("profiles").select("id, role"),
    db.from("site_events").select("event_type, path, service_id, created_at").gte("created_at", since.toISOString()),
    db.from("services").select("id, title")
  ]);
  for (const result of [consultationsResult, contactsResult, testimonialsResult, profilesResult, eventsResult, servicesResult]) {
    assertOk(result.error);
  }
  const consultations = consultationsResult.data ?? [];
  const contacts = contactsResult.data ?? [];
  const testimonials2 = testimonialsResult.data ?? [];
  const profiles = profilesResult.data ?? [];
  const events = eventsResult.data ?? [];
  const services2 = new Map((servicesResult.data ?? []).map((row) => [Number(row.id), row.title]));
  const daily = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(since);
    date.setDate(since.getDate() + index);
    return { date: date.toISOString().slice(0, 10), visits: 0, requests: 0 };
  });
  const dailyMap = new Map(daily.map((day) => [day.date, day]));
  for (const event of events) {
    const day = dailyMap.get(String(event.created_at).slice(0, 10));
    if (day && event.event_type === "page_view") day.visits += 1;
  }
  for (const request of consultations) {
    const day = dailyMap.get(String(request.created_at).slice(0, 10));
    if (day) day.requests += 1;
  }
  const serviceCounts = /* @__PURE__ */ new Map();
  for (const request of consultations) {
    if (request.service_id == null) continue;
    const id = Number(request.service_id);
    serviceCounts.set(id, (serviceCounts.get(id) ?? 0) + 1);
  }
  return {
    summary: {
      consultations: consultations.length,
      newConsultations: consultations.filter((row) => row.status === "new").length,
      contacts: contacts.length,
      unreadContacts: contacts.filter((row) => row.status === "new").length,
      approvedTestimonials: testimonials2.filter((row) => row.approved).length,
      registeredUsers: profiles.filter((row) => row.role === "user").length,
      pageViews: events.filter((row) => row.event_type === "page_view").length
    },
    daily,
    topServices: Array.from(serviceCounts.entries()).map(([id, count]) => ({ id, title: services2.get(id) ?? `Servizio ${id}`, count })).sort((a, b) => b.count - a.count),
    recentConsultations: consultations.slice(0, 5).map(consultationFromRow)
  };
}

// shared/services.ts
var catalogDate = /* @__PURE__ */ new Date("2026-01-01T00:00:00.000Z");
var DEFAULT_SERVICES = [
  {
    id: 1,
    title: "Prima Visita Nutrizionale",
    description: "Valutazione completa dello stato nutrizionale, analisi delle abitudini alimentari e definizione degli obiettivi. Include misurazione composizione corporea e piano alimentare personalizzato.",
    duration: 60,
    price: 9e3,
    active: true,
    order: 1,
    createdAt: catalogDate,
    updatedAt: catalogDate
  },
  {
    id: 2,
    title: "Visita di controllo",
    description: "Rivalutazione dei progressi del paziente. Eventuali modifiche al piano nutrizionale inviato.",
    duration: 40,
    price: 5e3,
    active: true,
    order: 2,
    createdAt: catalogDate,
    updatedAt: catalogDate
  },
  {
    id: 3,
    title: "Prima visita Online",
    description: "Consulenza nutrizionale svolta attraverso piattaforme digitali. Per maggiori informazioni sullo svolgimento online contattami!",
    duration: 60,
    price: 7e3,
    active: true,
    order: 3,
    createdAt: catalogDate,
    updatedAt: catalogDate
  },
  {
    id: 4,
    title: "Visita di controllo online",
    description: "Rivalutazione del paziente ed eventuale cambio della strategia nutrizionale.",
    duration: 24,
    price: 4e3,
    active: true,
    order: 4,
    createdAt: catalogDate,
    updatedAt: catalogDate
  },
  {
    id: 5,
    title: "Educazione Alimentare",
    description: "Sessione educativa su temi specifici: lettura etichette, spesa consapevole, organizzazione pasti, cucina salutare. Ideale per famiglie e gruppi.",
    duration: 60,
    price: 7e3,
    active: true,
    order: 5,
    createdAt: catalogDate,
    updatedAt: catalogDate
  },
  {
    id: 6,
    title: "Analisi della composizione corporea (MetaDieta BIA)",
    description: "Analisi della composizione corporea con MetaDieta BIA",
    duration: 20,
    price: 2e3,
    active: true,
    order: 6,
    createdAt: catalogDate,
    updatedAt: catalogDate
  }
];

// shared/betterOffers.ts
var BETTER_NOTICE = "Solo per abbonamenti in corso di validit\xE0";
var BETTER_KEYS = ["better-prima-visita", "better-controllo", "better-bia"];
var definitions = [
  { key: BETTER_KEYS[0], match: "prima visita nutrizionale", title: "Prima visita", price: 7500 },
  { key: BETTER_KEYS[1], match: "visita di controllo", title: "Visita di controllo", price: 4e3 },
  { key: BETTER_KEYS[2], match: "analisi della composizione corporea (metadieta bia)", title: "BIA (bioimpedenziometria)", price: null }
];
function getBetterOffers(services2 = DEFAULT_SERVICES) {
  return definitions.map((offer) => {
    const matches = (service) => service.title.trim().toLocaleLowerCase("it-IT") === offer.match;
    const source = services2.find(matches) ?? DEFAULT_SERVICES.find(matches);
    return { ...offer, source, price: offer.price ?? source.price, label: `Better Club \u2014 ${offer.title}` };
  });
}
function betterRequestMessage(offer, message) {
  return [`${offer.label} \u2014 \u20AC${(offer.price / 100).toFixed(2)}`, `${BETTER_NOTICE}. Validit\xE0 da verificare.`, message?.trim()].filter(Boolean).join("\n");
}

// server/routers.ts
var adminProcedure2 = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") {
    throw new TRPCError4({ code: "FORBIDDEN", message: "Admin access required" });
  }
  return next({ ctx });
});
var appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true };
    })
  }),
  // ===== SERVICES =====
  services: router({
    list: publicProcedure.query(async () => {
      try {
        const services2 = await getActiveServices();
        return services2.length > 0 ? services2 : DEFAULT_SERVICES;
      } catch (error) {
        console.warn("[Supabase] Services fallback:", error);
        return DEFAULT_SERVICES;
      }
    }),
    listAll: adminProcedure2.query(async ({ ctx }) => {
      return await getAllServices(requestAccessToken(ctx.req));
    }),
    getById: publicProcedure.input(z2.object({ id: z2.number() })).query(async ({ input }) => {
      return await getServiceById(input.id) ?? DEFAULT_SERVICES.find((service) => service.id === input.id);
    }),
    create: adminProcedure2.input(z2.object({
      title: z2.string(),
      description: z2.string(),
      price: z2.number(),
      duration: z2.number()
    })).mutation(async ({ input, ctx }) => {
      await createService(requestAccessToken(ctx.req), input);
      return { success: true };
    }),
    update: adminProcedure2.input(z2.object({
      id: z2.number(),
      title: z2.string().optional(),
      description: z2.string().optional(),
      price: z2.number().optional(),
      duration: z2.number().optional(),
      active: z2.boolean().optional()
    })).mutation(async ({ input, ctx }) => {
      const { id, ...data } = input;
      await updateService(requestAccessToken(ctx.req), id, data);
      return { success: true };
    })
  }),
  // ===== BLOG =====
  blog: router({
    list: publicProcedure.query(async () => {
      return await getPublishedBlogPosts();
    }),
    listAll: adminProcedure2.query(async () => {
      return await getAllBlogPosts();
    }),
    getBySlug: publicProcedure.input(z2.object({ slug: z2.string() })).query(async ({ input }) => {
      return await getBlogPostBySlug(input.slug);
    }),
    getById: publicProcedure.input(z2.object({ id: z2.number() })).query(async ({ input }) => {
      return await getBlogPostById(input.id);
    }),
    create: adminProcedure2.input(z2.object({
      title: z2.string(),
      slug: z2.string(),
      content: z2.string(),
      excerpt: z2.string(),
      published: z2.boolean().optional()
    })).mutation(async ({ input }) => {
      const post = await createBlogPost(input);
      return post;
    }),
    update: adminProcedure2.input(z2.object({
      id: z2.number(),
      title: z2.string().optional(),
      slug: z2.string().optional(),
      content: z2.string().optional(),
      excerpt: z2.string().optional(),
      published: z2.boolean().optional()
    })).mutation(async ({ input }) => {
      const { id, ...data } = input;
      await updateBlogPost(id, data);
      return { success: true };
    }),
    delete: adminProcedure2.input(z2.object({ id: z2.number() })).mutation(async ({ input }) => {
      await deleteBlogPost(input.id);
      return { success: true };
    }),
    generateContent: adminProcedure2.input(z2.object({
      topic: z2.string(),
      style: z2.string().optional()
    })).mutation(async ({ input }) => {
      const { invokeLLM: invokeLLM2 } = await Promise.resolve().then(() => (init_llm(), llm_exports));
      const response = await invokeLLM2({
        messages: [
          { role: "system", content: "Sei un esperto di nutrizione. Scrivi articoli di blog ben strutturati in italiano." },
          { role: "user", content: "Scrivi un articolo sul tema: " + input.topic + ". Stile: " + (input.style || "informativo") + "." }
        ]
      });
      const content = response.choices[0].message.content;
      return { content };
    }),
    categories: publicProcedure.query(async () => {
      return await getAllBlogCategories();
    })
  }),
  // ===== AI ASSISTANT =====
  aiAssistant: router({
    generateContent: adminProcedure2.input(z2.object({
      type: z2.enum(["article", "recipe", "advice"]),
      topic: z2.string()
    })).mutation(async ({ input }) => {
      let prompt = "";
      if (input.type === "article") {
        prompt = `Scrivi un articolo educativo su nutrizione riguardante: "${input.topic}". 
          L'articolo deve essere informativo, ben strutturato con titoli e paragrafi, e scritto in italiano.
          Includi consigli pratici e basati su evidenze scientifiche.
          Formato: Markdown con titoli (# ##), paragrafi e liste quando appropriato.`;
      } else if (input.type === "recipe") {
        prompt = `Crea una ricetta salutare per: "${input.topic}".
          Includi: ingredienti con quantit\xE0, modalit\xE0 di preparazione, tempo di cottura, valori nutrizionali approssimativi.
          Scrivi in italiano con un tono amichevole e pratico.
          Formato: Markdown con sezioni chiare.`;
      } else if (input.type === "advice") {
        prompt = `Fornisci consigli nutrizionali pratici su: "${input.topic}".
          I consigli devono essere basati su principi di nutrizione corretta, facili da seguire e adatti a tutti.
          Scrivi in italiano con un tono professionale ma accessibile.
          Formato: Markdown con punti numerati o bullet points.`;
      }
      const response = await invokeLLM({
        messages: [
          {
            role: "system",
            content: "Tu sei un esperto nutrizionista che crea contenuti educativi e ricette salutari in italiano."
          },
          {
            role: "user",
            content: prompt
          }
        ]
      });
      const content = response.choices[0]?.message?.content || "";
      return { content };
    })
  }),
  // ===== CONSULTATION REQUESTS =====
  consultations: router({
    // Invia una nuova richiesta di consulenza
    submit: publicProcedure.input(z2.object({
      serviceId: z2.number().optional(),
      betterOffer: z2.enum(BETTER_KEYS).optional(),
      name: z2.string(),
      email: z2.string().email(),
      phone: z2.string().optional(),
      age: z2.number().optional(),
      weight: z2.number().optional(),
      height: z2.number().optional(),
      goal: z2.string().optional(),
      medicalConditions: z2.string().optional(),
      allergies: z2.string().optional(),
      currentDiet: z2.string().optional(),
      message: z2.string().optional(),
      privacyConsent: z2.boolean()
    })).mutation(async ({ input, ctx }) => {
      const token = requestAccessToken(ctx.req);
      const { betterOffer, ...request } = input;
      if (betterOffer) {
        const services2 = await getActiveServices();
        const offer = getBetterOffers(services2).find((item) => item.key === betterOffer);
        request.serviceId = offer.source.id;
        request.message = betterRequestMessage(offer, request.message);
      }
      await createConsultationRequest(token, request, ctx.user?.openId);
      await trackEvent(
        token,
        { eventType: "booking_submitted", path: "/prenota", serviceId: request.serviceId },
        ctx.user?.openId
      );
      return { success: true };
    }),
    // Lista consulenze dell'utente loggato (per userId OR email)
    getMyConsultations: protectedProcedure.query(async ({ ctx }) => {
      return await getMyConsultations(requestAccessToken(ctx.req));
    }),
    // Lista richieste (admin)
    list: adminProcedure2.query(async ({ ctx }) => {
      return await getAllConsultationRequests(requestAccessToken(ctx.req));
    }),
    // Lista tutte le richieste (admin) - alias per compatibilità
    listAll: adminProcedure2.query(async ({ ctx }) => {
      return await getAllConsultationRequests(requestAccessToken(ctx.req));
    }),
    // Dettaglio richiesta (admin)
    getById: adminProcedure2.input(z2.object({ id: z2.number() })).query(async ({ input, ctx }) => {
      return await getConsultationRequestById(requestAccessToken(ctx.req), input.id);
    }),
    // Aggiorna stato richiesta (admin)
    updateStatus: adminProcedure2.input(z2.object({
      id: z2.number(),
      status: z2.enum(["new", "contacted", "scheduled", "completed"])
    })).mutation(async ({ input, ctx }) => {
      await updateConsultationStatus(requestAccessToken(ctx.req), input.id, input.status);
      return { success: true };
    }),
    // Elimina richiesta (admin)
    delete: adminProcedure2.input(z2.object({ id: z2.number() })).mutation(async ({ input, ctx }) => {
      await deleteConsultationRequest(requestAccessToken(ctx.req), input.id);
      return { success: true };
    }),
    // Verifica email con token
    verifyEmail: publicProcedure.input(z2.object({ token: z2.string() })).mutation(async ({ input }) => {
      const request = await getConsultationRequestByToken(input.token);
      if (!request) {
        throw new TRPCError4({ code: "NOT_FOUND", message: "Token non valido" });
      }
      await verifyConsultationEmail(request.id);
      const adminNotificationEmail = await getAdminNotificationEmail();
      const emailAddress = adminNotificationEmail?.value || "pelliccioniarianna.dietista@gmail.com";
      await notifyOwner({
        title: "Nuova richiesta di consulenza confermata",
        content: `Una nuova richiesta di consulenza \xE8 stata confermata:

Nome: ${request.name}
Email: ${request.email}
Telefono: ${request.phone}
Obiettivo: ${request.goal}
Condizioni mediche: ${request.medicalConditions}
Allergie: ${request.allergies}`
      });
      return { success: true };
    })
  }),
  // ===== USER PREFERENCES =====
  userPreferences: router({
    // Get user preferences
    get: protectedProcedure.query(async ({ ctx }) => {
      return await getUserPreferences(ctx.user.id);
    }),
    // Update preferences
    update: protectedProcedure.input(z2.object({
      theme: z2.enum(["light", "dark", "system"]).optional(),
      weight: z2.number().optional(),
      height: z2.number().optional()
    })).mutation(async ({ ctx, input }) => {
      await upsertUserPreferences(ctx.user.id, input);
      return { success: true };
    })
  }),
  // ===== BLOG LIKES =====
  blogLikes: router({
    // Toggle like on a post
    toggle: protectedProcedure.input(z2.object({ postId: z2.number() })).mutation(async ({ ctx, input }) => {
      return await toggleBlogLike(ctx.user.id, input.postId);
    }),
    // Get user's liked posts
    myLikes: protectedProcedure.query(async ({ ctx }) => {
      return await getUserBlogLikes(ctx.user.id);
    }),
    // Get likes count for a post
    count: publicProcedure.input(z2.object({ postId: z2.number() })).query(async ({ input }) => {
      return await getBlogLikesCount(input.postId);
    })
  }),
  // ===== SAVED POSTS =====
  savedPosts: router({
    // Toggle save on a post
    toggle: protectedProcedure.input(z2.object({ postId: z2.number() })).mutation(async ({ ctx, input }) => {
      return await toggleSavedPost(ctx.user.id, input.postId);
    }),
    // Get user's saved posts
    mySaved: protectedProcedure.query(async ({ ctx }) => {
      return await getUserSavedPosts(ctx.user.id);
    }),
    // Get user's saved post IDs
    mySavedIds: protectedProcedure.query(async ({ ctx }) => {
      return await getUserSavedPostIds(ctx.user.id);
    })
  }),
  // ===== EMAIL TEMPLATES =====
  emailTemplates: router({
    // Get template by name
    getByName: adminProcedure2.input(z2.object({ name: z2.string() })).query(async ({ input }) => {
      return await getEmailTemplate(input.name);
    }),
    // List all templates
    listAll: adminProcedure2.query(async () => {
      return await getAllEmailTemplates();
    }),
    // Upsert template
    upsert: adminProcedure2.input(z2.object({
      name: z2.string(),
      subject: z2.string(),
      body: z2.string()
    })).mutation(async ({ input }) => {
      await upsertEmailTemplate(input);
      return { success: true };
    })
  }),
  // ===== TESTIMONIALS =====
  testimonials: router({
    list: publicProcedure.query(async () => {
      return await getPublishedTestimonials();
    }),
    listAll: adminProcedure2.query(async ({ ctx }) => {
      return await getAllTestimonials(requestAccessToken(ctx.req));
    }),
    // Utente loggato può creare una recensione (non approvata)
    submit: protectedProcedure.input(z2.object({
      content: z2.string().min(10),
      rating: z2.number().min(1).max(5)
    })).mutation(async ({ ctx, input }) => {
      await createTestimonial(requestAccessToken(ctx.req), {
        name: ctx.user.name || "Utente",
        email: ctx.user.email || void 0,
        content: input.content,
        rating: input.rating,
        approved: false
      }, ctx.user.openId);
      return { success: true };
    }),
    // Admin crea recensione (già approvata)
    create: adminProcedure2.input(z2.object({
      name: z2.string(),
      content: z2.string(),
      rating: z2.number().min(1).max(5)
    })).mutation(async ({ input, ctx }) => {
      await createTestimonial(requestAccessToken(ctx.req), { ...input, approved: true });
      return { success: true };
    }),
    // Admin approva recensione
    approve: adminProcedure2.input(z2.object({ id: z2.number() })).mutation(async ({ input, ctx }) => {
      await updateTestimonial(requestAccessToken(ctx.req), input.id, { approved: true });
      return { success: true };
    }),
    // Admin rifiuta recensione (imposta approved a false)
    reject: adminProcedure2.input(z2.object({ id: z2.number() })).mutation(async ({ input, ctx }) => {
      await updateTestimonial(requestAccessToken(ctx.req), input.id, { approved: false });
      return { success: true };
    }),
    delete: adminProcedure2.input(z2.object({ id: z2.number() })).mutation(async ({ input, ctx }) => {
      await deleteTestimonial(requestAccessToken(ctx.req), input.id);
      return { success: true };
    })
  }),
  // ===== CONTACT REQUESTS =====
  contact: router({
    submit: publicProcedure.input(z2.object({
      name: z2.string(),
      email: z2.string().email(),
      phone: z2.string().optional(),
      consultationType: z2.string().optional(),
      message: z2.string()
    })).mutation(async ({ input, ctx }) => {
      const token = requestAccessToken(ctx.req);
      await createContactRequest(token, input);
      await trackEvent(token, { eventType: "contact_submitted", path: "/contatti" }, ctx.user?.openId);
      return { success: true };
    }),
    list: adminProcedure2.query(async ({ ctx }) => {
      return await getAllContactRequests(requestAccessToken(ctx.req));
    }),
    // Alias per compatibilità
    listAll: adminProcedure2.query(async ({ ctx }) => {
      return await getAllContactRequests(requestAccessToken(ctx.req));
    }),
    updateStatus: adminProcedure2.input(z2.object({
      id: z2.number(),
      status: z2.enum(["new", "read", "replied"])
    })).mutation(async ({ input, ctx }) => {
      await updateContactRequestStatus(requestAccessToken(ctx.req), input.id, input.status);
      return { success: true };
    }),
    delete: adminProcedure2.input(z2.object({ id: z2.number() })).mutation(async ({ input, ctx }) => {
      await deleteContactRequest(requestAccessToken(ctx.req), input.id);
      return { success: true };
    })
  }),
  // ===== DIETS =====
  diets: router({
    // Utente loggato può visualizzare la propria dieta attiva
    getMyDiet: protectedProcedure.query(async ({ ctx }) => {
      return await getDietByUserId(ctx.user.id);
    }),
    // Utente loggato può visualizzare lo storico delle sue diete
    getMyHistory: protectedProcedure.query(async ({ ctx }) => {
      return await getDietHistory(ctx.user.id);
    }),
    // Utente marca la dieta come visualizzata
    markAsViewed: protectedProcedure.input(z2.object({ dietId: z2.number() })).mutation(async ({ input }) => {
      await markDietAsViewed(input.dietId);
      return { success: true };
    }),
    // Admin visualizza tutte le diete
    listAll: adminProcedure2.query(async () => {
      return await getAllDiets();
    }),
    // Admin ottiene lista utenti per selezione
    listUsers: adminProcedure2.query(async () => {
      return await getAllUsers();
    }),
    // Admin crea o aggiorna la dieta di un paziente (con upload PDF)
    createOrUpdate: adminProcedure2.input(z2.object({
      userId: z2.number(),
      title: z2.string(),
      pdfUrl: z2.string(),
      fileKey: z2.string(),
      fileName: z2.string(),
      fileSize: z2.number()
    })).mutation(async ({ input }) => {
      const { userId, ...dietData } = input;
      await createOrUpdateDiet(userId, dietData);
      return { success: true };
    }),
    // Admin elimina la dieta di un paziente
    delete: adminProcedure2.input(z2.object({ userId: z2.number() })).mutation(async ({ input }) => {
      await deleteDiet(input.userId);
      return { success: true };
    })
  }),
  // ===== FOOD DIARY =====
  foodDiary: router({
    getByDate: protectedProcedure.input(z2.object({ date: z2.string() })).query(async ({ ctx, input }) => {
      return await getFoodDiaryByDate(ctx.user.id, input.date);
    }),
    getByDateRange: protectedProcedure.input(z2.object({ startDate: z2.string(), endDate: z2.string() })).query(async ({ ctx, input }) => {
      return await getFoodDiaryByDateRange(ctx.user.id, input.startDate, input.endDate);
    }),
    add: protectedProcedure.input(z2.object({
      date: z2.string(),
      mealType: z2.enum(["colazione", "spuntino_mattina", "pranzo", "spuntino_pomeriggio", "cena"]),
      description: z2.string().min(1),
      calories: z2.number().optional(),
      notes: z2.string().optional()
    })).mutation(async ({ ctx, input }) => {
      await createFoodDiaryEntry({ ...input, userId: ctx.user.id });
      return { success: true };
    }),
    delete: protectedProcedure.input(z2.object({ id: z2.number() })).mutation(async ({ ctx: _ctx, input }) => {
      await deleteFoodDiaryEntry(input.id);
      return { success: true };
    })
  }),
  // ===== BODY MEASUREMENTS =====
  bodyMeasurements: router({
    list: protectedProcedure.input(z2.object({ limit: z2.number().optional() })).query(async ({ ctx, input }) => {
      return await getBodyMeasurements(ctx.user.id, input.limit ?? 30);
    }),
    add: protectedProcedure.input(z2.object({
      date: z2.string(),
      weight: z2.number().optional(),
      // kg * 10
      waist: z2.number().optional(),
      // mm
      hips: z2.number().optional(),
      chest: z2.number().optional(),
      arm: z2.number().optional(),
      thigh: z2.number().optional(),
      notes: z2.string().optional()
    })).mutation(async ({ ctx, input }) => {
      await createBodyMeasurement({ ...input, userId: ctx.user.id });
      return { success: true };
    }),
    delete: protectedProcedure.input(z2.object({ id: z2.number() })).mutation(async ({ ctx: _ctx, input }) => {
      await deleteBodyMeasurement(input.id);
      return { success: true };
    })
  }),
  // ===== ANALYTICS =====
  analytics: router({
    track: publicProcedure.input(z2.object({
      path: z2.string().min(1).max(500),
      serviceId: z2.number().optional()
    })).mutation(async ({ input, ctx }) => {
      await trackEvent(
        requestAccessToken(ctx.req),
        { eventType: "page_view", path: input.path, serviceId: input.serviceId },
        ctx.user?.openId
      );
      return { success: true };
    }),
    dashboard: adminProcedure2.query(async ({ ctx }) => {
      return await getDashboardStats(requestAccessToken(ctx.req));
    })
  }),
  // Storage upload endpoint
  storage: router({
    upload: protectedProcedure.input(z2.object({
      key: z2.string(),
      data: z2.array(z2.number()),
      contentType: z2.string()
    })).mutation(async ({ input }) => {
      const { storagePut: storagePut2 } = await Promise.resolve().then(() => (init_storage(), storage_exports));
      const buffer = new Uint8Array(input.data);
      const result = await storagePut2(input.key, buffer, input.contentType);
      return result;
    })
  })
});

// shared/_core/errors.ts
var HttpError = class extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.name = "HttpError";
  }
};
var ForbiddenError = (msg) => new HttpError(403, msg);

// server/_core/sdk.ts
import { createClient as createClient2 } from "@supabase/supabase-js";
init_env();
function bearerToken(req) {
  const authorization = req.get("authorization");
  if (!authorization?.startsWith("Bearer ")) return null;
  return authorization.slice(7).trim() || null;
}
var AuthService = class {
  async authenticateRequest(req) {
    const token = bearerToken(req);
    if (!token || !ENV.supabaseUrl || !ENV.supabasePublishableKey) {
      throw ForbiddenError("Invalid session");
    }
    const supabase = createClient2(ENV.supabaseUrl, ENV.supabasePublishableKey, {
      auth: { persistSession: false, autoRefreshToken: false }
    });
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data.user) throw ForbiddenError("Invalid session");
    const authUser = data.user;
    const email = authUser.email ?? null;
    const role = authUser.app_metadata?.role === "admin" || (email ? ENV.adminEmails.includes(email.toLowerCase()) : false) ? "admin" : "user";
    const name = role === "admin" && email?.toLowerCase() === "andreapelliccioni12@gmail.com" ? "Arianna Pelliccioni" : typeof authUser.user_metadata?.name === "string" && authUser.user_metadata.name.trim() || email?.split("@")[0] || "Utente";
    const now = /* @__PURE__ */ new Date();
    if (ENV.databaseUrl) {
      await upsertUser({
        openId: authUser.id,
        name,
        email,
        loginMethod: "supabase",
        role,
        lastSignedIn: now
      });
      const storedUser = await getUserByOpenId(authUser.id);
      if (storedUser) return storedUser;
    }
    return {
      id: 0,
      openId: authUser.id,
      name,
      email,
      loginMethod: "supabase",
      role,
      createdAt: now,
      updatedAt: now,
      lastSignedIn: now
    };
  }
};
var sdk = new AuthService();

// server/_core/context.ts
async function createContext(opts) {
  let user = null;
  try {
    user = await sdk.authenticateRequest(opts.req);
  } catch (error) {
    user = null;
  }
  return {
    req: opts.req,
    res: opts.res,
    user
  };
}

// server/_core/app.ts
function createApp() {
  const app = express();
  app.set("trust proxy", 1);
  app.use(express.json({ limit: "4mb" }));
  app.use(express.urlencoded({ limit: "4mb", extended: true }));
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext
    })
  );
  app.get("/api/health", (_req, res) => {
    res.status(200).json({ ok: true });
  });
  return app;
}

// server/vercel.ts
var vercel_default = createApp();
export {
  vercel_default as default
};
