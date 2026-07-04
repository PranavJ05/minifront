"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Users,
  GraduationCap,
  Building2,
  Calendar,
  Briefcase,
  Handshake,
  UserCheck,
  ArrowRight,
  Shield,
} from "lucide-react";

import DashboardSidebar from "@/components/layout/DashboardSidebar";
import { useAuth } from "@/contexts/auth-context";
import { useDashboardStatsQuery } from "@/hooks/queries/admin";
import {
  getPrimaryRole,
  normalizeRoleForDisplay,
  isMainAdmin,
  isBatchAdmin,
} from "@/lib/roleUtils";

export default function MainAdminDashboard() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { data: stats } = useDashboardStatsQuery();

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

  const cards = [
    {
      title: "Total Users",
      value: stats?.totalUsers ?? 0,
      icon: Users,
      color: "bg-blue-100 text-blue-700",
    },
    {
      title: "Students",
      value: stats?.students ?? 0,
      icon: GraduationCap,
      color: "bg-green-100 text-green-700",
    },
    {
      title: "Alumni",
      value: stats?.alumni ?? 0,
      icon: UserCheck,
      color: "bg-yellow-100 text-yellow-700",
    },
    {
      title: "Faculty",
      value: stats?.faculty ?? 0,
      icon: Users,
      color: "bg-purple-100 text-purple-700",
    },
    {
      title: "Clubs",
      value: stats?.clubs ?? 0,
      icon: Building2,
      color: "bg-red-100 text-red-700",
    },
    {
      title: "Club Events",
      value: stats?.clubEvents ?? 0,
      icon: Calendar,
      color: "bg-indigo-100 text-indigo-700",
    },
    {
      title: "Mentorships",
      value: stats?.mentorships ?? 0,
      icon: Handshake,
      color: "bg-pink-100 text-pink-700",
    },
    {
      title: "Jobs",
      value: stats?.opportunities ?? 0,
      icon: Briefcase,
      color: "bg-orange-100 text-orange-700",
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar role={normalizedRole} />

      <main className="flex-1 overflow-auto">
        <div className="p-6 max-w-7xl mx-auto space-y-10">
          <div>
            <h1 className="text-4xl font-bold text-navy-900">
              {normalizedRole === "admin"
                ? "Main Administrator"
                : "Batch Administrator"}
            </h1>

            <p className="text-gray-600 mt-2">
              {normalizedRole === "admin"
                ? "Manage users, clubs and the overall alumni platform."
                : "Manage alumni applications and batch-specific tasks."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {cards.map((card) => {
              const Icon = card.icon;

              return (
                <div
                  key={card.title}
                  className="bg-white rounded-xl shadow p-6 border"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-500">{card.title}</p>

                      <h2 className="text-3xl font-bold mt-2">{card.value}</h2>
                    </div>

                    <div className={`${card.color} p-3 rounded-xl`}>
                      <Icon className="h-6 w-6" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Admin Portal CTA - For both main admin and batch admin */}
          {(isMain || isBatch) && (
            <div
              className={`rounded-xl shadow-lg p-8 text-white ${
                isMain
                  ? "bg-gradient-to-r from-navy-900 to-navy-800"
                  : "bg-gradient-to-r from-amber-600 to-amber-700"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Admin Portal</h2>
                  <p
                    className={`${isMain ? "text-gray-300" : "text-gray-100"} mb-4`}
                  >
                    {isMain
                      ? "Access all admin powers and actions from one central location"
                      : "Access batch admin functions including alumni approval"}
                  </p>
                  <Link
                    href="/main-admin"
                    className={`inline-flex items-center gap-2 font-semibold px-6 py-3 rounded-lg transition-colors ${
                      isMain
                        ? "bg-gold-500 hover:bg-gold-600 text-navy-900"
                        : "bg-white hover:bg-gray-100 text-amber-700"
                    }`}
                  >
                    <Shield className="h-5 w-5" />
                    Go to Admin Portal
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </div>
                <div className="hidden md:block">
                  <div className="w-20 h-20 bg-white/10 rounded-xl flex items-center justify-center">
                    <Shield
                      className={`h-10 w-10 ${isMain ? "text-gold-500" : "text-white"}`}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white rounded-xl border shadow p-6">
            <h2 className="text-2xl font-bold">Recent Activity</h2>

            <p className="text-gray-500 mt-6">
              Recent platform activities will appear here.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
