"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Users,
  GraduationCap,
  Building2,
  Calendar,
  Briefcase,
  Handshake,
  UserCheck,
  ArrowRight,
} from "lucide-react";

import DashboardSidebar from "@/components/layout/DashboardSidebar";
import { useAuth } from "@/contexts/auth-context";
import { useDashboardStatsQuery } from "@/hooks/queries/admin";

export default function MainAdminDashboard() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { data: stats } = useDashboardStatsQuery();

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

  const actions = [
    {
      title: "Manage Users",
      description:
        "View users, filter by role and assign club managers.",
      href: "/main-admin/users",
    },
    {
      title: "Pending Alumni",
      description: `Approve or reject alumni registrations (${
        stats?.pendingAlumni ?? 0
      } pending).`,
      href: "/admin/pending",
    },
    {
      title: "Club Events",
      description: "Browse all club events on the platform.",
      href: "/club-events",
    },
    {
      title: "Events",
      description: "Browse alumni events.",
      href: "/events",
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar role="admin" />

      <main className="flex-1 overflow-auto">
        <div className="p-6 max-w-7xl mx-auto space-y-10">
          <div>
            <h1 className="text-4xl font-bold text-navy-900">
              Main Administrator
            </h1>

            <p className="text-gray-600 mt-2">
              Manage users, clubs and the overall alumni platform.
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
                      <p className="text-sm text-gray-500">
                        {card.title}
                      </p>

                      <h2 className="text-3xl font-bold mt-2">
                        {card.value}
                      </h2>
                    </div>

                    <div className={`${card.color} p-3 rounded-xl`}>
                      <Icon className="h-6 w-6" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-6">
              Quick Actions
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {actions.map((action) => (
                <Link
                  key={action.title}
                  href={action.href}
                  className="bg-white border rounded-xl shadow hover:shadow-lg transition p-6"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-xl font-semibold">
                        {action.title}
                      </h3>

                      <p className="text-gray-600 mt-2">
                        {action.description}
                      </p>
                    </div>

                    <ArrowRight className="h-6 w-6" />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border shadow p-6">
            <h2 className="text-2xl font-bold">
              Recent Activity
            </h2>

            <p className="text-gray-500 mt-6">
              Recent platform activities will appear here.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}