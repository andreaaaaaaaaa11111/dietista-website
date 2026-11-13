import { eq, desc, and, gte, lte, sql, or } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, 
  users,
  services,
  Service,
  InsertService,
  blogCategories,
  BlogCategory,
  InsertBlogCategory,
  blogPosts,
  BlogPost,
  InsertBlogPost,
  testimonials,
  Testimonial,
  InsertTestimonial,
  contactRequests,
  ContactRequest,
  InsertContactRequest,
  consultationRequests,
  ConsultationRequest,
  InsertConsultationRequest,
  blogLikes,
  BlogLike,
  InsertBlogLike,
  savedPosts,
  SavedPost,
  InsertSavedPost,
  userPreferences,
  UserPreference,
  InsertUserPreference,
  emailTemplates,
  EmailTemplate,
  InsertEmailTemplate,
  appSettings,
  AppSetting,
  InsertAppSetting,
  diets,
  Diet,
  InsertDiet,
  foodDiary,
  FoodDiaryEntry,
  InsertFoodDiaryEntry,
  bodyMeasurements,
  BodyMeasurement,
  InsertBodyMeasurement
} from "../drizzle/schema";

import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
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

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ===== SERVICES =====
export async function getAllServices() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(services).orderBy(services.order);
}

export async function getActiveServices() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(services).where(eq(services.active, true)).orderBy(services.order);
}

export async function getServiceById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(services).where(eq(services.id, id)).limit(1);
  return result[0];
}

export async function createService(service: InsertService) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(services).values(service);
  return result;
}

export async function updateService(id: number, service: Partial<InsertService>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(services).set(service).where(eq(services.id, id));
}

export async function deleteService(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(services).where(eq(services.id, id));
}

// ===== BLOG CATEGORIES =====
export async function getAllBlogCategories() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(blogCategories);
}

export async function createBlogCategory(category: InsertBlogCategory) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(blogCategories).values(category);
  return result;
}

// ===== BLOG POSTS =====
export async function getPublishedBlogPosts() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(blogPosts).where(eq(blogPosts.published, true)).orderBy(desc(blogPosts.publishedAt));
}

export async function getAllBlogPosts() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(blogPosts).orderBy(desc(blogPosts.createdAt));
}

export async function getBlogPostBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug)).limit(1);
  return result[0];
}

export async function getBlogPostById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(blogPosts).where(eq(blogPosts.id, id)).limit(1);
  return result[0];
}

export async function createBlogPost(post: InsertBlogPost) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(blogPosts).values(post);
  return result;
}

export async function updateBlogPost(id: number, post: Partial<InsertBlogPost>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(blogPosts).set(post).where(eq(blogPosts.id, id));
}

export async function deleteBlogPost(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(blogPosts).where(eq(blogPosts.id, id));
}

// ===== TESTIMONIALS =====
export async function getApprovedTestimonials() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(testimonials).where(eq(testimonials.approved, true)).orderBy(desc(testimonials.createdAt));
}

export async function getPublishedTestimonials() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(testimonials).where(eq(testimonials.approved, true)).orderBy(desc(testimonials.createdAt));
}

export async function getAllTestimonials() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(testimonials).orderBy(desc(testimonials.createdAt));
}

export async function createTestimonial(testimonial: InsertTestimonial) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(testimonials).values(testimonial);
  return result;
}

export async function updateTestimonial(id: number, testimonial: Partial<InsertTestimonial>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(testimonials).set(testimonial).where(eq(testimonials.id, id));
}

export async function deleteTestimonial(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(testimonials).where(eq(testimonials.id, id));
}

// ===== CONTACT REQUESTS =====
export async function getAllContactRequests() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(contactRequests).orderBy(desc(contactRequests.createdAt));
}

export async function createContactRequest(request: InsertContactRequest) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(contactRequests).values(request);
  return result;
}

export async function updateContactRequestStatus(id: number, status: "new" | "read" | "replied") {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(contactRequests).set({ status }).where(eq(contactRequests.id, id));
}

export async function deleteContactRequest(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(contactRequests).where(eq(contactRequests.id, id));
}

// ===== CONSULTATION REQUESTS =====
export async function getAllConsultationRequests() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(consultationRequests).orderBy(desc(consultationRequests.createdAt));
}

export async function getConsultationRequestById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(consultationRequests).where(eq(consultationRequests.id, id)).limit(1);
  return result[0];
}

export async function getConsultationRequestsByUserId(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(consultationRequests)
    .where(eq(consultationRequests.userId, userId))
    .orderBy(desc(consultationRequests.createdAt));
}

export async function getConsultationRequestsByUserIdOrEmail(userId: number, email: string) {
  const db = await getDb();
  if (!db) return [];
  const conditions = [];
  conditions.push(eq(consultationRequests.userId, userId));
  if (email) conditions.push(eq(consultationRequests.email, email));
  return await db.select().from(consultationRequests)
    .where(or(...conditions))
    .orderBy(desc(consultationRequests.createdAt));
}

export async function getUsersByEmail(email: string) {
  const db = await getDb();
  if (!db) return [];
  return await db.select({ id: users.id }).from(users)
    .where(eq(users.email, email));
}

export async function getConsultationRequestsByUserIdsOrEmail(userIds: number[], email: string) {
  const db = await getDb();
  if (!db) return [];
  const conditions = [];
  for (const uid of userIds) {
    conditions.push(eq(consultationRequests.userId, uid));
  }
  if (email) conditions.push(eq(consultationRequests.email, email));
  return await db.select().from(consultationRequests)
    .where(or(...conditions))
    .orderBy(desc(consultationRequests.createdAt));
}

export async function getConsultationRequestsByEmail(email: string) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(consultationRequests)
    .where(eq(consultationRequests.email, email))
    .orderBy(desc(consultationRequests.createdAt));
}

export async function createConsultationRequest(request: InsertConsultationRequest) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(consultationRequests).values(request);
  return result;
}

export async function updateConsultationRequest(id: number, request: Partial<InsertConsultationRequest>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(consultationRequests).set(request).where(eq(consultationRequests.id, id));
}

export async function deleteConsultationRequest(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(consultationRequests).where(eq(consultationRequests.id, id));
}


// ============= Blog Likes =============

export async function toggleBlogLike(userId: number, postId: number): Promise<{ liked: boolean }> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const existing = await db
    .select()
    .from(blogLikes)
    .where(and(eq(blogLikes.userId, userId), eq(blogLikes.postId, postId)))
    .limit(1);

  if (existing.length > 0) {
    // Unlike
    await db.delete(blogLikes).where(eq(blogLikes.id, existing[0]!.id));
    return { liked: false };
  } else {
    // Like
    await db.insert(blogLikes).values({ userId, postId });
    return { liked: true };
  }
}

export async function getUserBlogLikes(userId: number): Promise<number[]> {
  const db = await getDb();
  if (!db) return [];

  const likes = await db
    .select({ postId: blogLikes.postId })
    .from(blogLikes)
    .where(eq(blogLikes.userId, userId));

  return likes.map(l => l.postId);
}

export async function getBlogLikesCount(postId: number): Promise<number> {
  const db = await getDb();
  if (!db) return 0;

  const likes = await db
    .select()
    .from(blogLikes)
    .where(eq(blogLikes.postId, postId));

  return likes.length;
}

// ============= Saved Posts =============

export async function toggleSavedPost(userId: number, postId: number): Promise<{ saved: boolean }> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const existing = await db
    .select()
    .from(savedPosts)
    .where(and(eq(savedPosts.userId, userId), eq(savedPosts.postId, postId)))
    .limit(1);

  if (existing.length > 0) {
    // Remove from saved
    await db.delete(savedPosts).where(eq(savedPosts.id, existing[0]!.id));
    return { saved: false };
  } else {
    // Save
    await db.insert(savedPosts).values({ userId, postId });
    return { saved: true };
  }
}

export async function getUserSavedPosts(userId: number): Promise<BlogPost[]> {
  const db = await getDb();
  if (!db) return [];

  const saved = await db
    .select({
      post: blogPosts
    })
    .from(savedPosts)
    .innerJoin(blogPosts, eq(savedPosts.postId, blogPosts.id))
    .where(eq(savedPosts.userId, userId))
    .orderBy(desc(savedPosts.createdAt));

  return saved.map(s => s.post);
}

export async function getUserSavedPostIds(userId: number): Promise<number[]> {
  const db = await getDb();
  if (!db) return [];

  const saved = await db
    .select({ postId: savedPosts.postId })
    .from(savedPosts)
    .where(eq(savedPosts.userId, userId));

  return saved.map(s => s.postId);
}

// ============= User Preferences =============

export async function getUserPreferences(userId: number): Promise<UserPreference | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const prefs = await db
    .select()
    .from(userPreferences)
    .where(eq(userPreferences.userId, userId))
    .limit(1);

  return prefs[0];
}

export async function upsertUserPreferences(userId: number, preferences: Partial<InsertUserPreference>): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const existing = await getUserPreferences(userId);

  if (existing) {
    await db
      .update(userPreferences)
      .set(preferences)
      .where(eq(userPreferences.userId, userId));
  } else {
    await db.insert(userPreferences).values({
      userId,
      ...preferences
    });
  }
}

// ============= Email Templates =============

export async function getEmailTemplate(name: string): Promise<EmailTemplate | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const templates = await db
    .select()
    .from(emailTemplates)
    .where(eq(emailTemplates.name, name))
    .limit(1);

  return templates[0];
}

export async function getAllEmailTemplates(): Promise<EmailTemplate[]> {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(emailTemplates);
}

export async function upsertEmailTemplate(template: InsertEmailTemplate): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const existing = await getEmailTemplate(template.name);

  if (existing) {
    await db
      .update(emailTemplates)
      .set({
        subject: template.subject,
        body: template.body
      })
      .where(eq(emailTemplates.name, template.name));
  } else {
    await db.insert(emailTemplates).values(template);
  }
}

// ============= App Settings =============

export async function getAppSetting(key: string): Promise<AppSetting | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const settings = await db
    .select()
    .from(appSettings)
    .where(eq(appSettings.key, key))
    .limit(1);

  return settings[0];
}

export async function getAllAppSettings(): Promise<AppSetting[]> {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(appSettings);
}

export async function upsertAppSetting(key: string, value: string, description?: string): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const existing = await getAppSetting(key);

  if (existing) {
    await db
      .update(appSettings)
      .set({ value, description })
      .where(eq(appSettings.key, key));
  } else {
    await db.insert(appSettings).values({ key, value, description });
  }
}

export async function getAdminNotificationEmail(): Promise<AppSetting | undefined> {
  return await getAppSetting('ADMIN_NOTIFICATION_EMAIL');
}

export async function getConsultationRequestByToken(token: string): Promise<ConsultationRequest | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(consultationRequests)
    .where(eq(consultationRequests.verificationToken, token))
    .limit(1);

  return result[0];
}

export async function verifyConsultationEmail(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(consultationRequests)
    .set({
      emailVerified: true,
      verifiedAt: new Date(),
      status: "new"
    })
    .where(eq(consultationRequests.id, id));
}




// ============= Diets =============

export async function getDietByUserId(userId: number): Promise<Diet | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(diets)
    .where(and(eq(diets.userId, userId), eq(diets.isActive, true)))
    .orderBy(desc(diets.version))
    .limit(1);

  return result[0];
}

export async function getAllDiets(): Promise<Array<Diet & { userName: string | null; userEmail: string | null }>> {
  const db = await getDb();
  if (!db) return [];

  const result = await db
    .select({
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
      userEmail: users.email,
    })
    .from(diets)
    .leftJoin(users, eq(diets.userId, users.id))
    .where(eq(diets.isActive, true))
    .orderBy(desc(diets.updatedAt));

  return result;
}

export async function createOrUpdateDiet(userId: number, diet: Omit<InsertDiet, 'userId' | 'version' | 'isActive' | 'viewedAt'>): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Validazione esplicita
  if (!userId || typeof userId !== 'number') {
    throw new Error(`Invalid userId: ${userId}`);
  }

  // Trova l'ultima versione attiva
  const existing = await getDietByUserId(userId);

  if (existing) {
    // Disattiva la versione precedente
    await db
      .update(diets)
      .set({ isActive: false })
      .where(eq(diets.id, existing.id));
    
    // Crea nuova versione
    const insertData: any = {
      userId: Number(userId),
      title: diet.title,
      pdfUrl: diet.pdfUrl,
      fileKey: diet.fileKey,
      fileName: diet.fileName,
      fileSize: diet.fileSize,
      version: existing.version + 1,
      isActive: true,
      viewedAt: null, // Reset viewedAt per la nuova versione
    };
    
    await db.insert(diets).values(insertData);
  } else {
    // Prima dieta per questo utente
    const insertData: any = {
      userId: Number(userId),
      title: diet.title,
      pdfUrl: diet.pdfUrl,
      fileKey: diet.fileKey,
      fileName: diet.fileName,
      fileSize: diet.fileSize,
      version: 1,
      isActive: true,
      viewedAt: null,
    };
    
    await db.insert(diets).values(insertData);
  }
}

export async function deleteDiet(userId: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.delete(diets).where(eq(diets.userId, userId));
}

// ============= Users List =============

export async function getAllUsers(): Promise<Array<{ id: number; name: string | null; email: string | null; role: string }>> {
  const db = await getDb();
  if (!db) return [];

  const result = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
    })
    .from(users)
    .orderBy(users.name);

  return result;
}


// Get all diet versions for a user (history)
export async function getDietHistory(userId: number): Promise<Diet[]> {
  const db = await getDb();
  if (!db) return [];

  const result = await db
    .select()
    .from(diets)
    .where(eq(diets.userId, userId))
    .orderBy(desc(diets.version));

  return result;
}

// Mark diet as viewed by patient
export async function markDietAsViewed(dietId: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(diets)
    .set({ viewedAt: new Date() })
    .where(eq(diets.id, dietId));
}

// ===== FOOD DIARY =====

export async function getFoodDiaryByDate(userId: number, date: string): Promise<FoodDiaryEntry[]> {
  const db = await getDb();
  if (!db) return [];
  return await db
    .select()
    .from(foodDiary)
    .where(and(eq(foodDiary.userId, userId), eq(foodDiary.date, date)))
    .orderBy(foodDiary.mealType);
}

export async function getFoodDiaryByDateRange(userId: number, startDate: string, endDate: string): Promise<FoodDiaryEntry[]> {
  const db = await getDb();
  if (!db) return [];
  return await db
    .select()
    .from(foodDiary)
    .where(and(
      eq(foodDiary.userId, userId),
      gte(foodDiary.date, startDate),
      lte(foodDiary.date, endDate)
    ))
    .orderBy(desc(foodDiary.date), foodDiary.mealType);
}

export async function createFoodDiaryEntry(entry: InsertFoodDiaryEntry): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(foodDiary).values(entry);
}

export async function updateFoodDiaryEntry(id: number, data: Partial<InsertFoodDiaryEntry>): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(foodDiary).set(data).where(eq(foodDiary.id, id));
}

export async function deleteFoodDiaryEntry(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(foodDiary).where(eq(foodDiary.id, id));
}

// ===== BODY MEASUREMENTS =====

export async function getBodyMeasurements(userId: number, limit = 30): Promise<BodyMeasurement[]> {
  const db = await getDb();
  if (!db) return [];
  return await db
    .select()
    .from(bodyMeasurements)
    .where(eq(bodyMeasurements.userId, userId))
    .orderBy(desc(bodyMeasurements.date))
    .limit(limit);
}

export async function createBodyMeasurement(measurement: InsertBodyMeasurement): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(bodyMeasurements).values(measurement);
}

export async function updateBodyMeasurement(id: number, data: Partial<InsertBodyMeasurement>): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(bodyMeasurements).set(data).where(eq(bodyMeasurements.id, id));
}

export async function deleteBodyMeasurement(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(bodyMeasurements).where(eq(bodyMeasurements.id, id));
}
