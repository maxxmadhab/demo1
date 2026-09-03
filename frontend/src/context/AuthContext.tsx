import { createContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { supabase } from "@/lib/supabase";
import * as authService from "@/services/authService";
import { isAdminAccount } from "@/config/admin";
import type { AuthUser, Profile, AuthContextValue, AuthResult } from "@/types/auth";

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async (authUser: AuthUser) => {
    setProfile({
      id: authUser.id,
      email: authUser.email ?? "",
      full_name: (authUser.user_metadata?.full_name as string) ?? "",
      role: isAdminAccount(authUser.email, authUser.app_metadata?.role) ? "admin" : "user",
      created_at: "",
      updated_at: "",
    });
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const u: AuthUser = {
          id: session.user.id,
          email: session.user.email,
          app_metadata: session.user.app_metadata ?? {},
          user_metadata: session.user.user_metadata ?? {},
        };
        setUser(u);
        loadProfile(u).finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          const u: AuthUser = {
            id: session.user.id,
            email: session.user.email,
            app_metadata: session.user.app_metadata ?? {},
            user_metadata: session.user.user_metadata ?? {},
          };
          setUser(u);
          await loadProfile(u);
        } else {
          setUser(null);
          setProfile(null);
        }
      },
    );

    return () => subscription.unsubscribe();
  }, [loadProfile]);

  const signIn = useCallback(
    async (email: string, password: string): Promise<AuthResult> => {
      const result = await authService.signIn(email, password);
      if (result.error) return result;

      // Wait for the session + profile to be fully loaded so callers can
      // immediately trust role/isAdmin (avoids bouncing admins out of /admin).
      const session = await supabase.auth.getSession();
      const u = session.data.session?.user;
      if (u) {
        const authUser: AuthUser = {
          id: u.id,
          email: u.email,
          app_metadata: u.app_metadata ?? {},
          user_metadata: u.user_metadata ?? {},
        };
        setUser(authUser);
        if (result.profile) {
          setProfile(result.profile);
        } else {
          await loadProfile(authUser);
        }
      }
      return { user: result.user, profile: result.profile };
    },
    [loadProfile],
  );

  const signUp = useCallback(
    async (email: string, password: string, fullName: string): Promise<AuthResult> => {
      const result = await authService.signUp(email, password, fullName);
      return result;
    },
    [],
  );

  const signInWithGoogle = useCallback(async (): Promise<AuthResult> => {
    return authService.signInWithGoogle();
  }, []);

  const signOut = useCallback(async () => {
    await authService.signOut();
    setUser(null);
    setProfile(null);
  }, []);

  const resetPassword = useCallback(async (email: string): Promise<AuthResult> => {
    return authService.resetPassword(email);
  }, []);

  const role = profile?.role ?? (isAdminAccount(user?.email, user?.app_metadata?.role) ? "admin" : null);

  const value: AuthContextValue = {
    user,
    profile,
    role,
    isAdmin: role === "admin",
    isAuthenticated: !!user,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
