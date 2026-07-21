"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function VerifySuccessPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/auth/login");
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardContent className="flex flex-col items-center py-10 text-center gap-3">
          <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="h-7 w-7" />
          </div>

          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            Email Verified Successfully
          </h1>

          <p className="text-xs text-muted-foreground leading-relaxed max-w-xs">
            Your email has been verified and your account is active. You can now log in to access the platform.
          </p>

          <p className="text-[10px] text-muted-foreground/60">
            Redirecting to login in 3 seconds...
          </p>

          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/auth/login")}
            className="mt-2 cursor-pointer"
          >
            Go to Login
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}