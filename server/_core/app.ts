import express from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "../routers";
import { createContext } from "./context";

/**
 * Crea l'applicazione API senza aprire una porta.
 * In locale viene collegata al server Node; online viene eseguita come funzione Vercel.
 */
export function createApp() {
  const app = express();

  app.set("trust proxy", 1);
  app.use(express.json({ limit: "4mb" }));
  app.use(express.urlencoded({ limit: "4mb", extended: true }));
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    }),
  );

  app.get("/api/health", (_req, res) => {
    res.status(200).json({ ok: true });
  });

  return app;
}
