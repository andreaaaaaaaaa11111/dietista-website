import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

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

function createAdminContext(): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "admin-user",
    email: "admin@dietista.it",
    name: "Admin User",
    loginMethod: "oauth",
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

describe("Services procedures", () => {
  it("should list active services for public users", async () => {
    const { ctx } = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.services.list();

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
    
    // Verify all returned services are active
    result.forEach((service) => {
      expect(service.active).toBe(true);
      expect(service.price).toBeGreaterThan(0);
      expect(service.duration).toBeGreaterThan(0);
    });
  });

  it("should get service by id", async () => {
    const { ctx } = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    // First get list of services
    const services = await caller.services.list();
    
    if (services.length > 0) {
      const firstService = services[0];
      const result = await caller.services.getById({ id: firstService.id });

      expect(result).toBeDefined();
      expect(result?.id).toBe(firstService.id);
      expect(result?.title).toBe(firstService.title);
    }
  });
});

describe("Appointments procedures", () => {
  it("should check availability for a future date", async () => {
    const { ctx } = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    // Get a service first
    const services = await caller.services.list();
    expect(services.length).toBeGreaterThan(0);

    const serviceId = services[0].id;
    
    // Check availability for tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const result = await caller.appointments.checkAvailability({
      date: tomorrow,
      serviceId,
    });

    expect(result).toBeDefined();
    expect(Array.isArray(result.availableSlots)).toBe(true);
  });
});

describe("Testimonials procedures", () => {
  it("should list approved testimonials for public users", async () => {
    const { ctx } = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.testimonials.listApproved();

    expect(Array.isArray(result)).toBe(true);
    
    // Verify all returned testimonials are approved
    result.forEach((testimonial) => {
      expect(testimonial.approved).toBe(true);
      expect(testimonial.rating).toBeGreaterThanOrEqual(1);
      expect(testimonial.rating).toBeLessThanOrEqual(5);
    });
  });
});
