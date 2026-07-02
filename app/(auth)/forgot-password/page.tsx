"use client";
import { BACKEND_URL } from "@/lib/config";
import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  GraduationCap,
  Mail,
  Send,
} from "lucide-react";
import AuthInput from "@/components/auth/AuthInput";

const SUCCESS_MESSAGE =
  "If an account with that email exists, a password reset link has been sent.";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      console.log("[Forgot Password] Sending request for:", email);
      // Use BACKEND_URL to match your other auth routes
      const res = await fetch(`${BACKEND_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      console.log("[Forgot Password] Response status:", res.status);

      if (!res.ok) {
        const errorData = await res.text();
        console.error("[Forgot Password] Backend error:", errorData);
      }

      setSuccess(true);
    } catch (err) {
      console.error("[Forgot Password] Network/Fetch Error:", err);
      // Still show success to the user for security
      setSuccess(true);
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
          <span className="font-serif font-bold text-white text-xl">
            ALUMNI
          </span>
        </Link>

        <div className="relative z-10 max-w-lg">
          <p className="text-gold-400 text-sm font-medium tracking-wide uppercase mb-4">
            Account Recovery
          </p>
          <h1 className="font-serif text-4xl font-bold text-white leading-tight mb-6">
            Reset access without
            <br />
            exposing valid accounts.
          </h1>
          <p className="text-gray-300 text-lg leading-relaxed">
            Enter your email and, if it exists in the system, we&apos;ll send a
            secure reset link.
          </p>
        </div>

        <p className="text-gray-500 text-xs relative z-10">
          Reset links expire for security. Request a new one if needed.
        </p>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <Link
            href="/auth/login"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-navy-900 mb-8"
          >
            <ArrowLeft className="h-4 w-4" /> Back to login
          </Link>

          <div className="mb-8">
            <h2 className="font-serif text-3xl font-bold text-navy-900 mb-2">
              Forgot password?
            </h2>
            <p className="text-gray-500">
              Enter your email to receive a password reset link.
            </p>
          </div>

          {success ? (
            <div className="card p-6 text-center">
              <div className="w-14 h-14 mx-auto rounded-full bg-green-100 text-green-600 flex items-center justify-center mb-4">
                <CheckCircle2 className="h-7 w-7" />
              </div>
              <h3 className="font-semibold text-navy-900 text-lg mb-2">
                Check your inbox
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {SUCCESS_MESSAGE}
              </p>
              <Link
                href="/auth/login"
                className="inline-flex items-center justify-center mt-6 px-5 py-3 rounded-lg bg-navy-900 text-white hover:bg-navy-800"
              >
                Return to login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="card p-6 space-y-5">
              <AuthInput
                label="Email Address"
                type="email"
                icon={Mail}
                placeholder="you@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />

              {error && <p className="text-sm text-red-600">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Send className="h-4 w-4" /> Send reset link
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
