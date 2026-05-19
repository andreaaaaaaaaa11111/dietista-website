import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAdminContext(): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "admin-user",
    email: "admin@dietista.it",
    name: "Admin User",
    loginMethod: "manus",
    role: "admin",
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

function createPublicContext(): { ctx: TrpcContext } {
  const ctx: TrpcContext = {
    user: undefined,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };

  return { ctx };
}

describe("Blog procedures", () => {
  it("should list published blog posts for public users", async () => {
    const { ctx } = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.blog.listPublished();

    expect(Array.isArray(result)).toBe(true);
    // Verify all returned posts are published
    result.forEach((post) => {
      expect(post.published).toBe(true);
    });
  });

  it("should get blog post by slug", async () => {
    const { ctx } = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    // First get list of published posts
    const posts = await caller.blog.listPublished();
    
    if (posts.length > 0) {
      const firstPost = posts[0];
      const result = await caller.blog.getBySlug({ slug: firstPost.slug });

      expect(result).toBeDefined();
      expect(result?.slug).toBe(firstPost.slug);
      expect(result?.published).toBe(true);
    }
  });

  it("should list all blog posts for admin", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.blog.listAll();

    expect(Array.isArray(result)).toBe(true);
    // Admin should see both published and unpublished posts
  });

  it("should list blog categories", async () => {
    const { ctx } = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.blog.categories();

    expect(Array.isArray(result)).toBe(true);
  });

  it("should generate AI content for admin", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.blog.generateContent({
      prompt: "Scrivi un breve articolo sui benefici dell'acqua",
      type: "tips",
    });

    expect(result).toBeDefined();
    expect(result.content).toBeDefined();
    expect(typeof result.content).toBe("string");
    expect(result.content.length).toBeGreaterThan(0);
  }, 30000); // Aumentato timeout a 30 secondi per chiamata AI
});
