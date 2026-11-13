import { createClient } from "@supabase/supabase-js";

// URL e publishable key sono valori pubblici per definizione e possono essere
// inclusi nel client. Il fallback evita che un deploy perda l'accesso quando
// il provider di hosting non inoltra le variabili Vite durante la build.
const supabaseUrl = (
  import.meta.env.VITE_SUPABASE_URL || "https://zrdmcgixgagjippeebhs.supabase.co"
).trim();
const supabasePublishableKey = (
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  "sb_publishable_BogAD2zmTGJfrBvEBxBVSg_NT02P-HG"
).trim();

export const isSupabaseConfigured = Boolean(supabaseUrl && supabasePublishableKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabasePublishableKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;
