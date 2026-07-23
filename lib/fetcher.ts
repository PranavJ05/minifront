import { ofetch } from "ofetch";
import { BACKEND_URL } from "./config";
import { ApiError } from "./api-error";
import { getToken } from "./auth";

function handleAutoLogout() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("token");
  localStorage.removeItem("alumni_user");
  window.dispatchEvent(new Event("storage"));

  const pathname = window.location.pathname;
  if (!pathname.startsWith("/auth/")) {
    const next = encodeURIComponent(pathname + window.location.search);
    window.location.href = `/auth/login?next=${next}`;
  }
}

export const api = ofetch.create({
  baseURL: BACKEND_URL,
  headers: { "Content-Type": "application/json" },
  onRequest({ options }) {
    const token = getToken();
    if (token) {
      const headers = new Headers(options.headers);
      headers.set("Authorization", `Bearer ${token}`);
      options.headers = headers;
    }
    if (options.body instanceof FormData) {
      const headers = new Headers(options.headers);
      headers.delete("Content-Type");
      options.headers = headers;
    }
  },
  onResponseError({ response }) {
    if (response.status === 401) {
      const url = response.url || "";
      const isAuthEndpoint =
        url.includes("/api/auth/login") ||
        url.includes("/api/auth/faculty/login") ||
        url.includes("/api/auth/register");

      if (!isAuthEndpoint) {
        handleAutoLogout();
      }
    }

    const data = response._data as
      | { message?: string; error?: string; errors?: Record<string, string> }
      | string
      | undefined;

    const message =
      typeof data === "object" && data !== null
        ? data.message || data.error || response.statusText || "Request failed"
        : typeof data === "string" && data.trim()
          ? data
          : response.statusText || "Request failed";

    throw new ApiError(message, response.status, response._data);
  },
});
