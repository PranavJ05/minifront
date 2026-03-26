import { BACKEND_URL } from "@/lib/config";

export const getToken = (): string | null => {
  return typeof window !== "undefined" ? localStorage.getItem("token") : null;
};

export const getUserRole = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("role");
};