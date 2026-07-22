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
  Sparkles,
} from "lucide-react";
import AuthInput from "@/components/auth/AuthInput";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

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
      const res = await fetch(`${BACKEND_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const errorData = await res.text();
        console.error("[Forgot Password] Backend error:", errorData);
      }

      setSuccess(true);
    } catch {
      setSuccess(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Panel */}
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
            Account Security
          </Badge>
          <h1 className="text-3xl font-bold text-foreground leading-tight tracking-tight">
            Reset access to your account
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Enter your email and, if it exists in our system, we&apos;ll send a secure reset link.
          </p>
        </div>

        <p className="text-xs text-muted-foreground">
          Reset links expire for security reasons. Request a new one if needed.
        </p>
      </div>

      {/* Right Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md space-y-6">
          <Link
            href="/auth/login"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors font-medium"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to login
          </Link>

          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Forgot password?
            </h2>
            <p className="text-xs text-muted-foreground">
              Enter your email to receive a password reset link.
            </p>
          </div>

          {success ? (
            <Card>
              <CardContent className="flex flex-col items-center py-8 text-center gap-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-foreground text-sm">
                  Check your inbox
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed max-w-xs">
                  {SUCCESS_MESSAGE}
                </p>
                <Button asChild className="mt-4 cursor-pointer">
                  <Link href="/auth/login">Return to login</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <AuthInput
                label="Email Address"
                type="email"
                icon={Mail}
                placeholder="you@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />

              {error && (
                <Alert variant="destructive">
                  <AlertDescription className="text-xs">{error}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full cursor-pointer flex items-center justify-center gap-2"
              >
                <Send className="h-3.5 w-3.5" />
                {loading ? "Sending link..." : "Send reset link"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
