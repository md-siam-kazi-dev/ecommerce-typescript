export type UserRole = "admin" | "user";

export function getUserRole(user?: unknown): UserRole {
  const role = (user as { role?: string | null } | undefined)?.role;
  return role === "admin" ? "admin" : "user";
}
