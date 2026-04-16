const API_BASE = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");

export const MEMBER_TOKEN_KEY = "lisacademy_member_token";
export const ADMIN_TOKEN_KEY = "lisacademy_admin_token";

function buildUrl(path: string) {
  return `${API_BASE}${path}`;
}

export async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(buildUrl(path), {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });

  const isJson = response.headers.get("content-type")?.includes("application/json");
  const payload = isJson ? await response.json() : null;

  if (!response.ok) {
    throw new Error(payload?.error || "Request failed.");
  }

  return payload as T;
}

export function setMemberToken(token: string) {
  localStorage.setItem(MEMBER_TOKEN_KEY, token);
}

export function getMemberToken() {
  return localStorage.getItem(MEMBER_TOKEN_KEY);
}

export function clearMemberToken() {
  localStorage.removeItem(MEMBER_TOKEN_KEY);
}

export function setAdminToken(token: string) {
  sessionStorage.setItem(ADMIN_TOKEN_KEY, token);
}

export function getAdminToken() {
  return sessionStorage.getItem(ADMIN_TOKEN_KEY);
}

export function clearAdminToken() {
  sessionStorage.removeItem(ADMIN_TOKEN_KEY);
}
