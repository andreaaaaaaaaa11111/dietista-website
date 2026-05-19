import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, decimal } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Servizi offerti dalla dietista
 */
export const services = mysqlTable("services", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  duration: int("duration").notNull(), // durata in minuti
  price: int("price").notNull(), // prezzo in centesimi (es. 5000 = 50.00€)
  active: boolean("active").default(true).notNull(),
  order: int("order").default(0).notNull(), // per ordinamento visualizzazione
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Service = typeof services.$inferSelect;
export type InsertService = typeof services.$inferInsert;

/**
 * Categorie per gli articoli del blog
 */
export const blogCategories = mysqlTable("blog_categories", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  description: text("description"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type BlogCategory = typeof blogCategories.$inferSelect;
export type InsertBlogCategory = typeof blogCategories.$inferInsert;

/**
 * Articoli del blog
 */
export const blogPosts = mysqlTable("blog_posts", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  content: text("content").notNull(),
  excerpt: text("excerpt"), // breve descrizione per anteprima
  imageUrl: varchar("imageUrl", { length: 500 }),
  imageKey: varchar("imageKey", { length: 500 }), // chiave S3 per l'immagine
  categoryId: int("categoryId").references(() => blogCategories.id),
  published: boolean("published").default(false).notNull(),
  publishedAt: timestamp("publishedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = typeof blogPosts.$inferInsert;

/**
 * Commenti agli articoli del blog
 */
export const blogComments = mysqlTable("blog_comments", {
  id: int("id").autoincrement().primaryKey(),
  postId: int("postId").notNull().references(() => blogPosts.id),
  userId: int("userId").notNull().references(() => users.id),
  parentId: int("parentId"), // ID del commento padre per le risposte (null = commento principale)
  content: text("content").notNull(),
  isAdminReply: boolean("isAdminReply").default(false).notNull(), // true se è una risposta della dietista
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type BlogComment = typeof blogComments.$inferSelect;
export type InsertBlogComment = typeof blogComments.$inferInsert;

/**
 * Testimonianze dei clienti
 */
export const testimonials = mysqlTable("testimonials", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"), // collegamento all'utente (opzionale per recensioni manuali)
  name: varchar("name", { length: 100 }).notNull(),
  email: varchar("email", { length: 320 }), // email per contatto
  content: text("content").notNull(),
  rating: int("rating").notNull(), // 1-5 stelle
  imageUrl: varchar("imageUrl", { length: 500 }),
  approved: boolean("approved").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Testimonial = typeof testimonials.$inferSelect;
export type InsertTestimonial = typeof testimonials.$inferInsert;

/**
 * Richieste di contatto
 */
export const contactRequests = mysqlTable("contact_requests", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  consultationType: varchar("consultationType", { length: 100 }),
  message: text("message").notNull(),
  status: mysqlEnum("status", ["new", "read", "replied"]).default("new").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ContactRequest = typeof contactRequests.$inferSelect;
export type InsertContactRequest = typeof contactRequests.$inferInsert;

/**
 * Richieste di consulenza (sostituisce appuntamenti con pagamento)
 */
export const consultationRequests = mysqlTable("consultation_requests", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").references(() => users.id),
  serviceId: int("serviceId").references(() => services.id),
  // Dati cliente
  name: varchar("name", { length: 100 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  // Questionario
  age: int("age"),
  weight: int("weight"), // in kg
  height: int("height"), // in cm
  goal: text("goal"), // obiettivo nutrizionale
  medicalConditions: text("medicalConditions"), // condizioni mediche
  allergies: text("allergies"), // allergie/intolleranze
  currentDiet: text("currentDiet"), // alimentazione attuale
  message: text("message"), // messaggio aggiuntivo
  privacyConsent: boolean("privacyConsent").default(false).notNull(), // consenso trattamento dati
  privacyConsentDate: timestamp("privacyConsentDate"), // data consenso
  // Verifica email
  emailVerified: boolean("emailVerified").default(false).notNull(),
  verificationToken: varchar("verificationToken", { length: 64 }),
  verifiedAt: timestamp("verifiedAt"),
  // Stato richiesta
  status: mysqlEnum("status", ["pending_verification", "new", "contacted", "scheduled", "completed"]).default("pending_verification").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ConsultationRequest = typeof consultationRequests.$inferSelect;
export type InsertConsultationRequest = typeof consultationRequests.$inferInsert;

/**
 * Like degli utenti agli articoli del blog
 */
export const blogLikes = mysqlTable("blog_likes", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  postId: int("postId").notNull().references(() => blogPosts.id),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type BlogLike = typeof blogLikes.$inferSelect;
export type InsertBlogLike = typeof blogLikes.$inferInsert;

/**
 * Articoli salvati dagli utenti
 */
export const savedPosts = mysqlTable("saved_posts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  postId: int("postId").notNull().references(() => blogPosts.id),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type SavedPost = typeof savedPosts.$inferSelect;
export type InsertSavedPost = typeof savedPosts.$inferInsert;

/**
 * Preferenze utente (tema, impostazioni)
 */
export const userPreferences = mysqlTable("user_preferences", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique().references(() => users.id),
  theme: mysqlEnum("theme", ["light", "dark", "system"]).default("system").notNull(),
  // Dati BMI
  weight: int("weight"), // peso in kg
  height: int("height"), // altezza in cm
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type UserPreference = typeof userPreferences.$inferSelect;
export type InsertUserPreference = typeof userPreferences.$inferInsert;

/**
 * Template email personalizzabili
 */
export const emailTemplates = mysqlTable("email_templates", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(), // es. "consultation_confirmation"
  subject: varchar("subject", { length: 255 }).notNull(),
  body: text("body").notNull(), // supporta placeholder come {{name}}, {{email}}, {{phone}}
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type EmailTemplate = typeof emailTemplates.$inferSelect;
export type InsertEmailTemplate = typeof emailTemplates.$inferInsert;

/**
 * Diete personali per i pazienti
 */
export const diets = mysqlTable("diets", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id), // rimosso unique per permettere multiple versioni
  title: varchar("title", { length: 255 }).notNull(), // es. "Dieta Personalizzata - Gennaio 2025"
  pdfUrl: text("pdfUrl").notNull(), // URL pubblico del PDF su S3
  fileKey: text("fileKey").notNull(), // chiave del file su S3 per gestione
  fileName: varchar("fileName", { length: 255 }).notNull(), // nome originale del file
  fileSize: int("fileSize").notNull(), // dimensione file in bytes
  version: int("version").notNull().default(1), // numero versione incrementale
  isActive: boolean("isActive").notNull().default(true), // solo l'ultima versione è attiva
  viewedAt: timestamp("viewedAt"), // quando il paziente ha visualizzato la dieta
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Diet = typeof diets.$inferSelect;
export type InsertDiet = typeof diets.$inferInsert;

/**
 * Diario alimentare utente
 */
export const foodDiary = mysqlTable("food_diary", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  date: varchar("date", { length: 10 }).notNull(), // YYYY-MM-DD
  mealType: mysqlEnum("mealType", ["colazione", "spuntino_mattina", "pranzo", "spuntino_pomeriggio", "cena"]).notNull(),
  description: text("description").notNull(),
  calories: int("calories"), // calorie stimate (opzionale)
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type FoodDiaryEntry = typeof foodDiary.$inferSelect;
export type InsertFoodDiaryEntry = typeof foodDiary.$inferInsert;

/**
 * Misurazioni corporee utente (tracker peso e misure)
 */
export const bodyMeasurements = mysqlTable("body_measurements", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  date: varchar("date", { length: 10 }).notNull(), // YYYY-MM-DD
  weight: int("weight"), // peso in kg * 10 (es. 705 = 70.5 kg)
  waist: int("waist"), // girovita in mm
  hips: int("hips"), // fianchi in mm
  chest: int("chest"), // petto in mm
  arm: int("arm"), // braccio in mm
  thigh: int("thigh"), // coscia in mm
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type BodyMeasurement = typeof bodyMeasurements.$inferSelect;
export type InsertBodyMeasurement = typeof bodyMeasurements.$inferInsert;

/**
 * Impostazioni globali applicazione
 */
export const appSettings = mysqlTable("app_settings", {
  id: int("id").autoincrement().primaryKey(),
  key: varchar("key", { length: 100 }).notNull().unique(), // es. "admin_notification_email"
  value: text("value").notNull(),
  description: text("description"),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type AppSetting = typeof appSettings.$inferSelect;
export type InsertAppSetting = typeof appSettings.$inferInsert;
