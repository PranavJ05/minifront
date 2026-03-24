export const getToken = (): string | null => {
  return typeof window !== "undefined" ? localStorage.getItem("token") : null;
};
