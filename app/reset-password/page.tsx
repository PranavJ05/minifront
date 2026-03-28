"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  GraduationCap,
  KeyRound,
  Lock,
} from "lucide-react";
import AuthInput from "@/components/auth/AuthInput";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = useMemo(() => searchParams.get("token") || "", [searchParams]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!token) {
      setError("This reset link is invalid or missing. Request a new one.");
      return;
    }

    if (!newPassword || !confirmPassword) {
      setError("Please fill in both password fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:8080/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(
          data?.message ||
            "This reset link is invalid or expired. Request a new password reset email.",
        );
      }

      setSuccess(true);
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => {
        router.push("/auth/login?reset=success");
      }, 1200);
    } catch (err: any) {
      setError(
        err.message ||
          "This reset link is invalid or expired. Request a new password reset email.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="hidden lg:flex lg:w-1/2 bg-navy-950 relative overflow-hidden flex-col justify-between p-12">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-navy-700/50 rounded-full blur-3xl" />

        <Link href="/" className="flex items-center gap-2.5 relative z-10">
          <div className="bg-gold-500 p-1.5 rounded-lg">
            <GraduationCap className="h-5 w-5 text-navy-950" />
          </div>
          <span className="font-serif font-bold text-white text-xl">ALUMNI</span>
        </Link>

        <div className="relative z-10 max-w-lg">
          <p className="text-gold-400 text-sm font-medium tracking-wide uppercase mb-4">
            Secure Reset
          </p>
          <h1 className="font-serif text-4xl font-bold text-white leading-tight mb-6">
            Choose a new password
            <br />
            and get back in.
          </h1>
          <p className="text-gray-300 text-lg leading-relaxed">
            Use a strong password you haven&apos;t used elsewhere. The reset token from your email is validated on submit.
          </p>
        </div>

        <p className="text-gray-500 text-xs relative z-10">
          If this link has expired, request a fresh reset email.
        </p>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <Link
            href="/forgot-password"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-navy-900 mb-8"
          >
            <ArrowLeft className="h-4 w-4" /> Back to forgot password
          </Link>

          <div className="mb-8">
            <h2 className="font-serif text-3xl font-bold text-navy-900 mb-2">
              Reset Password
            </h2>
            <p className="text-gray-500">
              Enter your new password below.
            </p>
          </div>

          {success ? (
            <div className="card p-6 text-center">
              <div className="w-14 h-14 mx-auto rounded-full bg-green-100 text-green-600 flex items-center justify-center mb-4">
                <CheckCircle2 className="h-7 w-7" />
              </div>
              <h3 className="font-semibold text-navy-900 text-lg mb-2">Password reset successful</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Redirecting you to the login page.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="card p-6 space-y-5">
              {!token && (
                <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-sm">
                  No reset token was found in this link. Request a new password reset email.
                </div>
              )}

              {error && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <AuthInput
                label="New Password"
                type={showPassword ? "text" : "password"}
                icon={Lock}
                placeholder="Enter a new password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                }
                required
              />

              <AuthInput
                label="Confirm Password"
                type={showConfirmPassword ? "text" : "password"}
                icon={KeyRound}
                placeholder="Confirm your new password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((current) => !current)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                }
                required
              />

              <button
                type="submit"
                disabled={loading || !token}
                className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  "Reset Password"
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
