"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Shield,
  Users,
  GraduationCap,
  CheckCircle,
  ArrowRight,
  Lock,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/contexts/auth-context";
import { isMainAdmin, isBatchAdmin, isAnyAdmin } from "@/lib/roleUtils";

interface AdminTask {
  title: string;
  description: string;
  href: string;
  icon: React.ElementType;
  adminOnly: boolean;
  badge?: string;
}

export default function AdminPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isBatchAdminUser, setIsBatchAdminUser] = useState(false);

  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated || !user) {
      router.replace("/auth/login");
      return;
    }

    const hasAdminAccess = isAnyAdmin(user.roles);
    const mainAdmin = isMainAdmin(user.roles);
    const batchAdmin = isBatchAdmin(user.roles);

    setIsAuthorized(hasAdminAccess);
    setIsAdmin(mainAdmin);
    setIsBatchAdminUser(batchAdmin);

    if (!hasAdminAccess) {
      router.replace("/dashboard/mainadmin");
    }
  }, [authLoading, isAuthenticated, user, router]);

  const adminTasks: AdminTask[] = [
    {
      title: "Skills Moderation",
      description: "Approve or reject custom skills submitted by alumni",
      href: "/main-admin/skills",
      icon: GraduationCap,
      adminOnly: true,
      badge: "Super Admin",
    },
    {
      title: "Batch Admin Promotion",
      description: "Promote alumni to batch admin role and manage assignments",
      href: "/main-admin/manage-batch-admin",
      icon: Shield,
      adminOnly: true,
      badge: "Super Admin",
    },
    {
      title: "Users Management",
      description: "View users and assign club managers for club operations",
      href: "/main-admin/users",
      icon: Users,
      adminOnly: true,
      badge: "Super Admin",
    },
    {
      title: "Alumni Application Review",
      description: "Review and approve pending alumni membership applications",
      href: "/main-admin/alumni-applications",
      icon: CheckCircle,
      adminOnly: false,
    },
  ];

  if (authLoading || !isAuthorized) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const filteredTasks = isAdmin
    ? adminTasks
    : adminTasks.filter((task) => !task.adminOnly);

  return (
    <div className="w-full px-4 sm:px-6 pb-6 space-y-6">
      {/* Sticky Header */}
      <div className="sticky top-14 z-30 bg-background/95 backdrop-blur-md py-4 border-b border-border/40 -mx-4 sm:-mx-6 px-4 sm:px-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h1 className="text-xl font-semibold tracking-tight text-foreground flex items-center gap-2">
              <Shield className="h-5 w-5 text-muted-foreground" /> Admin Portal
            </h1>
            <p className="text-xs text-muted-foreground">
              {isAdmin
                ? "Full access to administrative management operations."
                : "Batch Administrator access portal."}
            </p>
          </div>
          <Badge variant="secondary" className="text-xs font-normal">
            {isAdmin ? "Super Admin" : "Batch Admin"}
          </Badge>
        </div>
      </div>

      {!isAdmin && isBatchAdminUser && (
        <Alert className="border-amber-500/30 bg-amber-500/10 text-amber-700">
          <Lock className="h-4 w-4" />
          <AlertDescription className="text-xs">
            As a batch administrator, you have access to alumni approval. Contact the super administrator for higher-level permissions.
          </AlertDescription>
        </Alert>
      )}

      {/* Admin Tasks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTasks.map((task) => {
          const Icon = task.icon;
          return (
            <Card key={task.href} className="p-5 flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-xl bg-muted text-foreground">
                    <Icon className="h-5 w-5" />
                  </div>
                  {task.adminOnly && (
                    <Badge variant="outline" className="text-[10px]">
                      {task.badge}
                    </Badge>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-foreground">
                    {task.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    {task.description}
                  </p>
                </div>
              </div>

              <Button variant="outline" size="sm" asChild className="w-full justify-between cursor-pointer text-xs">
                <Link href={task.href}>
                  Access Module <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </Card>
          );
        })}
      </div>

      {filteredTasks.length === 0 && (
        <Card className="p-8 text-center">
          <CardContent className="p-0 flex flex-col items-center gap-2">
            <AlertCircle className="h-8 w-8 text-muted-foreground/40" />
            <p className="font-semibold text-sm text-foreground">No Admin Tasks Available</p>
            <p className="text-xs text-muted-foreground">
              You do not have active administrative assignments at this time.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
