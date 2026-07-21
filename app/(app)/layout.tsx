"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import DashboardSidebar from "@/components/layout/DashboardSidebar";
import Navbar from "@/components/layout/Navbar";
import ProfileCompletionBar from "@/components/onboarding/ProfileCompletionBar";
import WelcomeModal from "@/components/onboarding/WelcomeModal";
import { SidebarInset } from "@/components/ui/sidebar";
import { getPrimaryRole, normalizeRoleForDisplay } from "@/lib/roleUtils";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      const pendingRaw = typeof window !== "undefined" ? localStorage.getItem("pendingUserData") : null;
      if (pendingRaw) {
        router.replace("/auth/pending");
        return;
      }
      const shouldRedirect = pathname && !pathname.startsWith("/dashboard/");
      const target = shouldRedirect
        ? `/auth/login?next=${encodeURIComponent(pathname)}`
        : "/auth/login";
      router.replace(target);
    }
  }, [isLoading, isAuthenticated, pathname, router]);

  if (isLoading || !isAuthenticated || !user) {
    return <div className="min-h-screen bg-background" />;
  }

  const userRole = getPrimaryRole(user.roles) || "alumni";
  const normalizedRole = normalizeRoleForDisplay(userRole);

  return (
    <div className="flex min-h-screen bg-background w-full">
      <DashboardSidebar role={normalizedRole} />
      <SidebarInset>
        <Navbar />
        <ProfileCompletionBar />
        <main className="flex-1 w-full">{children}</main>
        <WelcomeModal />
      </SidebarInset>
    </div>
  );
}
