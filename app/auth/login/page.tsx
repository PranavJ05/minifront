"use client";
// app/auth/login/page.tsx
import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  GraduationCap,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  Clock,
  CheckCircle2,
} from "lucide-react";
import AuthInput from "@/components/auth/AuthInput";
import { BACKEND_URL } from "@/lib/config";
import { UserRole } from "@/types";
import {
  isAdmin,
  isAlumni,
  isStudent,
  isFaculty,
  getPrimaryRole,
} from "@/lib/roleUtils";

type LoginResponse = {
  token?: string;
  id?: number | null;
  email?: string;
  name?: string;
  roles?: string[];
  status?: string;
  message?: string;
};

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "alumni" as UserRole,
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const resetSuccess = useMemo(
    () => searchParams.get("reset") === "success",
    [searchParams],
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!formData.email || !formData.password) {
      setError("Please fill in all fields.");
      setLoading(false);
      return;
    }

    try {
      const payload = {
        email: formData.email.trim(),
        password: formData.password,
      };

      const loginUrl =
        formData.role === "faculty"
          ? `${BACKEND_URL}/auth/faculty/login`
          : `${BACKEND_URL}/auth/login`;

      const res = await fetch(loginUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data: LoginResponse = await res.json().catch(() => ({}));

      console.log("[Login] === RAW BACKEND RESPONSE ===");
      console.log("[Login] Full response:", data);
      console.log("[Login] data.roles:", data.roles);
      console.log(
        "[Login] data.roles type:",
        Array.isArray(data.roles) ? "ARRAY" : typeof data.roles,
      );

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Get ALL roles from backend (not just first one)
      // Backend returns roles as array: ["ALUMNI", "ADMIN"] or ["ALUMNI"]
      let allRoles: string[] = [];

      if (Array.isArray(data.roles)) {
        allRoles = data.roles;
      } else if (typeof data.roles === "string") {
        // If backend returns single string, convert to array
        allRoles = [data.roles];
      } else if (data.status) {
        // Fallback: use status field if roles not present
        allRoles = [data.status];
      }

      // LAST RESORT: Use the role user selected to login
      if (allRoles.length === 0) {
        console.warn(
          "[Login] No roles in response, using formData.role as fallback",
        );
        allRoles = [formData.role.toUpperCase()];
      }

      console.log("[Login] === PROCESSED ROLES ===");
      console.log("[Login] allRoles array:", allRoles);
      console.log("[Login] allRoles length:", allRoles.length);

      if (!data.token || allRoles.length === 0) {
        console.error("[Login] CRITICAL: Missing token or roles!");
        throw new Error("Login response was incomplete. Please try again.");
      }

      const fullName = data.name?.trim() || payload.email;

      // Fetch additional user data from profile if alumniId/courseId not in login response
      const fetchUserProfile = async () => {
        try {
          const profileRes = await fetch(
            "http://localhost:8080/api/profile/me",
            {
              headers: {
                Authorization: `Bearer ${data.token}`,
              },
            },
          );

          if (profileRes.ok) {
            const profileData = await profileRes.json();
            console.log("[Login] Profile data:", profileData);
            return {
              alumniId: profileData.alumniId ?? null,
              courseId: profileData.courseId ?? null,
            };
          }
        } catch (error) {
          console.error("[Login] Failed to fetch profile:", error);
        }
        return { alumniId: null, courseId: null };
      };

      const additionalData = await fetchUserProfile();

      const storedUser = {
        id: data.id ?? null,
        alumniId: data.alumniId ?? additionalData.alumniId,
        courseId: data.courseId ?? additionalData.courseId,
        email: data.email || payload.email,
        roles: allRoles, // Store ALL roles as array (RAW from backend)
        fullName,
      };

      console.log("[Login] === BEFORE STORAGE ===");
      console.log("[Login] storedUser object:", storedUser);
      console.log("[Login] storedUser.roles:", storedUser.roles);
      console.log(
        "[Login] storedUser.roles type:",
        Array.isArray(storedUser.roles) ? "ARRAY" : typeof storedUser.roles,
      );
      console.log("[Login] JSON.stringify result:", JSON.stringify(storedUser));

      localStorage.setItem("token", data.token);
      localStorage.setItem("email", storedUser.email);
      localStorage.setItem("alumni_user", JSON.stringify(storedUser));

      // Verify what was actually stored
      const stored = localStorage.getItem("alumni_user");
      console.log("[Login] === AFTER STORAGE ===");
      console.log("[Login] Raw from localStorage:", stored);
      console.log("[Login] Parsed from localStorage:", JSON.parse(stored!));
      console.log("[Login] Parsed roles:", JSON.parse(stored!).roles);

      window.dispatchEvent(new Event("storage"));

      // Determine dashboard based on roles using utility functions
      let dashboardPath = "/";

      if (isAdmin(allRoles) || isAlumni(allRoles)) {
        dashboardPath = "/dashboard/alumni";
      } else if (isFaculty(allRoles)) {
        dashboardPath = "/dashboard/faculty";
      } else if (isStudent(allRoles)) {
        dashboardPath = "/dashboard/student";
      }

      const primaryRole = getPrimaryRole(allRoles);
      console.log(
        "[Login] Primary role:",
        primaryRole,
        "→ Redirecting to:",
        dashboardPath,
      );
      router.push(dashboardPath);
    } catch (err: any) {
      const msg = err.message?.toLowerCase() || "";
      if (msg.includes("pending") || msg.includes("approval")) {
        setError("pending");
      } else if (
        msg.includes("invalid") ||
        msg.includes("unauthorized") ||
        msg.includes("bad credentials")
      ) {
        setError("Invalid email or password.");
      } else {
        setError(err.message || "Unable to sign in right now.");
      }
    } finally {
      setLoading(false);
    }
  };

  const roles: { value: UserRole; label: string; desc: string }[] = [
    { value: "alumni", label: "Alumni", desc: "Graduate member" },
    { value: "student", label: "Student", desc: "Current student" },
    { value: "faculty", label: "Faculty", desc: "College-issued access" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="hidden lg:flex lg:w-1/2 bg-navy-950 relative overflow-hidden flex-col justify-between p-12">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-navy-700/50 rounded-full blur-3xl" />

        <Link href="/" className="flex items-center gap-2.5 relative z-10">
          <div className="bg-gold-500 p-1.5 rounded-lg">
            <GraduationCap className="h-5 w-5 text-navy-950" />
          </div>
          <span className="font-serif font-bold text-white text-xl">
            ALUMNI
          </span>
        </Link>

        <div className="relative z-10">
          <h1 className="font-serif text-4xl font-bold text-white leading-tight mb-6">
            Welcome back to
            <br />
            your <span className="gradient-text">community</span>
          </h1>
          <p className="text-gray-300 text-lg leading-relaxed mb-10">
            Sign in to access your network, career opportunities, and stay
            connected with your university family.
          </p>
          <div className="space-y-4">
            {[
              "35,000+ alumni connections worldwide",
              "Exclusive job board and opportunities",
              "Mentorship and career guidance",
              "Campus news and announcements",
            ].map((f) => (
              <div key={f} className="flex items-center gap-3">
                <div className="w-2 h-2 bg-gold-500 rounded-full flex-shrink-0" />
                <span className="text-gray-300 text-sm">{f}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-gray-500 text-xs relative z-10">
          © 2024 Alumni Network. Verified University Platform.
        </p>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="bg-navy-800 p-1.5 rounded-lg">
              <GraduationCap className="h-5 w-5 text-gold-500" />
            </div>
            <span className="font-serif font-bold text-navy-900 text-xl">
              ALUMNI
            </span>
          </div>

          <div className="mb-8">
            <h2 className="font-serif text-3xl font-bold text-navy-900 mb-2">
              Sign In
            </h2>
            <p className="text-gray-500">Access your alumni account</p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-navy-800 mb-2 font-sans">
              Sign in as
            </label>
            <div className="grid grid-cols-3 gap-2">
              {roles.map((role) => (
                <button
                  key={role.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, role: role.value })}
                  className={`p-3 rounded-lg border-2 text-center transition-all ${
                    formData.role === role.value
                      ? "border-navy-800 bg-navy-50 text-navy-900"
                      : "border-gray-200 text-gray-500 hover:border-gray-300"
                  }`}
                >
                  <div className="font-semibold text-sm">{role.label}</div>
                  <div className="text-xs text-gray-400 mt-0.5">
                    {role.desc}
                  </div>
                </button>
              ))}
            </div>
            <p className="mt-3 text-xs text-gray-500 font-sans">
              {formData.role === "faculty"
                ? "Faculty login uses college-issued credentials."
                : formData.role === "student"
                  ? "Sign in with your approved student account."
                  : "Sign in with your approved alumni account."}
            </p>
          </div>

          {resetSuccess && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3 text-green-700">
              <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sm">
                  Password reset successful
                </p>
                <p className="text-sm mt-0.5">
                  Sign in with your new password.
                </p>
              </div>
            </div>
          )}

          {error === "pending" && (
            <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
              <Clock className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-amber-800 text-sm">
                  Account Pending Approval
                </p>
                <p className="text-amber-700 text-sm mt-0.5">
                  Your account is awaiting admin approval. You&apos;ll receive
                  an email once it&apos;s approved.
                </p>
              </div>
            </div>
          )}

          {error && error !== "pending" && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700 text-sm">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <AuthInput
              label="Email Address"
              type="email"
              placeholder={
                formData.role === "faculty"
                  ? "faculty@mec.ac.in"
                  : "your@email.edu"
              }
              icon={Mail}
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />

            <AuthInput
              label="Password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              icon={Lock}
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              }
              required
            />

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={(e) =>
                    setFormData({ ...formData, rememberMe: e.target.checked })
                  }
                  className="w-4 h-4 rounded border-gray-300 accent-navy-800"
                />
                <span className="text-sm text-gray-600 font-sans">
                  Remember me
                </span>
              </label>
              <Link
                href="/forgot-password"
                className="text-sm text-gold-600 hover:text-gold-700 font-medium font-sans"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary flex items-center justify-center gap-2 mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-xs text-amber-700 font-sans font-medium mb-1">
              Faculty login example:
            </p>
            <p className="text-xs text-amber-600 font-sans">
              Email: faculty1@mec.ac.in · Password: faculty123
            </p>
          </div>

          <p className="mt-6 text-center text-sm text-gray-500 font-sans">
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/signup"
              className="text-gold-600 hover:text-gold-700 font-semibold"
            >
              Join the Network
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
