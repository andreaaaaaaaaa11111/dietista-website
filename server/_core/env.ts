export const ENV = {
  appId: process.env.APP_ID ?? "dietista-website",
  databaseUrl: process.env.DATABASE_URL ?? "",
  ownerOpenId: process.env.OWNER_USER_ID ?? "",
  ownerEmail: process.env.OWNER_EMAIL ?? "pelliccioniarianna.dietista@gmail.com",
  supabaseUrl:
    process.env.SUPABASE_URL ||
    process.env.VITE_SUPABASE_URL ||
    "https://zrdmcgixgagjippeebhs.supabase.co",
  supabasePublishableKey:
    process.env.SUPABASE_PUBLISHABLE_KEY ||
    process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
    "sb_publishable_BogAD2zmTGJfrBvEBxBVSg_NT02P-HG",
  adminEmails: (process.env.ADMIN_EMAILS ?? process.env.OWNER_EMAIL ?? "")
    .split(",")
    .map(email => email.trim().toLowerCase())
    .filter(Boolean),
  isProduction: process.env.NODE_ENV === "production",
  localAiUrl: process.env.LOCAL_AI_URL ?? "http://127.0.0.1:11434",
  localAiModel: process.env.LOCAL_AI_MODEL ?? "llama3.2",
  resendApiKey: process.env.RESEND_API_KEY ?? "",
  emailFrom: process.env.EMAIL_FROM ?? "",
  s3Bucket: process.env.S3_BUCKET ?? "",
  s3Region: process.env.S3_REGION ?? "eu-central-1",
  s3Endpoint: process.env.S3_ENDPOINT ?? "",
  s3PublicUrl: process.env.S3_PUBLIC_URL ?? "",
};
