import { isAnyAdmin, isMainAdmin, isAlumni } from "@/lib/roleUtils";

export const getToken = (): string | null => {
  return typeof window !== "undefined" ? localStorage.getItem("token") : null;
};

export const getUserRoles = (): string[] => {
  if (typeof window === "undefined") return [];
  const user = localStorage.getItem("alumni_user");
  if (!user) return [];
  try {
    const parsed = JSON.parse(user);
    if (Array.isArray(parsed.roles)) return parsed.roles;
    if (typeof parsed.roles === "string") return [parsed.roles];
    if (typeof parsed.role === "string") return [parsed.role];
    return [];
  } catch {
    return [];
  }
};

export const getUserRole = (): string | null => {
  const roles = getUserRoles();
  return roles.length > 0 ? roles[0] : null;
};

export const hasAuthToken = (): boolean => {
  return !!getToken();
};

export const isCurrentAdmin = (): boolean => {
  if (!hasAuthToken()) return false;
  return isAnyAdmin(getUserRoles());
};

export const isCurrentMainAdmin = (): boolean => {
  if (!hasAuthToken()) return false;
  return isMainAdmin(getUserRoles());
};

export const isCurrentAlumni = (): boolean => {
  if (!hasAuthToken()) return false;
  return isAlumni(getUserRoles());
};