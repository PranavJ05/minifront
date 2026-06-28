"use client";
// components/layout/Navbar.tsx
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  X,
  GraduationCap,
  Bell,
  LogOut,
  User,
  Briefcase,
  Calendar,
  Home,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "next-themes";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Sun, Moon } from "lucide-react";

interface NavbarProps {
  isAuthenticated?: boolean;
  userRole?: string;
  userName?: string;
}

interface StoredUser {
  email?: string;
  role?: string;
  fullName?: string;
  name?: string;
}

export default function Navbar({
  isAuthenticated: isAuthenticatedProp,
  userRole: userRoleProp,
  userName: userNameProp,
}: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [storedUser, setStoredUser] = useState<StoredUser | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [customEventTitle, setCustomEventTitle] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("current_event_title");
      if (stored) setCustomEventTitle(stored);

      const handleTitleChange = () => {
        const title = sessionStorage.getItem("current_event_title");
        setCustomEventTitle(title);
      };

      window.addEventListener("current_event_title_changed", handleTitleChange);
      return () => window.removeEventListener("current_event_title_changed", handleTitleChange);
    }
  }, []);

  useEffect(() => {
    const syncAuthState = () => {
      const token = localStorage.getItem("token");
      const user = localStorage.getItem("alumni_user");

      if (!token || !user) {
        setStoredUser(null);
        return;
      }

      try {
        setStoredUser(JSON.parse(user));
      } catch (error) {
        console.error("Failed to parse navbar user:", error);
        setStoredUser(null);
      }
    };

    syncAuthState();
    window.addEventListener("storage", syncAuthState);

    return () => window.removeEventListener("storage", syncAuthState);
  }, []);

  const resolvedRole = (userRoleProp || storedUser?.role || "").toLowerCase();
  const normalizedRole =
    resolvedRole === "batch_admin" ? "alumni" : resolvedRole;
  const resolvedName =
    userNameProp || storedUser?.fullName || storedUser?.name || "User";
  const isAuthenticated =
    typeof isAuthenticatedProp === "boolean"
      ? isAuthenticatedProp
      : Boolean(storedUser);

  const getDashboardLink = () => {
    switch (normalizedRole) {
      case "faculty":
        return "/dashboard/faculty";
      case "student":
        return "/dashboard/student";
      case "alumni":
        return "/dashboard/alumni";
      default:
        return "/";
    }
  };

  const authLinks = useMemo(() => {
    if (normalizedRole === "faculty") {
      return [
        { href: "/dashboard/faculty", label: "Overview", icon: Home },
        { href: "/alumni", label: "Alumni", icon: Users },
        { href: "/faculty", label: "Faculty", icon: GraduationCap },
        { href: "/events", label: "Events", icon: Calendar },
        { href: "/opportunities", label: "Jobs", icon: Briefcase },
      ];
    }

    return [
      {
        href: "/alumni",
        label: normalizedRole === "student" ? "Find Alumni" : "Network",
        icon: Users,
      },
      { href: "/faculty", label: "Faculty", icon: GraduationCap },
      { href: "/events", label: "Events", icon: Calendar },
      {href: "/alumni-sessions",label: "Sessions",icon: Calendar},
      { href: "/opportunities", label: "Opportunities", icon: Briefcase },
    ];
  }, [normalizedRole]);

  const handleLogout = () => {
    console.log("[Logout] Clearing all auth data...");
    localStorage.removeItem("alumni_user");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("email");
    console.log("[Logout] localStorage cleared");
    setStoredUser(null);
    setIsOpen(false);
    router.push("/");
  };

  const breadcrumbs = useMemo(() => {
    const parts = pathname.split("/").filter(Boolean);
    if (parts.length === 0) return [{ label: "Home", href: "/" }];
    return parts.map((part, index) => {
      const href = "/" + parts.slice(0, index + 1).join("/");
      let label = part.charAt(0).toUpperCase() + part.slice(1).replace(/-/g, " ");
      
      // If we are on the event details page, replace ID with dynamic event title
      if (parts[0] === "events" && index === 1 && customEventTitle) {
        label = customEventTitle;
      }
      
      return { label, href };
    });
  }, [pathname, customEventTitle]);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md text-foreground">
      <div className="w-full px-6">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-2 min-w-0">
            {isAuthenticated ? (
              <>
                <SidebarTrigger className="h-8 w-8 text-muted-foreground hover:text-foreground shrink-0 cursor-pointer mr-1" />
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium truncate">
                  {breadcrumbs.map((crumb, idx) => (
                    <div key={crumb.href} className="flex items-center gap-1.5">
                      {idx > 0 && <span className="text-border">/</span>}
                      <Link
                        href={crumb.href}
                        className={cn(
                          "hover:text-foreground transition-colors truncate max-w-[120px] sm:max-w-none",
                          idx === breadcrumbs.length - 1 && "text-foreground font-semibold"
                        )}
                      >
                        {crumb.label}
                      </Link>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <Link href="/" className="flex items-center gap-2 group">
                <div className="bg-primary/10 p-1 rounded-md text-primary group-hover:bg-primary/20 transition-colors">
                  <GraduationCap className="h-4 w-4" />
                </div>
                <span className="font-sans font-semibold text-sm tracking-wider uppercase text-foreground">
                  ALUMNI
                </span>
              </Link>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Theme Toggle Button */}
            {mounted && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="text-muted-foreground hover:text-foreground cursor-pointer"
              >
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                <span className="sr-only">Toggle Theme</span>
              </Button>
            )}

            {isAuthenticated ? (
              <Button size="icon" variant="ghost" className="text-muted-foreground hover:text-foreground">
                <Bell className="h-4 w-4" />
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm">Login</Button>
                </Link>
                <Link href="/auth/signup">
                  <Button size="sm">Join Network</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
