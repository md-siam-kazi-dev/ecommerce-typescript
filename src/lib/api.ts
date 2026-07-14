import { authClient } from "@/lib/auth-client";

export async function getAuthToken(): Promise<string | null> {
  const { data, error } = await authClient.token();
  if (error || !data?.token) return null;
  return data.token;
}

export async function apiFetch<T = unknown>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const token = await getAuthToken();
  const headers = new Headers(init.headers);
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const base = process.env.NEXT_PUBLIC_API ?? "";
  const res = await fetch(`${base}${path}`, {
    ...init,
    headers,
  });

  if (!res.ok) {
    throw new Error(`Request failed with status ${res.status}`);
  }

  return (await res.json()) as T;
}
