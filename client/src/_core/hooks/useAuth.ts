import { getLoginUrl } from "@/const";
import { supabase } from "@/lib/supabase";
import { trpc } from "@/lib/trpc";
import type { Session } from "@supabase/supabase-js";
import { useCallback, useEffect, useMemo, useState } from "react";

type UseAuthOptions = {
  redirectOnUnauthenticated?: boolean;
  redirectPath?: string;
};

export function useAuth(options?: UseAuthOptions) {
  const { redirectOnUnauthenticated = false, redirectPath = getLoginUrl() } = options ?? {};
  const [session, setSession] = useState<Session | null>(null);
  const [initialized, setInitialized] = useState(false);
  const utils = trpc.useUtils();

  useEffect(() => {
    let active = true;
    if (!supabase) {
      setInitialized(true);
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setSession(data.session);
      setInitialized(true);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setInitialized(true);
      void utils.auth.me.invalidate();
    });
    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, [utils.auth.me]);

  const meQuery = trpc.auth.me.useQuery(undefined, {
    enabled: initialized && Boolean(session),
    retry: false,
    refetchOnWindowFocus: false,
  });

  const logout = useCallback(async () => {
    if (supabase) await supabase.auth.signOut();
    setSession(null);
    utils.auth.me.setData(undefined, null);
    await utils.auth.me.invalidate();
  }, [utils]);

  const state = useMemo(() => {
    const user = session ? (meQuery.data ?? null) : null;
    localStorage.setItem("dietista-user-info", JSON.stringify(user));
    return {
      user,
      loading: !initialized || (Boolean(session) && meQuery.isLoading),
      error: meQuery.error ?? null,
      isAuthenticated: Boolean(user),
    };
  }, [initialized, meQuery.data, meQuery.error, meQuery.isLoading, session]);

  useEffect(() => {
    if (!redirectOnUnauthenticated || state.loading || state.user) return;
    if (window.location.pathname === "/accedi") return;
    window.location.href = redirectPath;
  }, [redirectOnUnauthenticated, redirectPath, state.loading, state.user]);

  return { ...state, refresh: () => meQuery.refetch(), logout };
}
