import { createClient } from "@supabase/supabase-js";
import type { Request } from "express";
import { ENV } from "./_core/env";

type JsonRow = Record<string, any>;

export function requestAccessToken(req: Request): string | undefined {
  const authorization = req.get("authorization");
  if (!authorization?.startsWith("Bearer ")) return undefined;
  return authorization.slice(7).trim() || undefined;
}

function client(accessToken?: string) {
  if (!ENV.supabaseUrl || !ENV.supabasePublishableKey) {
    throw new Error("Supabase non configurato");
  }

  return createClient(ENV.supabaseUrl, ENV.supabasePublishableKey, {
    global: accessToken
      ? { headers: { Authorization: `Bearer ${accessToken}` } }
      : undefined,
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

function assertOk(error: { message: string } | null) {
  if (error) throw new Error(error.message);
}

function serviceFromRow(row: JsonRow) {
  return {
    id: Number(row.id),
    title: row.title,
    description: row.description,
    duration: Number(row.duration),
    price: Number(row.price),
    active: Boolean(row.active),
    order: Number(row.display_order),
    createdAt: row.created_at ? new Date(row.created_at) : new Date(),
    updatedAt: row.updated_at ? new Date(row.updated_at) : new Date(),
  };
}

function consultationFromRow(row: JsonRow) {
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
    updatedAt: new Date(row.updated_at),
  };
}

function contactFromRow(row: JsonRow) {
  return {
    id: Number(row.id),
    name: row.name,
    email: row.email,
    phone: row.phone,
    consultationType: row.consultation_type,
    message: row.message,
    status: row.status,
    createdAt: new Date(row.created_at),
  };
}

function testimonialFromRow(row: JsonRow) {
  return {
    id: Number(row.id),
    userId: null,
    name: row.name,
    email: row.email,
    content: row.content,
    rating: Number(row.rating),
    imageUrl: row.image_url,
    approved: Boolean(row.approved),
    createdAt: new Date(row.created_at),
  };
}

export async function getActiveServices() {
  const { data, error } = await client()
    .from("services")
    .select("*")
    .eq("active", true)
    .order("display_order", { ascending: true });
  assertOk(error);
  return (data ?? []).map(serviceFromRow);
}

export async function getAllServices(accessToken: string) {
  const { data, error } = await client(accessToken)
    .from("services")
    .select("*")
    .order("display_order", { ascending: true });
  assertOk(error);
  return (data ?? []).map(serviceFromRow);
}

export async function getServiceById(id: number) {
  const { data, error } = await client().from("services").select("*").eq("id", id).maybeSingle();
  assertOk(error);
  return data ? serviceFromRow(data) : undefined;
}

export async function createService(accessToken: string, input: JsonRow) {
  const { error } = await client(accessToken).from("services").insert({
    title: input.title,
    description: input.description,
    duration: input.duration,
    price: input.price,
    active: input.active ?? true,
    display_order: input.order ?? 0,
  });
  assertOk(error);
}

export async function updateService(accessToken: string, id: number, input: JsonRow) {
  const values: JsonRow = { ...input };
  if ("order" in values) {
    values.display_order = values.order;
    delete values.order;
  }
  const { error } = await client(accessToken).from("services").update(values).eq("id", id);
  assertOk(error);
}

export async function createConsultationRequest(
  accessToken: string | undefined,
  input: JsonRow,
  userUid?: string,
) {
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
    privacy_consent_date: new Date().toISOString(),
    status: "new",
  });
  assertOk(error);
}

export async function getAllConsultationRequests(accessToken: string) {
  const { data, error } = await client(accessToken)
    .from("consultation_requests")
    .select("*")
    .order("created_at", { ascending: false });
  assertOk(error);
  return (data ?? []).map(consultationFromRow);
}

export async function getMyConsultations(accessToken: string) {
  const { data, error } = await client(accessToken)
    .from("consultation_requests")
    .select("*")
    .order("created_at", { ascending: false });
  assertOk(error);
  return (data ?? []).map(consultationFromRow);
}

export async function getConsultationRequestById(accessToken: string, id: number) {
  const { data, error } = await client(accessToken)
    .from("consultation_requests")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  assertOk(error);
  return data ? consultationFromRow(data) : undefined;
}

export async function updateConsultationStatus(accessToken: string, id: number, status: string) {
  const { error } = await client(accessToken)
    .from("consultation_requests")
    .update({ status })
    .eq("id", id);
  assertOk(error);
}

export async function deleteConsultationRequest(accessToken: string, id: number) {
  const { error } = await client(accessToken).from("consultation_requests").delete().eq("id", id);
  assertOk(error);
}

export async function createContactRequest(accessToken: string | undefined, input: JsonRow) {
  const { error } = await client(accessToken).from("contact_requests").insert({
    name: input.name,
    email: input.email,
    phone: input.phone || null,
    consultation_type: input.consultationType || null,
    message: input.message,
    status: "new",
  });
  assertOk(error);
}

export async function getAllContactRequests(accessToken: string) {
  const { data, error } = await client(accessToken)
    .from("contact_requests")
    .select("*")
    .order("created_at", { ascending: false });
  assertOk(error);
  return (data ?? []).map(contactFromRow);
}

export async function updateContactRequestStatus(accessToken: string, id: number, status: string) {
  const { error } = await client(accessToken).from("contact_requests").update({ status }).eq("id", id);
  assertOk(error);
}

export async function deleteContactRequest(accessToken: string, id: number) {
  const { error } = await client(accessToken).from("contact_requests").delete().eq("id", id);
  assertOk(error);
}

export async function getPublishedTestimonials() {
  const { data, error } = await client()
    .from("testimonials")
    .select("*")
    .eq("approved", true)
    .order("created_at", { ascending: false });
  assertOk(error);
  return (data ?? []).map(testimonialFromRow);
}

export async function getAllTestimonials(accessToken: string) {
  const { data, error } = await client(accessToken)
    .from("testimonials")
    .select("*")
    .order("created_at", { ascending: false });
  assertOk(error);
  return (data ?? []).map(testimonialFromRow);
}

export async function createTestimonial(accessToken: string, input: JsonRow, userUid?: string) {
  const { error } = await client(accessToken).from("testimonials").insert({
    user_uid: userUid ?? null,
    name: input.name,
    email: input.email || null,
    content: input.content,
    rating: input.rating,
    approved: Boolean(input.approved),
  });
  assertOk(error);
}

export async function updateTestimonial(accessToken: string, id: number, input: JsonRow) {
  const { error } = await client(accessToken).from("testimonials").update(input).eq("id", id);
  assertOk(error);
}

export async function deleteTestimonial(accessToken: string, id: number) {
  const { error } = await client(accessToken).from("testimonials").delete().eq("id", id);
  assertOk(error);
}

export async function trackEvent(
  accessToken: string | undefined,
  input: { eventType: "page_view" | "booking_submitted" | "contact_submitted"; path: string; serviceId?: number },
  userUid?: string,
) {
  const { error } = await client(accessToken).from("site_events").insert({
    user_uid: userUid ?? null,
    event_type: input.eventType,
    path: input.path.slice(0, 500),
    service_id: input.serviceId ?? null,
  });
  assertOk(error);
}

export async function getDashboardStats(accessToken: string) {
  const db = client(accessToken);
  const since = new Date();
  since.setDate(since.getDate() - 6);
  since.setHours(0, 0, 0, 0);

  const [consultationsResult, contactsResult, testimonialsResult, profilesResult, eventsResult, servicesResult] =
    await Promise.all([
      db.from("consultation_requests").select("*").order("created_at", { ascending: false }),
      db.from("contact_requests").select("*").order("created_at", { ascending: false }),
      db.from("testimonials").select("*"),
      db.from("profiles").select("id, role"),
      db.from("site_events").select("event_type, path, service_id, created_at").gte("created_at", since.toISOString()),
      db.from("services").select("id, title"),
    ]);

  for (const result of [consultationsResult, contactsResult, testimonialsResult, profilesResult, eventsResult, servicesResult]) {
    assertOk(result.error);
  }

  const consultations = consultationsResult.data ?? [];
  const contacts = contactsResult.data ?? [];
  const testimonials = testimonialsResult.data ?? [];
  const profiles = profilesResult.data ?? [];
  const events = eventsResult.data ?? [];
  const services = new Map((servicesResult.data ?? []).map(row => [Number(row.id), row.title]));

  const daily = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(since);
    date.setDate(since.getDate() + index);
    return { date: date.toISOString().slice(0, 10), visits: 0, requests: 0 };
  });
  const dailyMap = new Map(daily.map(day => [day.date, day]));
  for (const event of events) {
    const day = dailyMap.get(String(event.created_at).slice(0, 10));
    if (day && event.event_type === "page_view") day.visits += 1;
  }
  for (const request of consultations) {
    const day = dailyMap.get(String(request.created_at).slice(0, 10));
    if (day) day.requests += 1;
  }

  const serviceCounts = new Map<number, number>();
  for (const request of consultations) {
    if (request.service_id == null) continue;
    const id = Number(request.service_id);
    serviceCounts.set(id, (serviceCounts.get(id) ?? 0) + 1);
  }

  return {
    summary: {
      consultations: consultations.length,
      newConsultations: consultations.filter(row => row.status === "new").length,
      contacts: contacts.length,
      unreadContacts: contacts.filter(row => row.status === "new").length,
      approvedTestimonials: testimonials.filter(row => row.approved).length,
      registeredUsers: profiles.filter(row => row.role === "user").length,
      pageViews: events.filter(row => row.event_type === "page_view").length,
    },
    daily,
    topServices: Array.from(serviceCounts.entries())
      .map(([id, count]) => ({ id, title: services.get(id) ?? `Servizio ${id}`, count }))
      .sort((a, b) => b.count - a.count),
    recentConsultations: consultations.slice(0, 5).map(consultationFromRow),
  };
}
