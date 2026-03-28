import apiClient from "../client";

const authService = {
  async login(username: string, password: string) {
    const response = await apiClient("/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
    return response.data;
  },

  async signUp(formData: any) {
    const response = await apiClient<{ data: any }>("/signup", {
      method: "POST",
      body: JSON.stringify(formData),
    });
    return response.data;
  },

  async logout() {
    localStorage.removeItem("token");
    // You should handle navigation in your component, not here.
    return null;
  },
};

export default authService;
