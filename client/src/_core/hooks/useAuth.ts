/**
 * Hook di autenticazione con Clerk (sostituisce Manus OAuth)
 * 
 * Usa Clerk per verificare lo stato di autenticazione.
 * I dati utente completi (con ruolo admin) vengono recuperati dal backend tRPC.
 */
import { useClerk, useUser } from "@clerk/clerk-react";
import { trpc } from "@/lib/trpc";
import { useCallback, useEffect, useMemo } from "react";

type UseAuthOptions = {
  redirectOnUnauthenticated?: boolean;
  redirectPath?: string;
};

export function useAuth(options?: UseAuthOptions) {
  const { redirectOnUnauthenticated = false, redirectPath = "/accedi" } =
    options ?? {};

  const { isLoaded: clerkLoaded, isSignedIn } = useUser();
  const { signOut } = useClerk();
  const utils = trpc.useUtils();

  // Recupera i dati utente dal backend (include ruolo admin)
  const meQuery = trpc.auth.me.useQuery(undefined, {
    retry: false,
    refetchOnWindowFocus: false,
    enabled: clerkLoaded && isSignedIn === true,
  });

  const logout = useCallback(async () => {
    try {
      await signOut();
      utils.auth.me.setData(undefined, null);
      await utils.auth.me.invalidate();
    } catch (error) {
      console.error("[Auth] Logout failed:", error);
    }
  }, [signOut, utils]);

  const state = useMemo(() => {
    const loading = !clerkLoaded || (isSignedIn === true && meQuery.isLoading);
    const user = meQuery.data ?? null;
    const isAuthenticated = clerkLoaded && isSignedIn === true && user !== null;

    return {
      user,
      loading,
      error: meQuery.error ?? null,
      isAuthenticated,
    };
  }, [
    clerkLoaded,
    isSignedIn,
    meQuery.data,
    meQuery.error,
    meQuery.isLoading,
  ]);

  useEffect(() => {
    if (!redirectOnUnauthenticated) return;
    if (state.loading) return;
    if (state.user) return;
    if (!clerkLoaded) return;
    if (isSignedIn) return; // Clerk è loggato ma il DB non ha ancora risposto
    if (typeof window === "undefined") return;
    if (window.location.pathname === redirectPath) return;

    window.location.href = redirectPath;
  }, [
    redirectOnUnauthenticated,
    redirectPath,
    state.loading,
    state.user,
    clerkLoaded,
    isSignedIn,
  ]);

  return {
    ...state,
    refresh: () => meQuery.refetch(),
    logout,
  };
}
