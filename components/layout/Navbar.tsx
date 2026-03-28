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
      { href: "/events", label: "Events", icon: Calendar },
      { href: "/opportunities", label: "Opportunities", icon: Briefcase },
    ];
  }, [normalizedRole]);

  const handleLogout = () => {
    localStorage.removeItem("alumni_user");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("email");
    setStoredUser(null);
    setIsOpen(false);
    router.push("/");
  };

  return (
    <nav className="bg-navy-950 text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="bg-gold-500 p-1.5 rounded-lg group-hover:bg-gold-400 transition-colors">
              <GraduationCap className="h-5 w-5 text-navy-950" />
            </div>
            <span className="font-serif font-bold text-lg tracking-wide">
              ALUMNI
            </span>
          </Link>

          {isAuthenticated ? (
            <>
              <div className="hidden md:flex items-center gap-1">
                {authLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                        isActive
                          ? "bg-gold-500 text-navy-950"
                          : "text-gray-300 hover:text-white hover:bg-navy-800",
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {link.label}
                    </Link>
                  );
                })}
              </div>

              <div className="hidden md:flex items-center gap-2">
                <Link
                  href="/profile"
                  className="flex items-center gap-2 bg-navy-800 hover:bg-navy-700 px-3 py-2 rounded-lg transition-colors"
                >
                  <div className="w-8 h-8 bg-gold-500 rounded-full flex items-center justify-center text-xs font-bold text-navy-950">
                    {resolvedName.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium max-w-28 truncate">
                    {resolvedName}
                  </span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-950/20 rounded-lg transition-colors"
                  title="Sign Out"
                  aria-label="Sign Out"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </>
          ) : (
            <div className="hidden md:flex items-center gap-3">
              <Link
                href="/auth/login"
                className="text-sm font-medium text-gray-300 hover:text-white transition-colors px-4 py-2"
              >
                Login
              </Link>

              <Link
                href="/auth/signup"
                className="bg-gold-500 hover:bg-gold-400 text-navy-950 text-sm font-bold px-5 py-2 rounded-lg transition-all hover:shadow-lg hover:-translate-y-0.5"
              >
                Join Network
              </Link>
            </div>
          )}

          <button
            className="md:hidden p-2 text-gray-400 hover:text-white transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-navy-900 border-t border-navy-800 animate-slide-up">
          <div className="px-4 py-4 space-y-2">
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-3 px-3 py-3 border-b border-navy-800 mb-2">
                  <div className="w-9 h-9 bg-gold-500 rounded-full flex items-center justify-center text-sm font-bold text-navy-950">
                    {resolvedName.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white truncate">
                      {resolvedName}
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      {normalizedRole || "member"}
                    </p>
                  </div>
                </div>

                {authLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                        isActive
                          ? "bg-gold-500 text-navy-950"
                          : "text-gray-300 hover:text-white hover:bg-navy-800",
                      )}
                      onClick={() => setIsOpen(false)}
                    >
                      <Icon className="h-4 w-4" />
                      {link.label}
                    </Link>
                  );
                })}

                <Link
                  href="/profile"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-navy-800"
                  onClick={() => setIsOpen(false)}
                >
                  <User className="h-4 w-4" />
                  My Profile
                </Link>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-300 hover:text-red-400 hover:bg-red-950/20 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </>
            ) : (
              <div className="pt-2 border-t border-navy-800 flex flex-col gap-2">
                <Link
                  href="/auth/login"
                  className="btn-outline text-center"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>

                <Link
                  href="/auth/signup"
                  className="btn-gold text-center"
                  onClick={() => setIsOpen(false)}
                >
                  Join Network
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
