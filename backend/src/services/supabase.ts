import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { env } from "../config/env.js";

let client: SupabaseClient | null = null;

/**
 * Server-side Supabase client (bootstrap only).
 *
 * Wired up lazily so the backend runs cleanly before Supabase credentials
 * are provided. Uses the anon key by default and the service role key only
 * for server-to-server operations that require elevated privileges.
 */
export function getSupabase(): SupabaseClient | null {
  if (client) return client;
  if (!env.supabase.url || (!env.supabase.anonKey && !env.supabase.serviceRoleKey)) {
    return null;
  }
  client = createClient(env.supabase.url, env.supabase.serviceRoleKey || env.supabase.anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
  return client;
}