const DEFAULT_ADMIN_EMAILS = ["admin123@gmail.com"];

const ADMIN_EMAILS = [
  ...DEFAULT_ADMIN_EMAILS,
  ...((import.meta.env.VITE_ADMIN_EMAILS as string | undefined) ?? "").split(","),
]
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);

export function isAdminAccount(email?: string, appRole?: unknown) {
  return appRole === "admin" || (email ? ADMIN_EMAILS.includes(email.toLowerCase()) : false);
}
