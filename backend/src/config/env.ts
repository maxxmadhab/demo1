import "dotenv/config";

const required = (name: string, fallback?: string): string => {
  const value = process.env[name] ?? fallback;
  if (value === undefined) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
};

export const env = {
  nodeEnv: required("NODE_ENV", "development"),
  port: Number(required("PORT", "4000")),
  clientOrigin: required("CLIENT_ORIGIN", "http://localhost:5173"),

  supabase: {
    url: process.env.SUPABASE_URL ?? "",
    anonKey: process.env.SUPABASE_ANON_KEY ?? "",
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
  },
} as const;

export const isProduction = env.nodeEnv === "production";