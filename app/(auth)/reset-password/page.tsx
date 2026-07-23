"use client";

import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  GraduationCap,
  Lock,
  Sparkles,
} from "lucide-react";
import AuthInput from "@/components/auth/AuthInput";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { BACKEND_URL } from "@/lib/config";

function ResetPasswordForm() {
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
      const res = await fetch(`${BACKEND_URL}/api/auth/reset-password`, {
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
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "This reset link is invalid or expired. Request a new password reset email.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Banner */}
      <div className="hidden lg:flex lg:w-1/2 bg-card border-r border-border flex-col justify-between p-12 sticky top-0 self-start h-screen">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="bg-primary p-2 rounded-lg text-primary-foreground">
            <GraduationCap className="h-5 w-5" />
          </div>
          <span className="font-bold text-base tracking-tight text-foreground">
            Alumni Relations Cell
          </span>
        </Link>

        <div className="space-y-4 max-w-md">
          <Badge variant="secondary" className="text-xs font-normal">
            <Sparkles className="h-3 w-3 mr-1" />
            Secure Verification
          </Badge>
          <h1 className="text-3xl font-bold text-foreground leading-tight tracking-tight">
            Choose a new password
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Create a strong password to protect your account. The reset token from your email link will be validated upon submission.
          </p>
        </div>

        <p className="text-xs text-muted-foreground">
          If this link has expired, request a new password reset email.
        </p>
      </div>

      {/* Right Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md space-y-6">
          <Link
            href="/forgot-password"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors font-medium"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to forgot password
          </Link>

          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Reset Password
            </h2>
            <p className="text-xs text-muted-foreground">
              Enter your new password below.
            </p>
          </div>

          {success ? (
            <Card>
              <CardContent className="flex flex-col items-center py-8 text-center gap-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-foreground text-sm">
                  Password reset successful
                </h3>
                <p className="text-xs text-muted-foreground">
                  Redirecting you to the login page...
                </p>
              </CardContent>
            </Card>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {!token && (
                <Alert className="border-amber-500/30 bg-amber-500/10 text-amber-700">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-xs">
                    No reset token was found in this link. Request a new password reset email.
                  </AlertDescription>
                </Alert>
              )}

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-xs">{error}</AlertDescription>
                </Alert>
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
                    onClick={() => setShowPassword((c) => !c)}
                    className="text-muted-foreground/60 hover:text-foreground cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                }
                required
              />

              <AuthInput
                label="Confirm Password"
                type={showConfirmPassword ? "text" : "password"}
                icon={Lock}
                placeholder="Confirm your new password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((c) => !c)}
                    className="text-muted-foreground/60 hover:text-foreground cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                }
                required
              />

              <Button
                type="submit"
                disabled={loading || !token}
                className="w-full cursor-pointer"
              >
                {loading ? "Resetting..." : "Reset Password"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-muted-foreground">Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
