import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { getDb } from "./db";
import * as db from "./db";
import { users, diets } from "../drizzle/schema";
import { eq } from "drizzle-orm";

describe("Diets System - PDF Upload", () => {
  let testUserId: number;

  beforeAll(async () => {
    // Create a test user
    const database = await getDb();
    if (!database) {
      throw new Error("Database not available");
    }

    const result = await database
      .insert(users)
      .values({
        openId: `test-user-${Date.now()}`,
        name: "Test User",
        email: "test@example.com",
        role: "user",
      });

    // Drizzle MySQL2 restituisce insertId come numero
    testUserId = Number(result[0].insertId);
    
    if (!testUserId || isNaN(testUserId)) {
      throw new Error(`Failed to create test user, got userId: ${testUserId}`);
    }
  });

  afterAll(async () => {
    // Cleanup
    const database = await getDb();
    if (!database) return;

    // Delete test diet
    await database.delete(diets).where(eq(diets.userId, testUserId));

    // Delete test user
    await database.delete(users).where(eq(users.id, testUserId));
  });

  it("should create a new diet with PDF info for a user", async () => {
    await db.createOrUpdateDiet(testUserId, {
      title: "Dieta Personalizzata - Test PDF",
      pdfUrl: "https://example.com/diets/test-123.pdf",
      fileKey: "diets/test-123.pdf",
      fileName: "dieta-test.pdf",
      fileSize: 102400, // 100KB
    });

    const diet = await db.getDietByUserId(testUserId);
    expect(diet).toBeDefined();
    expect(diet?.title).toBe("Dieta Personalizzata - Test PDF");
    expect(diet?.pdfUrl).toBe("https://example.com/diets/test-123.pdf");
    expect(diet?.fileKey).toBe("diets/test-123.pdf");
    expect(diet?.fileName).toBe("dieta-test.pdf");
    expect(diet?.fileSize).toBe(102400);
  });

  it("should update an existing diet with new PDF", async () => {
    // First create
    await db.createOrUpdateDiet(testUserId, {
      title: "Dieta Originale",
      pdfUrl: "https://example.com/diets/original.pdf",
      fileKey: "diets/original.pdf",
      fileName: "original.pdf",
      fileSize: 50000,
    });

    // Then update
    await db.createOrUpdateDiet(testUserId, {
      title: "Dieta Aggiornata",
      pdfUrl: "https://example.com/diets/updated.pdf",
      fileKey: "diets/updated.pdf",
      fileName: "updated.pdf",
      fileSize: 75000,
    });

    const diet = await db.getDietByUserId(testUserId);
    expect(diet?.title).toBe("Dieta Aggiornata");
    expect(diet?.pdfUrl).toBe("https://example.com/diets/updated.pdf");
    expect(diet?.fileName).toBe("updated.pdf");
    expect(diet?.fileSize).toBe(75000);
  });

  it("should retrieve diet by user ID", async () => {
    await db.createOrUpdateDiet(testUserId, {
      title: "Dieta Test Retrieve",
      pdfUrl: "https://example.com/diets/retrieve.pdf",
      fileKey: "diets/retrieve.pdf",
      fileName: "retrieve.pdf",
      fileSize: 60000,
    });

    const diet = await db.getDietByUserId(testUserId);
    expect(diet).toBeDefined();
    expect(diet?.userId).toBe(testUserId);
    expect(diet?.title).toBe("Dieta Test Retrieve");
  });

  it("should return undefined for non-existent user diet", async () => {
    const nonExistentUserId = 999999;
    const diet = await db.getDietByUserId(nonExistentUserId);
    expect(diet).toBeUndefined();
  });

  it("should get all diets", async () => {
    await db.createOrUpdateDiet(testUserId, {
      title: "Dieta Test All",
      pdfUrl: "https://example.com/diets/all.pdf",
      fileKey: "diets/all.pdf",
      fileName: "all.pdf",
      fileSize: 80000,
    });

    const allDiets = await db.getAllDiets();
    expect(allDiets.length).toBeGreaterThan(0);
    
    const testDiet = allDiets.find(d => d.userId === testUserId);
    expect(testDiet).toBeDefined();
    expect(testDiet?.title).toBe("Dieta Test All");
  });

  it("should delete a diet", async () => {
    await db.createOrUpdateDiet(testUserId, {
      title: "Dieta to Delete",
      pdfUrl: "https://example.com/diets/delete.pdf",
      fileKey: "diets/delete.pdf",
      fileName: "delete.pdf",
      fileSize: 40000,
    });

    let diet = await db.getDietByUserId(testUserId);
    expect(diet).toBeDefined();

    await db.deleteDiet(testUserId);

    diet = await db.getDietByUserId(testUserId);
    expect(diet).toBeUndefined();
  });

  it("should preserve timestamps", async () => {
    await db.createOrUpdateDiet(testUserId, {
      title: "Dieta con timestamp",
      pdfUrl: "https://example.com/diets/timestamp.pdf",
      fileKey: "diets/timestamp.pdf",
      fileName: "timestamp.pdf",
      fileSize: 55000,
    });

    const diet = await db.getDietByUserId(testUserId);
    expect(diet?.createdAt).toBeDefined();
    expect(diet?.updatedAt).toBeDefined();
    expect(diet?.createdAt).toBeInstanceOf(Date);
    expect(diet?.updatedAt).toBeInstanceOf(Date);
  });
});
