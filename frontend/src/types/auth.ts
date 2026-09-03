export type UserRole = "user" | "admin";

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface AuthUser {
  id: string;
  email: string | undefined;
  user_metadata: Record<string, unknown>;
}

export interface AuthResult {
  error?: string;
}

export interface AuthContextValue {
  user: AuthUser | null;
  profile: Profile | null;
  role: UserRole | null;
  isAdmin: boolean;
  isAuthenticated: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signUp: (email: string, password: string, fullName: string) => Promise<AuthResult>;
  signInWithGoogle: () => Promise<AuthResult>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<AuthResult>;
}
