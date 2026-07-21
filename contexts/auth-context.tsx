"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { BACKEND_URL } from "@/lib/config";

export interface StoredUser {
  id: number | null;
  alumniId: number | null;
  courseId: number | null;
  email: string;
  roles: string[];
  fullName?: string;
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

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

function getStoredUser(): StoredUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("alumni_user");
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function extractRoles(data: LoginResponse, fallbackRole = "ALUMNI"): string[] {
  const extracted: string[] = [];

  if (Array.isArray(data.roles)) {
    data.roles.forEach((r) => {
      if (typeof r === "string") extracted.push(r);
    });
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
      const body = JSON.stringify({
        email: params.email.trim(),
        password: params.password,
      });

      let res: Response;
      let data: LoginResponse = {};

      if (params.role === "faculty") {
        res = await fetch(`${BACKEND_URL}/api/auth/faculty/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body,
        });
        data = await res.json().catch(() => ({}));
      } else {
        res = await fetch(`${BACKEND_URL}/api/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body,
        });
        data = await res.json().catch(() => ({}));

        if (!res.ok && (res.status === 401 || res.status === 404)) {
          const facultyRes = await fetch(`${BACKEND_URL}/api/auth/faculty/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body,
          }).catch(() => null);

          if (facultyRes && facultyRes.ok) {
            res = facultyRes;
            data = await facultyRes.json().catch(() => ({}));
          }
        }
      }

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
        localStorage.setItem("alumni_user", JSON.stringify(storedUser));

        setUser(storedUser);
        setToken(data.token);
        window.dispatchEvent(new Event("storage"));
      }

      return data;
    },
    [],
  );

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("alumni_user");
    setUser(null);
    setToken(null);
    window.dispatchEvent(new Event("storage"));
  }, []);

  const updateUser = useCallback((updates: Partial<StoredUser>) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...updates };
      localStorage.setItem("alumni_user", JSON.stringify(updated));
      window.dispatchEvent(new Event("storage"));
      return updated;
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
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
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
