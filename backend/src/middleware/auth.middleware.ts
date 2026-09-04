import type { NextFunction, Request, Response } from "express";
import { getSupabase, getSupabaseAnon } from "../services/supabase.js";
import { ApiError } from "../utils/ApiError.js";

export interface AuthedRequest extends Request {
  authUser?: {
    id: string;
    email?: string;
    role: string;
  };
}

/** Verify the Bearer Supabase JWT and attach the authenticated user. */
export async function requireAuth(req: AuthedRequest, _res: Response, next: NextFunction) {
  const anon = getSupabaseAnon();
  if (!anon) {
    return next(ApiError.unauthorized("Auth service is not configured."));
  }

  const header = req.headers.authorization ?? "";
  const match = /^Bearer\s+(.+)$/i.exec(header);
  if (!match) {
    return next(ApiError.unauthorized("Missing bearer token."));
  }

  const { data, error } = await anon.auth.getUser(match[1]);
  if (error || !data.user) {
    return next(ApiError.unauthorized("Invalid or expired token."));
  }

  req.authUser = {
    id: data.user.id,
    email: data.user.email,
    role: "user",
  };
  next();
}

/** Require the user to be an admin (verified server-side against profiles). */
export async function requireAdmin(req: AuthedRequest, _res: Response, next: NextFunction) {
  const supabase = getSupabase();
  const anon = getSupabaseAnon();
  const supabaseClient = supabase ?? anon;

  if (!supabaseClient) {
    return next(ApiError.unauthorized("Auth service is not configured."));
  }

  const header = req.headers.authorization ?? "";
  const match = /^Bearer\s+(.+)$/i.exec(header);
  if (!match) {
    return next(ApiError.unauthorized("Missing bearer token."));
  }

  const { data: userData, error: userError } = await anon!.auth.getUser(match[1]);
  if (userError || !userData.user) {
    return next(ApiError.unauthorized("Invalid or expired token."));
  }

  // Look up role via the service-role client (bypasses RLS so we can read any profile).
  const { data: profile, error: profileError } = await supabaseClient
    .from("profiles")
    .select("id, role")
    .eq("id", userData.user.id)
    .maybeSingle();

  if (profileError || !profile) {
    return next(ApiError.unauthorized("Account profile not found."));
  }
  if (profile.role !== "admin") {
    return next(ApiError.unauthorized("This account does not have admin access."));
  }

  req.authUser = {
    id: profile.id,
    email: userData.user.email,
    role: "admin",
  };
  next();
}
