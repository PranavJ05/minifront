"use client";

import { useAuth } from "@/contexts/auth-context";
import DashboardSidebar from "@/components/layout/DashboardSidebar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { SidebarInset } from "@/components/ui/sidebar";
import { normalizeRoleForDisplay } from "@/lib/roleUtils";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div className="min-h-screen bg-background" />;
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col bg-background w-full">
        <Navbar />
        <main className="flex-1 w-full">{children}</main>
        <Footer />
      </div>
    );
  }

  const userRole = user?.roles?.[0] || "alumni";
  const normalizedRole = normalizeRoleForDisplay(userRole);

  return (
    <div className="flex min-h-screen bg-background w-full">
      <DashboardSidebar role={normalizedRole} />
      <SidebarInset>
        <Navbar />
        <main className="flex-1 w-full">{children}</main>
      </SidebarInset>
    </div>
  );
}
