import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { env } from "../config/env.js";

let serviceClient: SupabaseClient | null = null;
let anonClient: SupabaseClient | null = null;

/**
 * Server-side Supabase client using the service role key.
 * Used for elevated-privilege operations (admin verification, profile management).
 */
export function getSupabase(): SupabaseClient | null {
  if (serviceClient) return serviceClient;
  if (!env.supabase.url || (!env.supabase.anonKey && !env.supabase.serviceRoleKey)) {
    return null;
  }
  serviceClient = createClient(
    env.supabase.url,
    env.supabase.serviceRoleKey || env.supabase.anonKey,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
  return serviceClient;
}

/**
 * Server-side Supabase client using the anon key.
 * Used for verifying user auth tokens (JWTs) via supabase.auth.getUser().
 */
export function getSupabaseAnon(): SupabaseClient | null {
  if (anonClient) return anonClient;
  if (!env.supabase.url || !env.supabase.anonKey) {
    return null;
  }
  anonClient = createClient(env.supabase.url, env.supabase.anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return anonClient;
}