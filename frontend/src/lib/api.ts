import { supabase } from "./supabase";

const API_BASE = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, "") ?? "";

export class ApiError extends Error {
  public readonly status: number;
  public readonly code?: string;

  constructor(status: number, message: string, code?: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

/** Calls the Budhram backend API with the current user's Supabase JWT. */
export async function api<T>(
  path: string,
  options: RequestInit = {},
  auth: boolean = true,
): Promise<T> {
  const url = `${API_BASE}${path}`;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> | undefined),
  };

  if (auth) {
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(url, { ...options, headers });
  if (res.status === 204) return undefined as T;

  let body: unknown = null;
  const text = await res.text();
  if (text) {
    try {
      body = JSON.parse(text);
    } catch {
      body = null;
    }
  }

  if (!res.ok) {
    const message =
      body && typeof body === "object" && "error" in body && body.error
        ? ((body.error as { message?: string }).message ?? res.statusText)
        : res.statusText || "Request failed";
    const code =
      body && typeof body === "object" && "error" in body && body.error
        ? (body.error as { code?: string }).code
        : undefined;
    throw new ApiError(res.status, message, code);
  }

  return body as T;
}

export function isApiConfigured(): boolean {
  return Boolean(API_BASE);
}
