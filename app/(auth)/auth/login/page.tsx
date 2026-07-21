"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  Clock,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Briefcase,
  Users,
  Sparkles,
} from "lucide-react";
import AuthInput from "@/components/auth/AuthInput";
import Logo from "@/components/layout/Logo";
import ThemeToggle from "@/components/layout/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/auth-context";
import { BACKEND_URL } from "@/lib/config";
import { getDashboardPathForRoles } from "@/lib/roleUtils";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const resetSuccess = useMemo(
    () => searchParams.get("reset") === "success",
    [searchParams],
  );

  const approvedSuccess = useMemo(
    () => searchParams.get("approved") === "true",
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
      const data = await login({
        email: formData.email.trim(),
        password: formData.password,
      });

      if (data.emailVerificationRequired) {
        router.push(
          `/auth/verify-otp?email=${encodeURIComponent(data.email!)}`,
        );
        return;
      }
      if (data.approvalPending) {
        router.push("/auth/pending");
        return;
      }

      const storedUserRaw = localStorage.getItem("alumni_user");
      let allRoles: string[] = [];

      if (storedUserRaw) {
        try {
          const storedUser = JSON.parse(storedUserRaw) as {
            roles?: unknown;
          };

          if (Array.isArray(storedUser.roles)) {
            allRoles = storedUser.roles.filter(
              (role): role is string => typeof role === "string",
            );
          }
        } catch {
          // ignore parse failure
        }
      }

      if (allRoles.length === 0) {
        if (Array.isArray(data.roles)) allRoles = data.roles;
        else if (typeof data.roles === "string") allRoles = [data.roles];
        else if (typeof data.role === "string") allRoles = [data.role];
      }

      try {
        const profileRes = await fetch(`${BACKEND_URL}/api/profile/me`, {
          headers: { Authorization: `Bearer ${data.token}` },
        });

        if (profileRes.ok) {
          const profileData = await profileRes.json();

          const profileRoles = Array.isArray(profileData.roles)
            ? profileData.roles
            : typeof profileData.role === "string"
              ? [profileData.role]
              : [];

          if (profileRoles.length > 0) {
            allRoles = profileRoles;
          }

          updateUser({
            alumniId: profileData.alumniId ?? data.alumniId ?? null,
            courseId: profileData.courseId ?? data.courseId ?? null,
            roles: allRoles,
          });
        }
      } catch {
        // ignore profile error fallback
      }

      localStorage.removeItem("pendingUserData");

      const dashboardPath = getDashboardPathForRoles(allRoles);
      const nextPath = searchParams.get("next");
      const safeNextPath =
        nextPath && nextPath.startsWith("/") && !nextPath.startsWith("/auth")
          ? nextPath
          : null;

      router.replace(safeNextPath || dashboardPath);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Unable to sign in right now.";
      const msg = message.toLowerCase();
      if (msg.includes("pending") || msg.includes("approval")) {
        setError("pending");
      } else if (
        msg.includes("invalid") ||
        msg.includes("unauthorized") ||
        msg.includes("bad credentials")
      ) {
        setError("Invalid email or password.");
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex w-full overflow-x-hidden">
      {/* Left Banner - Desktop */}
      <div className="hidden lg:flex lg:w-1/2 bg-card border-r border-border flex-col justify-between p-12 min-h-screen">
        <Logo size="lg" />

        {/* Vector SVG Art */}
        <div className="relative w-full max-w-md aspect-4/3 my-auto mx-auto flex items-center justify-center p-4">
          <svg
            viewBox="0 0 400 300"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full text-foreground/80"
          >
            <defs>
              <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="currentColor" stopOpacity="0.08" />
                <stop offset="100%" stopColor="currentColor" stopOpacity="0.01" />
              </linearGradient>
              <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="currentColor" stopOpacity="0.4" />
                <stop offset="100%" stopColor="currentColor" stopOpacity="0.1" />
              </linearGradient>
            </defs>

            {/* Network Circles */}
            <circle cx="200" cy="150" r="110" fill="url(#bgGrad)" />
            <circle cx="200" cy="150" r="75" stroke="url(#lineGrad)" strokeWidth="1" strokeDasharray="4 4" />
            <circle cx="200" cy="150" r="45" stroke="url(#lineGrad)" strokeWidth="1" />

            {/* Network Nodes & Paths */}
            <path d="M100 150 L200 75 L300 150 L200 225 Z" stroke="url(#lineGrad)" strokeWidth="1.5" strokeLinejoin="round" />
            <path d="M145 105 L255 195 M255 105 L145 195" stroke="url(#lineGrad)" strokeWidth="1" strokeDasharray="3 3" />

            {/* Glowing Points */}
            <circle cx="200" cy="75" r="7" fill="currentColor" fillOpacity="0.9" />
            <circle cx="300" cy="150" r="6" fill="currentColor" fillOpacity="0.8" />
            <circle cx="200" cy="225" r="7" fill="currentColor" fillOpacity="0.9" />
            <circle cx="100" cy="150" r="6" fill="currentColor" fillOpacity="0.8" />
            <circle cx="145" cy="105" r="5" fill="currentColor" fillOpacity="0.6" />
            <circle cx="255" cy="105" r="5" fill="currentColor" fillOpacity="0.6" />
            <circle cx="255" cy="195" r="5" fill="currentColor" fillOpacity="0.6" />
            <circle cx="145" cy="195" r="5" fill="currentColor" fillOpacity="0.6" />

            {/* Center Cap Illustration */}
            <g transform="translate(176, 126)">
              <path
                d="M24 4L2 15L24 26L46 15L24 4Z"
                fill="currentColor"
                fillOpacity="0.2"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
              />
              <path
                d="M9 18.5V30C9 30 15 35 24 35C33 35 39 30 39 30V18.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path d="M42 17.5V31.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <circle cx="42" cy="33.5" r="1.5" fill="currentColor" />
            </g>
          </svg>
        </div>

        <div className="space-y-5 max-w-lg">
          <Badge variant="secondary" className="text-sm px-3.5 py-1 font-medium w-fit">
            <Sparkles className="h-4 w-4 mr-1.5" />
            MEC Alumni Network
          </Badge>
          <h1 className="text-3xl lg:text-4xl font-extrabold text-foreground leading-tight tracking-tight">
            Welcome back to your alumni community
          </h1>
          <p className="text-sm lg:text-base text-muted-foreground leading-relaxed">
            Access placement opportunities, connect with fellow graduates, and engage with campus events.
          </p>

          <div className="space-y-3 pt-2">
            {[
              { icon: Users, text: "Verified MEC alumni & student directory" },
              { icon: Briefcase, text: "Placement & referral opportunities" },
              { icon: ShieldCheck, text: "Official institution portal" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3 text-sm font-medium text-foreground/90">
                <div className="p-2 rounded-lg bg-muted text-foreground shrink-0 border border-border/40">
                  <Icon className="h-4 w-4" />
                </div>
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-sm text-muted-foreground pt-6">
          © {new Date().getFullYear()} Alumni Network. All rights reserved.
        </p>
      </div>

      {/* Right Form Container */}
      <div className="flex-1 flex flex-col justify-between px-4 py-8 min-h-screen">
        <div className="flex items-center justify-end w-full max-w-md mx-auto">
          <ThemeToggle />
        </div>

        <div className="w-full max-w-md space-y-6 mx-auto my-auto py-4">
          <div className="space-y-2">
            <div className="lg:hidden flex items-center justify-between gap-2 mb-4">
              <Logo size="sm" shortTextOnMobile />
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Sign In
            </h2>
            <p className="text-xs text-muted-foreground">
              Enter your email and password to continue.
            </p>
          </div>

          {resetSuccess && (
            <Alert className="border-emerald-500/30 bg-emerald-500/10 text-emerald-600">
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription className="text-xs">
                Password reset successful. You can now sign in with your new password.
              </AlertDescription>
            </Alert>
          )}

          {approvedSuccess && (
            <Alert className="border-emerald-500/30 bg-emerald-500/10 text-emerald-600">
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription className="text-xs">
                Your account is approved! Please sign in below.
              </AlertDescription>
            </Alert>
          )}

          {error === "pending" && (
            <Alert className="border-amber-500/30 bg-amber-500/10 text-amber-700">
              <Clock className="h-4 w-4" />
              <AlertDescription className="text-xs">
                Your account is awaiting admin approval.{" "}
                <Link href="/auth/pending" className="underline font-medium inline-flex items-center gap-1">
                  Check status <ExternalLink className="h-3 w-3" />
                </Link>
              </AlertDescription>
            </Alert>
          )}

          {error && error !== "pending" && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-xs">{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <AuthInput
              label="Email Address"
              type="email"
              placeholder="your.email@example.com"
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
                  className="text-muted-foreground/60 hover:text-foreground cursor-pointer"
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

            <div className="flex items-center justify-end text-xs">
              <Link
                href="/forgot-password"
                className="text-primary hover:underline font-medium"
              >
                Forgot password?
              </Link>
            </div>

            <Button type="submit" disabled={loading} className="w-full cursor-pointer">
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <Card className="p-4 bg-muted/20 text-center text-xs">
            <CardContent className="p-0">
              <p className="text-muted-foreground">
                Don&apos;t have an account yet?{" "}
                <Link
                  href="/auth/signup"
                  className="text-foreground font-semibold hover:underline"
                >
                  Join the Network
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="w-full max-w-md mx-auto text-center text-xs text-muted-foreground py-2">
          © {new Date().getFullYear()} Alumni Network
        </div>
      </div>
    </div>
  );
}
