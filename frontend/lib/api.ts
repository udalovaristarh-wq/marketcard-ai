const API_BASE = "/api";

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("access_token");
}

export function setAccessToken(token: string, email?: string) {
  localStorage.setItem("access_token", token);
  if (email) {
    localStorage.setItem("user_email", email);
  }
  document.cookie = `access_token=${encodeURIComponent(token)}; path=/; max-age=86400; SameSite=Lax`;
}

export async function apiFetch(path: string, init: RequestInit = {}) {
  const token = getAccessToken();
  const headers = new Headers(init.headers);

  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  if (init.body && !(init.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const url = path.startsWith("/api") ? path : `${API_BASE}${path.startsWith("/") ? path : `/${path}`}`;

  return fetch(url, {
    ...init,
    headers,
  });
}
