import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;

const isConfigured = Boolean(supabaseUrl && supabaseKey);

if (!isConfigured) {
  console.error(
    "Missing Supabase environment variables. " +
      "Add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY to the build environment " +
      "(frontend/.env locally, Vercel Environment Variables for production) and redeploy.",
  );
}

// Use valid placeholders so createClient never throws at import time. If the real
// env vars are missing, auth calls will fail gracefully (with a friendly message)
// instead of blanking the entire app on a module-load crash.
export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseKey || "sb_publishable_placeholder",
);

export const isSupabaseConfigured = isConfigured;
