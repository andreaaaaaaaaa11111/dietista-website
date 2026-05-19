/**
 * Entry point dell'applicazione con Clerk (sostituisce Manus OAuth)
 * 
 * ClerkProvider gestisce l'autenticazione globalmente.
 * VITE_CLERK_PUBLISHABLE_KEY deve essere configurato nell'environment.
 */
import { ClerkProvider, useAuth as useClerkAuth } from "@clerk/clerk-react";
import { itIT } from "@clerk/localizations";
import { trpc } from "@/lib/trpc";
import { UNAUTHED_ERR_MSG } from "@shared/const";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink, TRPCClientError } from "@trpc/client";
import { createRoot } from "react-dom/client";
import { useState } from "react";
import superjson from "superjson";
import App from "./App";
import "./index.css";
import { HelmetProvider } from "react-helmet-async";

const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!CLERK_PUBLISHABLE_KEY) {
  console.warn(
    "[Clerk] VITE_CLERK_PUBLISHABLE_KEY non configurato. " +
    "Aggiungere la chiave pubblica Clerk nelle variabili d'ambiente."
  );
}

const queryClient = new QueryClient();

const redirectToLoginIfUnauthorized = (error: unknown) => {
  if (!(error instanceof TRPCClientError)) return;
  if (typeof window === "undefined") return;

  const isUnauthorized = error.message === UNAUTHED_ERR_MSG;
  if (!isUnauthorized) return;

  // Con Clerk, il redirect al login è gestito da ClerkProvider
  window.location.href = "/accedi";
};

queryClient.getQueryCache().subscribe(event => {
  if (event.type === "updated" && event.action.type === "error") {
    const error = event.query.state.error;
    redirectToLoginIfUnauthorized(error);
    console.error("[API Query Error]", error);
  }
});

queryClient.getMutationCache().subscribe(event => {
  if (event.type === "updated" && event.action.type === "error") {
    const error = event.mutation.state.error;
    redirectToLoginIfUnauthorized(error);
    console.error("[API Mutation Error]", error);
  }
});

/**
 * Inner component that has access to Clerk context for getting the token
 */
function AppWithTrpc() {
  const { getToken } = useClerkAuth();

  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: "/api/trpc",
          transformer: superjson,
          async headers() {
            // Invia il token Clerk nell'header Authorization
            const token = await getToken();
            return token ? { Authorization: `Bearer ${token}` } : {};
          },
        }),
      ],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <HelmetProvider>
          <App />
        </HelmetProvider>
      </QueryClientProvider>
    </trpc.Provider>
  );
}

createRoot(document.getElementById("root")!).render(
  <ClerkProvider
    publishableKey={CLERK_PUBLISHABLE_KEY || "pk_test_placeholder"}
    localization={itIT}
    signInUrl="/accedi"
    signUpUrl="/registrati"
    afterSignInUrl="/"
    afterSignUpUrl="/"
  >
    <AppWithTrpc />
  </ClerkProvider>
);
