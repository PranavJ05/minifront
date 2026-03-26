"use client";
// app/auth/login/page.tsx
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  GraduationCap,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  Clock,
} from "lucide-react";
import AuthInput from "@/components/auth/AuthInput";
import { UserRole } from "@/types";
import { getDashboardPath } from "@/lib/utils";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "alumni" as UserRole,
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
        email: formData.email,
        password: formData.password,
      };

      console.log("Attempting login for:", formData.email);

      const res = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log("Login Response:", data);
      localStorage.setItem("role", data.roles[0]); // ✅ MUST
      
  console.log("Stored role:", data.role);

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("email", formData.email); 
      }

      const userRole = data.roles?.[0];
      console.log("User Role:", userRole);
      // Store user info for dashboard
      if (userRole) {
        const user = {
          email: formData.email,
          role: userRole.toLowerCase(),
          fullName: data.name || formData.email.split("@")[0],
        };
        localStorage.setItem("alumni_user", JSON.stringify(user));
      }
      console.log("User Info:", localStorage.getItem("alumni_user"));

      if (userRole === "ALUMNI" || userRole === "BATCH_ADMIN") {
        router.push("/dashboard/alumni");
      } else if (userRole === "STUDENT") {
        router.push("/dashboard/student");
      } else {
        router.push("/");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      const msg = err.message?.toLowerCase() || "";
      if (msg.includes("pending") || msg.includes("approval")) {
        setError("pending");
      } else {
        setError(err.message || "Invalid credentials. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const roles: { value: UserRole; label: string; desc: string }[] = [
    { value: "alumni", label: "Alumni", desc: "Graduate member" },
    { value: "student", label: "Student", desc: "Current student" },
    { value: "faculty", label: "Faculty", desc: "Faculty member" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left panel */}
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

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
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

          {/* Role selector */}
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
          </div>

          {/* Pending account warning */}
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

          {/* Generic error */}
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
              placeholder="your@email.edu"
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
              <a
                href="#"
                className="text-sm text-gold-600 hover:text-gold-700 font-medium font-sans"
              >
                Forgot password?
              </a>
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
              Demo credentials:
            </p>
            <p className="text-xs text-amber-600 font-sans">
              Email: any@email.com · Password: any
              <br />
              Use email with &quot;pending&quot; to see the approval notice
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
