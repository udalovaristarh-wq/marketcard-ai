export const AUTH_EMAIL_KEY = "user_email";

/** Legacy key — cleared on logout; new sessions use httpOnly cookie only. */
const LEGACY_TOKEN_KEY = "access_token";

export function getAuthHeaders(): HeadersInit {
  return {};
}

export const authFetchInit: RequestInit = {
  credentials: "include",
};

export function authFetch(input: RequestInfo | URL, init: RequestInit = {}): Promise<Response> {
  return fetch(input, {
    ...authFetchInit,
    ...init,
    headers: init.headers,
  });
}

export function saveAuthSession(_token: string, email: string) {
  localStorage.removeItem(LEGACY_TOKEN_KEY);
  localStorage.setItem(AUTH_EMAIL_KEY, email);
}

export function clearAuthSession() {
  localStorage.removeItem(LEGACY_TOKEN_KEY);
  localStorage.removeItem(AUTH_EMAIL_KEY);
}

export function hasAuthSession(): boolean {
  if (typeof window === "undefined") return false;
  return Boolean(localStorage.getItem(AUTH_EMAIL_KEY));
}
