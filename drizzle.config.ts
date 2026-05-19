import { defineConfig } from "drizzle-kit";

const rawUrl = process.env.DATABASE_URL;
if (!rawUrl) {
  throw new Error("DATABASE_URL is required to run drizzle commands");
}
// TiDB Serverless richiede SSL: aggiungere il parametro ssl nella URL se non presente
const connectionString = rawUrl.includes('ssl') ? rawUrl : `${rawUrl}${rawUrl.includes('?') ? '&' : '?'}ssl={"rejectUnauthorized":true}`;

export default defineConfig({
  schema: "./drizzle/schema.ts",
  out: "./drizzle",
  dialect: "mysql",
  dbCredentials: {
    url: connectionString,
    ssl: {
      rejectUnauthorized: true,
    },
  },
});
