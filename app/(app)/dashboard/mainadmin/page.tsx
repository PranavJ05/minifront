"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Shield, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/auth-context";
import {
  getPrimaryRole,
  normalizeRoleForDisplay,
  isMainAdmin,
  isBatchAdmin,
} from "@/lib/roleUtils";

export default function MainAdminDashboard() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();

  const userRole = getPrimaryRole(user?.roles) || "alumni";
  const normalizedRole = normalizeRoleForDisplay(userRole);
  const isMain = isMainAdmin(user?.roles);
  const isBatch = isBatchAdmin(user?.roles);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated || !user) {
      router.replace("/auth/login");
    }
  }, [authLoading, isAuthenticated, user, router]);

  if (!user) return null;

  return (
    <div className="w-full px-4 sm:px-6 pb-6 space-y-6">
      {/* Sticky Header */}
      <div className="sticky top-14 z-30 bg-background/95 backdrop-blur-md py-4 border-b border-border/40 -mx-4 sm:-mx-6 px-4 sm:px-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold tracking-tight text-foreground">
                {normalizedRole === "admin"
                  ? "Main Administrator"
                  : "Batch Administrator"}
              </h1>
              <Badge variant="secondary" className="text-[10px]">
                {isMain ? "Super Admin" : "Batch Admin"}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              {normalizedRole === "admin"
                ? "Manage users, skills, applications and platform operations."
                : "Manage alumni applications and batch-specific tasks."}
            </p>
          </div>
          {(isMain || isBatch) && (
            <Button size="sm" asChild className="cursor-pointer">
              <Link href="/main-admin">
                <Shield className="h-4 w-4 mr-1" />
                Admin Portal
              </Link>
            </Button>
          )}
        </div>
      </div>

      {/* Admin Portal Banner */}
      {(isMain || isBatch) && (
        <Card className="p-6 bg-card border-border shadow-xs">
          <CardContent className="p-0 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2 max-w-xl">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <Shield className="h-5 w-5" />
                </div>
                <h2 className="text-base font-semibold text-foreground">
                  Administrative Control Portal
                </h2>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {isMain
                  ? "Manage alumni applications, user roles, batch administrators, and custom skills moderation."
                  : "Review pending alumni applications and perform batch administrator tasks."}
              </p>
            </div>

            <Button asChild className="cursor-pointer shrink-0">
              <Link href="/main-admin">
                Open Admin Portal <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Recent Activity Card */}
      <Card className="p-4">
        <CardContent className="p-0 space-y-3">
          <div className="flex items-center justify-between border-b border-border/40 pb-3">
            <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Activity className="h-4 w-4 text-muted-foreground" />
              Platform Activity Stream
            </h2>
            <Badge variant="outline" className="text-[10px]">
              Live Feed
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground py-8 text-center">
            Platform audit logs and recent activities will stream here automatically.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
