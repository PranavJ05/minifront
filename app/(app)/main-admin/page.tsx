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
      badge: "Admin Only",
    },
    {
      title: "Batch Admin Promotion",
      description: "Promote alumni to batch admin role and manage assignments",
      href: "/main-admin/manage-batch-admin",
      icon: Shield,
      adminOnly: true,
      badge: "Admin Only",
    },
    {
      title: "Users Management",
      description: "View users and assign club managers for club purposes",
      href: "/main-admin/users",
      icon: Users,
      adminOnly: true,
      badge: "Admin Only",
    },
    {
      title: "Alumni Approval",
      description: "Review and approve pending alumni membership applications",
      href: "/main-admin/alumni-applications",
      icon: CheckCircle,
      adminOnly: false,
    },
  ];

  if (authLoading || !isAuthorized) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-navy-800" />
      </div>
    );
  }

  const filteredTasks = isAdmin
    ? adminTasks
    : adminTasks.filter((task) => !task.adminOnly);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-navy-900 flex items-center justify-center">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-navy-900">Admin Portal</h1>
              <p className="text-gray-600 text-sm mt-1">
                {isAdmin
                  ? "Main Administrator - Full access to all admin functions"
                  : "Batch Administrator - Limited admin access"}
              </p>
            </div>
          </div>

          {!isAdmin && isBatchAdminUser && (
            <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
              <Lock className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-800">
                  Batch Admin Access
                </p>
                <p className="text-sm text-amber-700 mt-1">
                  As a batch admin, you have access to alumni approval only.
                  Contact the main administrator for additional permissions.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Admin Tasks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredTasks.map((task) => {
            const Icon = task.icon;
            return (
              <Link
                key={task.href}
                href={task.href}
                className="bg-white border rounded-xl shadow-sm hover:shadow-md transition-all p-6 group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg bg-navy-100 flex items-center justify-center group-hover:bg-navy-200 transition-colors">
                    <Icon className="h-6 w-6 text-navy-900" />
                  </div>
                  {task.adminOnly && (
                    <span className="px-2 py-1 bg-navy-100 text-navy-700 text-xs font-medium rounded-full">
                      {task.badge}
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-semibold text-navy-900 mb-2">
                  {task.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4">{task.description}</p>
                <div className="flex items-center text-navy-700 text-sm font-medium group-hover:text-navy-800">
                  <span>Access</span>
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>

        {filteredTasks.length === 0 && (
          <div className="text-center py-12">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              No Admin Tasks Available
            </h3>
            <p className="text-gray-500">
              You don't have access to any admin tasks at this time.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
