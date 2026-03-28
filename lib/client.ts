import { BACKEND_URL } from "./config";

const apiClient = async <T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> => {
  const token = localStorage.getItem("auth_token");
  const response = await fetch(`${BACKEND_URL}${endpoint}`, {
    ...options,
    headers: {
      ...options?.headers,
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

  if (!response.ok) {
    // Optionally, you can parse the error message here
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

export default apiClient;
