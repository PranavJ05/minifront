"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import DashboardSidebar from "./DashboardSidebar";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { SidebarInset } from "@/components/ui/sidebar";

interface StoredUser {
  email?: string;
  role?: string;
  roles?: string[];
  fullName?: string;
  name?: string;
}

const AUTH_ROUTES = [
  "/auth/login",
  "/auth/signup",
  "/auth/pending",
  "/forgot-password",
  "/reset-password",
  "/verify-success",
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [user, setUser] = useState<StoredUser | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("alumni_user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        setUser(null);
      }
    }
  }, []);

  const isAuthRoute = AUTH_ROUTES.includes(pathname);
  const isAuthenticated = mounted && !!user;

  if (!mounted) {
    return <div className="min-h-screen bg-background" />;
  }

  if (isAuthRoute) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <main className="flex-1">{children}</main>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    );
  }

  const userRole = user?.roles?.[0] || user?.role || "alumni";
  const normalizedRole = userRole === "batch_admin" ? "alumni" : userRole;

  return (
    <div className="flex min-h-screen bg-background w-full">
      <DashboardSidebar
        role={normalizedRole as any}
        userName={user?.fullName || user?.name || null}
        userEmail={user?.email || ""}
      />
      <SidebarInset>
        <Navbar />
        <main className="flex-1">{children}</main>
      </SidebarInset>
    </div>
  );
}
