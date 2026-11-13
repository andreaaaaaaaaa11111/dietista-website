import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(userId: number = 1): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: userId,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "oauth",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };

  return { ctx };
}

describe("User Preferences", () => {
  it("should update user preferences", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.userPreferences.update({
      theme: "dark",
      weight: 70,
      height: 175,
    });

    expect(result).toEqual({ success: true });
  });

  it("should get user preferences", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // First set preferences
    await caller.userPreferences.update({
      theme: "light",
      weight: 65,
      height: 170,
    });

    // Then get them
    const prefs = await caller.userPreferences.get();
    
    expect(prefs).toBeDefined();
    if (prefs) {
      expect(prefs.theme).toBe("light");
      expect(prefs.weight).toBe(65);
      expect(prefs.height).toBe(170);
    }
  });
});

describe("Blog Likes", () => {
  it("should toggle like on a blog post", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    
    // Ensure user exists
    await caller.system.healthCheck();

    // First like
    const result1 = await caller.blogLikes.toggle({ postId: 1 });
    expect(result1.liked).toBe(true);

    // Then unlike
    const result2 = await caller.blogLikes.toggle({ postId: 1 });
    expect(result2.liked).toBe(false);
  });

  it("should get user's liked posts", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // Like some posts
    await caller.blogLikes.toggle({ postId: 1 });
    await caller.blogLikes.toggle({ postId: 2 });

    // Get liked posts
    const likedPosts = await caller.blogLikes.myLikes();
    
    expect(Array.isArray(likedPosts)).toBe(true);
    expect(likedPosts.length).toBeGreaterThan(0);
  });
});

describe("Saved Posts", () => {
  it("should toggle save on a blog post", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    
    // Ensure user exists
    await caller.system.healthCheck();

    // First save
    const result1 = await caller.savedPosts.toggle({ postId: 1 });
    expect(result1.saved).toBe(true);

    // Then unsave
    const result2 = await caller.savedPosts.toggle({ postId: 1 });
    expect(result2.saved).toBe(false);
  });

  it("should get user's saved posts", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // Save some posts
    await caller.savedPosts.toggle({ postId: 1 });
    await caller.savedPosts.toggle({ postId: 2 });

    // Get saved posts
    const savedPosts = await caller.savedPosts.mySaved();
    
    expect(Array.isArray(savedPosts)).toBe(true);
  });

  it("should get user's saved post IDs", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // Save a post
    await caller.savedPosts.toggle({ postId: 1 });

    // Get saved post IDs
    const savedIds = await caller.savedPosts.mySavedIds();
    
    expect(Array.isArray(savedIds)).toBe(true);
    expect(savedIds).toContain(1);
  });
});
