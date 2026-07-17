import { ofetch } from "ofetch";
import { BACKEND_URL } from "./config";
import { ApiError } from "./api-error";
import { getToken } from "./auth";

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
    throw new ApiError(
      response.statusText || "Request failed",
      response.status,
      response._data,
    );
  },
});
