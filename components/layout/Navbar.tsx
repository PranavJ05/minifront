"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { GraduationCap, Bell, LogOut, Sun, Moon, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "next-themes";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";

interface NavbarProps {
  isAuthenticated?: boolean;
  userRole?: string;
  userName?: string;
}

interface StoredUser {
  email?: string;
  role?: string;
  roles?: string[];
  fullName?: string;
  name?: string;
}

export default function Navbar({
  isAuthenticated: isAuthenticatedProp,
  userRole: userRoleProp,
  userName: userNameProp,
}: NavbarProps) {
  const [storedUser, setStoredUser] = useState<StoredUser | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [customEventTitle, setCustomEventTitle] = useState<string | null>(null);

  const [accountOpen, setAccountOpen] = useState(false);
  const closeTimeout = useRef<NodeJS.Timeout | null>(null);

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
      return () =>
        window.removeEventListener(
          "current_event_title_changed",
          handleTitleChange,
        );
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

  const resolvedRole = (
    userRoleProp ||
    storedUser?.roles?.[0] ||
    storedUser?.role ||
    ""
  ).toLowerCase();
  const normalizedRole =
    resolvedRole === "batch_admin" ? "alumni" : resolvedRole;
  const resolvedName =
    userNameProp || storedUser?.fullName || storedUser?.name || "User";
  const resolvedEmail = storedUser?.email || "";
  const isAuthenticated =
    typeof isAuthenticatedProp === "boolean"
      ? isAuthenticatedProp
      : Boolean(storedUser);

  const roleLabel =
    normalizedRole === "faculty"
      ? "Faculty"
      : normalizedRole === "alumni"
        ? "Alumni"
        : normalizedRole === "student"
          ? "Student"
          : "User";

  const roleBadgeColor =
    normalizedRole === "faculty"
      ? "bg-primary/10 text-primary"
      : normalizedRole === "alumni"
        ? "bg-secondary text-secondary-foreground"
        : "bg-accent text-accent-foreground";

  const handleLogout = () => {
    logout();
    setStoredUser(null);
    setAccountOpen(false);
    router.replace("/");
  };
  const breadcrumbs = useMemo(() => {
    const parts = pathname.split("/").filter(Boolean);
    if (parts.length === 0) return [{ label: "Home", href: "/" }];

    const isDashboardHome = parts[0] === "dashboard" && parts.length === 2;

    if (isDashboardHome) {
      return [{ label: "Home", href: "" }];
    }

    return parts.map((part, index) => {
      let href = "/" + parts.slice(0, index + 1).join("/");
      let label =
        part.charAt(0).toUpperCase() + part.slice(1).replace(/-/g, " ");

      if (parts[0] === "events" && index === 1 && customEventTitle) {
        label = customEventTitle;
      }

      if (href === "/dashboard") {
        href = "";
      }

      return { label, href };
    });
  }, [pathname, customEventTitle]);

  const userInitial = resolvedName.charAt(0).toUpperCase();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md text-foreground">
      <div className="w-full px-4 sm:px-6">
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
                          idx === breadcrumbs.length - 1 &&
                            "text-foreground font-semibold",
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

          <div className="flex items-center gap-1.5 shrink-0">
            {mounted && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="text-muted-foreground hover:text-foreground cursor-pointer h-8 w-8"
              >
                {theme === "dark" ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
                <span className="sr-only">Toggle Theme</span>
              </Button>
            )}

            {isAuthenticated ? (
              <>
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-muted-foreground hover:text-foreground h-8 w-8 cursor-pointer"
                >
                  <Bell className="h-4 w-4" />
                </Button>

                {/* Account dropdown - hover open */}
                <div
                  onMouseEnter={() => {
                    if (closeTimeout.current)
                      clearTimeout(closeTimeout.current);
                    setAccountOpen(true);
                  }}
                  onMouseLeave={() => {
                    closeTimeout.current = setTimeout(
                      () => setAccountOpen(false),
                      200,
                    );
                  }}
                >
                  <DropdownMenu
                    open={accountOpen}
                    onOpenChange={setAccountOpen}
                  >
                    <DropdownMenuTrigger
                      render={
                        <Button
                          variant="ghost"
                          className="flex items-center gap-2 h-8 px-2 cursor-pointer hover:bg-accent"
                        >
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                              {userInitial}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs font-medium text-foreground hidden sm:inline max-w-[100px] truncate">
                            {resolvedName}
                          </span>
                        </Button>
                      }
                    />
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuGroup>
                        <DropdownMenuLabel className="font-normal">
                          <div className="flex flex-col gap-1">
                            <p className="text-sm font-medium text-foreground">
                              {resolvedName}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {resolvedEmail}
                            </p>
                            <Badge
                              variant="secondary"
                              className={cn(
                                "w-fit text-[10px] font-semibold mt-0.5",
                                roleBadgeColor,
                              )}
                            >
                              {roleLabel}
                            </Badge>
                          </div>
                        </DropdownMenuLabel>
                      </DropdownMenuGroup>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="cursor-pointer"
                        render={
                          <Link
                            href="/profile"
                            className="flex items-center gap-2"
                          >
                            <User className="h-4 w-4" />
                            <span>My Profile</span>
                          </Link>
                        }
                      />
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={handleLogout}
                        className="cursor-pointer text-destructive focus:text-destructive"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Sign Out</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm">
                    Login
                  </Button>
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
