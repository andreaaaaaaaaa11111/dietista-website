import { beforeEach, describe, expect, it, vi } from "vitest";
import { DEFAULT_SERVICES } from "../shared/services";
import { BETTER_NOTICE, getBetterOffers } from "../shared/betterOffers";
import type { TrpcContext } from "./_core/context";

vi.mock("./supabaseDb", () => ({
  requestAccessToken: vi.fn(() => undefined),
  getActiveServices: vi.fn(),
  createConsultationRequest: vi.fn(),
  createContactRequest: vi.fn(),
  trackEvent: vi.fn(),
}));
import * as db from "./supabaseDb";
import { appRouter } from "./routers";

const context = { user: null, req: { headers: {} }, res: {} } as TrpcContext;
const booking = { name: "Test", email: "test@example.com", privacyConsent: true, message: "Nota paziente" };

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(db.getActiveServices).mockResolvedValue(DEFAULT_SERVICES);
});

describe("Better booking flow", () => {
  it.each(getBetterOffers())("records $label with its standard service id and promotional price", async offer => {
    await appRouter.createCaller(context).consultations.submit({ ...booking, serviceId: 999, betterOffer: offer.key });
    expect(db.createConsultationRequest).toHaveBeenCalledWith(undefined, expect.objectContaining({
      serviceId: offer.source.id,
      message: expect.stringContaining(`${offer.label} — €${(offer.price / 100).toFixed(2)}`),
    }), undefined);
    const saved = vi.mocked(db.createConsultationRequest).mock.calls[0][1];
    expect(saved.message).toContain(BETTER_NOTICE);
    expect(saved.message).toContain("Nota paziente");
    expect(saved).not.toHaveProperty("betterOffer");
  });

  it("keeps normal requests unchanged", async () => {
    await appRouter.createCaller(context).consultations.submit({ ...booking, serviceId: 1 });
    expect(db.getActiveServices).not.toHaveBeenCalled();
    expect(db.createConsultationRequest).toHaveBeenCalledWith(undefined, { ...booking, serviceId: 1 }, undefined);
  });

  it("uses live ids and the standard BIA price", () => {
    const catalog = DEFAULT_SERVICES.map(service => ({ ...service, id: service.id + 100, price: 2500 }));
    const offers = getBetterOffers(catalog);
    expect(offers.map(offer => offer.price)).toEqual([7500, 4000, 2500]);
    expect(offers.map(offer => offer.source.id)).toEqual([101, 102, 106]);
  });

  it("keeps the Better selection in contact requests", async () => {
    await appRouter.createCaller(context).contact.submit({ name: "Test", email: "test@example.com", message: "Informazioni", consultationType: "Better Club — Prima visita" });
    expect(db.createContactRequest).toHaveBeenCalledWith(undefined, expect.objectContaining({ consultationType: "Better Club — Prima visita" }));
  });

  it("rejects unknown promotions", async () => {
    await expect(appRouter.createCaller(context).consultations.submit({ ...booking, betterOffer: "better-fake" as never })).rejects.toThrow();
    expect(db.createConsultationRequest).not.toHaveBeenCalled();
  });
});
