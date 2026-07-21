"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  GraduationCap,
  Mail,
  Clock,
  CheckCircle2,
  ArrowLeft,
  RefreshCw,
  AlertCircle,
  User,
  Building2,
  Calendar,
  XCircle,
  HelpCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { usePendingStatusQuery } from "@/hooks/queries/auth";
import type { PendingStatusResponse } from "@/hooks/queries/auth";

type PendingUser = {
  id: string;
  name: string;
  email: string;
  department: string;
  batchYear: string | number;
  status: string;
};

function readPendingData(): { user: PendingUser | null; userId: number | null } {
  if (typeof window === "undefined") return { user: null, userId: null };
  try {
    const raw = localStorage.getItem("pendingUserData");
    if (!raw) return { user: null, userId: null };
    const parsed = JSON.parse(raw) as {
      user?: PendingUser;
      status?: string;
    };
    if (!parsed.user) return { user: null, userId: null };
    const userId = Number(parsed.user.id) || null;
    return { user: parsed.user, userId };
  } catch {
    return { user: null, userId: null };
  }
}

function clearPendingData() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("pendingUserData");
}

const steps = [
  { label: "Account Created", icon: CheckCircle2, done: true },
  { label: "Admin Review", icon: Clock, done: false },
  { label: "Notified", icon: Mail, done: false },
];

function PendingScreen({ user }: { user: PendingUser }) {
  return (
    <Card className="text-center">
      <CardContent className="flex flex-col items-center pt-4 pb-2 gap-1">
        <div className="inline-flex items-center justify-center w-10 h-10 bg-muted rounded-full mb-1">
          <Clock className="h-5 w-5 text-muted-foreground" />
        </div>

        <h1 className="text-lg font-semibold tracking-tight text-foreground">
          You&apos;re on the List!
        </h1>

        <p className="text-xs text-muted-foreground leading-relaxed">
          Submitted &mdash; awaiting admin approval. This takes{" "}
          <span className="font-medium text-foreground">1&ndash;3 business days</span>.
        </p>
      </CardContent>

      <div className="px-(--card-spacing) pb-2">
        <div className="flex items-center justify-center gap-0">
          {steps.map(({ label, icon: Icon, done }, i) => (
            <div key={label} className="flex items-center">
              <div
                className={cn(
                  "flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-medium transition-colors",
                  done
                    ? "bg-primary/10 text-primary"
                    : "bg-muted text-muted-foreground",
                )}
              >
                <Icon className="h-3 w-3" />
                {label}
              </div>
              {i < steps.length - 1 && (
                <div
                  className={cn(
                    "w-5 h-px mx-0.5",
                    done ? "bg-primary/30" : "bg-border",
                  )}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="px-(--card-spacing) pb-3">
        <div className="bg-muted/30 border border-border rounded-lg p-2.5 text-left space-y-1.5">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
            Your Details
          </p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <User className="h-3 w-3 shrink-0 text-muted-foreground/60" />
            <span className="font-medium text-foreground">{user.name}</span>
            <span className="text-muted-foreground/40">&middot;</span>
            <span>{user.email}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Building2 className="h-3 w-3 shrink-0 text-muted-foreground/60" />
            <span>{user.department}</span>
            <span className="text-muted-foreground/40">&middot;</span>
            <span>Batch of {user.batchYear}</span>
            <span className="text-muted-foreground/40">&middot;</span>
            <Badge variant="outline" className="text-[10px] h-4">
              {user.status}
            </Badge>
          </div>
        </div>
      </div>

      <div className="px-(--card-spacing) pb-3">
        <p className="text-[10px] text-muted-foreground/60 leading-relaxed">
          Once approved, you&apos;ll be auto-redirected to login. Sign in with your credentials.
        </p>
      </div>
    </Card>
  );
}

function RejectedScreen({ message, onClear }: { message: string; onClear: () => void }) {
  return (
    <Card className="text-center">
      <CardContent className="flex flex-col items-center pt-5 pb-4 gap-2">
        <div className="inline-flex items-center justify-center w-10 h-10 bg-destructive/10 rounded-full mb-1">
          <XCircle className="h-5 w-5 text-destructive" />
        </div>
        <h1 className="text-lg font-semibold tracking-tight text-foreground">
          Registration Declined
        </h1>
        <p className="text-xs text-muted-foreground leading-relaxed max-w-sm">
          {message || "Your account registration has been declined by the admin team."}
        </p>
      </CardContent>
      <div className="px-(--card-spacing) pb-5 flex justify-center gap-3">
        <Button variant="outline" onClick={onClear} className="cursor-pointer">
          Back to Signup
        </Button>
      </div>
    </Card>
  );
}

function NotFoundScreen({ onClear }: { onClear: () => void }) {
  return (
    <Card className="text-center">
      <CardContent className="flex flex-col items-center pt-5 pb-4 gap-2">
        <div className="inline-flex items-center justify-center w-10 h-10 bg-muted rounded-full mb-1">
          <AlertCircle className="h-5 w-5 text-muted-foreground" />
        </div>
        <h1 className="text-lg font-semibold tracking-tight text-foreground">
          Account Not Found
        </h1>
        <p className="text-xs text-muted-foreground leading-relaxed max-w-sm">
          We could not find an account matching your registration details. It may have been removed.
        </p>
      </CardContent>
      <div className="px-(--card-spacing) pb-5 flex justify-center gap-3">
        <Button variant="outline" onClick={onClear} className="cursor-pointer">
          Back to Signup
        </Button>
      </div>
    </Card>
  );
}

export default function PendingPage() {
  const router = useRouter();
  const [user, setUser] = useState<PendingUser | null>(null);
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const data = readPendingData();
    if (!data.user) {
      router.replace("/auth/login");
      return;
    }
    setUser(data.user);
    setUserId(data.userId);
  }, [router]);

  const { data: statusResult, isFetching, isError, refetch } = usePendingStatusQuery(userId);

  useEffect(() => {
    if (statusResult?.status === "ACTIVE") {
      clearPendingData();
      router.push("/auth/login?approved=true");
    }
  }, [statusResult, router]);

  const handleClearAndBack = () => {
    clearPendingData();
    router.push("/auth/signup");
  };

  if (!user) return null;

  const showFetching = isFetching && !statusResult;
  const showError = isError && !statusResult;
  const finalStatus = statusResult?.status;

  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md text-foreground">
        <div className="w-full px-4 sm:px-6">
          <div className="flex items-center justify-between h-14">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="bg-primary p-1.5 rounded-lg group-hover:bg-primary/90 transition-colors">
                <GraduationCap className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-semibold text-sm tracking-wider uppercase text-foreground">
                ARC
              </span>
            </Link>

            <Link
              href="/auth/login"
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors font-medium"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Login
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-xl mx-auto px-4 py-8 space-y-4">
        {showFetching && (
          <Card>
            <CardContent className="flex flex-col items-center py-8 gap-2">
              <RefreshCw className="h-6 w-6 text-muted-foreground animate-spin" />
              <p className="text-xs text-muted-foreground">Checking your status&hellip;</p>
            </CardContent>
          </Card>
        )}

        {showError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <p className="font-medium mb-1 text-xs">Status check failed</p>
              <p className="text-xs mb-3">We couldn&apos;t verify your approval status right now.</p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="xs"
                  onClick={() => refetch()}
                  className="cursor-pointer"
                >
                  <RefreshCw className="h-3 w-3" />
                  Try again
                </Button>
                <Button variant="ghost" size="xs" onClick={handleClearAndBack} className="cursor-pointer">
                  Clear &amp; start over
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {finalStatus === "PENDING" && <PendingScreen user={user} />}
        {finalStatus === "REJECTED" && (
          <RejectedScreen message={statusResult?.message || ""} onClear={handleClearAndBack} />
        )}
        {finalStatus === null && <NotFoundScreen onClear={handleClearAndBack} />}

        {finalStatus === "PENDING" && isFetching && (
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <RefreshCw className="h-3 w-3 animate-spin" />
            Checking approval status&hellip;
          </div>
        )}

        <Card className="bg-muted/20 border-border/60">
          <CardContent className="flex items-center gap-3 pt-3 pb-3">
            <HelpCircle className="h-4 w-4 text-muted-foreground shrink-0" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              Need help? Reach out to{" "}
              <a
                href="mailto:arc@mec.ac.in"
                className="text-foreground font-medium hover:text-foreground/80 underline underline-offset-2 transition-colors"
              >
                arc@mec.ac.in
              </a>{" "}
              &mdash; we&apos;ll get back to you.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
