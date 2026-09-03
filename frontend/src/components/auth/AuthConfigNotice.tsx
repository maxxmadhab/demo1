import { isSupabaseConfigured } from "@/lib/supabase";

export function AuthConfigNotice() {
  if (isSupabaseConfigured) return null;

  return (
    <div className="mb-6 border border-amber-300 bg-amber-50 px-4 py-3 font-body text-sm text-amber-800">
      <strong className="font-medium">Supabase is not configured.</strong> Add
      <code className="mx-1 rounded bg-amber-100 px-1 font-mono text-xs">
        VITE_SUPABASE_URL
      </code>
      and
      <code className="mx-1 rounded bg-amber-100 px-1 font-mono text-xs">
        VITE_SUPABASE_PUBLISHABLE_KEY
      </code>
      to your Vercel project Environment Variables, then redeploy (clear build cache).
    </div>
  );
}
