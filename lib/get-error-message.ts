import { ApiError } from "./api-error";

export function getErrorMessage(err: unknown, fallback = "Something went wrong"): string {
  if (err instanceof ApiError) {
    const data = err.data as { message?: string; error?: string; errors?: Record<string, string> } | null;
    if (data && typeof data === "object") {
      if (data.message) return data.message;
      if (data.error) return data.error;
      if (data.errors && typeof data.errors === "object") {
        const firstValue = Object.values(data.errors)[0];
        if (firstValue) return firstValue;
      }
    }
    return err.message || fallback;
  }
  if (err instanceof Error) {
    return err.message || fallback;
  }
  if (typeof err === "string") {
    return err;
  }
  return fallback;
}
