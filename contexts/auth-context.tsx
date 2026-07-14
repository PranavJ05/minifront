"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { BACKEND_URL } from "@/lib/config";

export interface StoredUser {
  id: number | null;
  alumniId: number | null;
  courseId: number | null;
  email: string;
  roles: string[];
  fullName: string;
}

interface LoginParams {
  email: string;
  password: string;
  role?: "alumni" | "student" | "faculty";
}

interface LoginResponse {
  token?: string;
  id?: number | null;
  alumniId?: number | null;
  courseId?: number | null;
  email?: string;
  name?: string;
  role?: string;
  roles?: string[] | string;
  authorities?: Array<string | { authority?: string }>;
  status?: string;
  message?: string;
  emailVerificationRequired?: boolean;
  approvalPending?: boolean;
}

interface AuthContextType {
  user: StoredUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (params: LoginParams) => Promise<LoginResponse>;
  logout: () => void;
  updateUser: (updates: Partial<StoredUser>) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

function getStoredUser(): StoredUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("alumni_user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

function extractRoles(data: LoginResponse, fallbackRole: string): string[] {
  const extracted: string[] = [];

  if (Array.isArray(data.roles)) {
    extracted.push(
      ...data.roles.filter((role): role is string => typeof role === "string"),
    );
  } else if (typeof data.roles === "string") {
    extracted.push(data.roles);
  }

  if (typeof data.role === "string") {
    extracted.push(data.role);
  }

  if (Array.isArray(data.authorities)) {
    data.authorities.forEach((entry) => {
      if (typeof entry === "string") {
        extracted.push(entry);
        return;
      }

      if (entry && typeof entry.authority === "string") {
        extracted.push(entry.authority);
      }
    });
  }

  if (extracted.length === 0) {
    extracted.push(fallbackRole);
  }

  const deduped = Array.from(new Set(extracted));
  return deduped;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<StoredUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setUser(getStoredUser());
    setToken(getStoredToken());
    setIsLoading(false);

    const handleStorage = () => {
      setUser(getStoredUser());
      setToken(getStoredToken());
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const login = useCallback(
    async (params: LoginParams): Promise<LoginResponse> => {
      const loginUrl =
        params.role === "faculty"
          ? `${BACKEND_URL}/api/auth/faculty/login`
          : `${BACKEND_URL}/api/auth/login`;

      const res = await fetch(loginUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: params.email.trim(),
          password: params.password,
        }),
      });

      const data: LoginResponse = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      const allRoles = extractRoles(
        data,
        params.role?.toUpperCase() || "ALUMNI",
      );

      if (data.token && allRoles.length > 0) {
        const storedUser: StoredUser = {
          id: data.id ?? null,
          alumniId: data.alumniId ?? null,
          courseId: data.courseId ?? null,
          email: data.email || params.email,
          roles: allRoles,
          fullName: data.name?.trim() || params.email,
        };

        localStorage.setItem("token", data.token);
        localStorage.setItem("email", storedUser.email);
        localStorage.setItem("alumni_user", JSON.stringify(storedUser));
        window.dispatchEvent(new Event("storage"));

        setToken(data.token);
        setUser(storedUser);
      }

      return data;
    },
    [],
  );

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("alumni_user");
    localStorage.removeItem("role");
    window.dispatchEvent(new Event("storage"));
    setToken(null);
    setUser(null);
  }, []);

  const updateUser = useCallback((updates: Partial<StoredUser>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, ...updates };
      localStorage.setItem("alumni_user", JSON.stringify(updated));
      return updated;
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        isLoading,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
