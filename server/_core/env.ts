export const ENV = {
  // Database (PlanetScale)
  databaseUrl: process.env.DATABASE_URL ?? "",

  // Auth (Clerk)
  clerkSecretKey: process.env.CLERK_SECRET_KEY ?? "",
  clerkWebhookSecret: process.env.CLERK_WEBHOOK_SECRET ?? "",

  // JWT per sessioni cookie
  cookieSecret: process.env.JWT_SECRET ?? "",

  // Cloudinary (Storage immagini)
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME ?? "",
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY ?? "",
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET ?? "",

  // Stripe
  stripeSecretKey: process.env.STRIPE_SECRET_KEY ?? "",
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET ?? "",

  // Email (SendGrid)
  sendgridApiKey: process.env.SENDGRID_API_KEY ?? "",

  // OpenAI (opzionale, per generazione articoli blog)
  openaiApiKey: process.env.OPENAI_API_KEY ?? "",

  // App
  isProduction: process.env.NODE_ENV === "production",
  ownerEmail: process.env.OWNER_EMAIL ?? "ariannapelliccioni@example.com",
};
