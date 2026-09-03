import { supabase } from "@/lib/supabase";
import type { Profile, AuthResult } from "@/types/auth";

const appOrigin = () =>
  (import.meta.env.VITE_SITE_URL as string | undefined)?.replace(/\/$/, "") ||
  window.location.origin;

export async function signIn(email: string, password: string): Promise<AuthResult> {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    if (error.message.includes("Invalid login")) {
      return { error: "Invalid email or password." };
    }
    if (error.message.includes("Email not confirmed")) {
      return { error: "Please verify your email before signing in." };
    }
    return { error: error.message };
  }
  return {};
}

export async function signUp(
  email: string,
  password: string,
  fullName: string,
): Promise<AuthResult> {
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } },
  });
  if (error) {
    if (error.message.includes("already registered")) {
      return { error: "An account with this email already exists." };
    }
    return { error: error.message };
  }
  return {};
}

export async function signInWithGoogle(): Promise<AuthResult> {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: appOrigin(),
      queryParams: { prompt: "select_account" },
    },
  });
  if (error) {
    return { error: "Google sign-in failed. Please try again." };
  }
  return {};
}

export async function signOut(): Promise<void> {
  await supabase.auth.signOut();
}

export async function resetPassword(email: string): Promise<AuthResult> {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${appOrigin()}/reset-password`,
  });
  if (error) {
    return { error: "Failed to send reset email. Please try again." };
  }
  return {};
}

export async function getOrCreateProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();
  if (error || !data) return null;
  return data as Profile;
}

export async function ensureProfile(
  userId: string,
  email: string,
  fullName: string,
): Promise<Profile | null> {
  const existing = await getOrCreateProfile(userId);
  if (existing) return existing;

  const { data, error } = await supabase
    .from("profiles")
    .upsert(
      { id: userId, email, full_name: fullName, role: "user" },
      { onConflict: "id" },
    )
    .select()
    .maybeSingle();
  if (error || !data) return null;
  return data as Profile;
}
