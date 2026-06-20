import { BACKEND_URL } from "@/lib/config";

export const getToken = (): string | null => {
  return typeof window !== "undefined" ? localStorage.getItem("token") : null;
};

export const getUserRole = () => {

  if (typeof window === "undefined") {
    return null;
  }

  const user =
    localStorage.getItem("alumni_user");

  if (!user) {
    return null;
  }

  try {

    const parsed =
      JSON.parse(user);

    return parsed.roles?.[0] ?? null;

  } catch {

    return null;
  }
};