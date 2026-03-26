"use client";
// components/layout/DashboardSidebar.tsx
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  Users,
  Briefcase,
  Calendar,
  User,
  Settings,
  LogOut,
  GraduationCap,
  BarChart3,
  Bell,
  BookOpen,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { UserRole } from "@/types";
import router from "next/router";
interface SidebarProps {
  role: UserRole;
  userName: string;
  userEmail: string;
}

const getProfileId = async () => {
  const stored = localStorage.getItem("alumni_user");
  console.log("User Info:", localStorage.getItem("alumni_user"));
  if (!stored) {
    router.push("/auth/login");
    return;
  }
  const u = JSON.parse(stored);
  console.log("user is ", u);
  return u.id;
};

const facultyLinks = [
  { href: "/dashboard/faculty", label: "Overview", icon: Home },
  { href: "/students", label: "Students", icon: Users },
  { href: "/alumni", label: "Alumni", icon: GraduationCap },
  { href: "/events", label: "Events", icon: Calendar },
  { href: "/opportunities", label: "Job Board", icon: Briefcase },
  { href: "/settings", label: "Settings", icon: Settings },
];

const alumniLinks = [
  { href: "/dashboard/alumni", label: "Home", icon: Home },
  { href: "/alumni", label: "My Network", icon: Users },
  {
    href: "/opportunities",
    label: "Opportunities",
    icon: Briefcase,
  },
  { href: "/events", label: "Events", icon: Calendar },
  { href: `/alumni/1`, label: "My Profile", icon: User },
];
//{ href: "/mentorship", label: "Mentorship", icon: BookOpen },

const studentLinks = [
  { href: "/dashboard/student", label: "Home", icon: Home },
  { href: "/alumni", label: "Find Alumni", icon: Users },
  { href: "/opportunities", label: "Opportunities", icon: Briefcase },
  { href: "/events", label: "Events", icon: Calendar },

  { href: "/profile", label: "My Profile", icon: User },
];

export default function DashboardSidebar({
  role,
  userName,
  userEmail,
}: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const links =
    role === "faculty"
      ? facultyLinks
      : role === "alumni"
        ? alumniLinks
        : studentLinks;

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("alumni_user");
    }
    router.push("/");
  };

  const roleBadgeColor =
    role === "faculty"
      ? "bg-blue-100 text-blue-700"
      : role === "alumni"
        ? "bg-gold-100 text-gold-700"
        : "bg-green-100 text-green-700";
  const roleLabel =
    role === "faculty"
      ? "Faculty Member"
      : role === "alumni"
        ? "Alumni Member"
        : "Student";
  return (
    <aside className="w-64 bg-navy-950 min-h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-navy-800">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="bg-gold-500 p-1.5 rounded-lg">
            <GraduationCap className="h-5 w-5 text-navy-950" />
          </div>
          <span className="font-serif font-bold text-white text-lg">
            ALUMNI
          </span>
        </Link>
      </div>

      {/* User info */}
      <div className="p-5 border-b border-navy-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gold-500 rounded-full flex items-center justify-center font-bold text-navy-950 text-sm flex-shrink-0">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="overflow-hidden">
            <p className="text-white font-semibold text-sm truncate">
              {userName}
            </p>
            <p className="text-gray-400 text-xs truncate">{userEmail}</p>
          </div>
        </div>
        <span className={cn("badge mt-3", roleBadgeColor)}>
          {role === "faculty" && <GraduationCap className="h-3 w-3 mr-1" />}
          {roleLabel}
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
                isActive
                  ? "bg-gold-500 text-navy-950"
                  : "text-gray-400 hover:text-white hover:bg-navy-800",
              )}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Notifications & Logout */}
      <div className="p-4 border-t border-navy-800 space-y-1">
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-navy-800 transition-colors">
          <Bell className="h-4 w-4" />
          Notifications
          <span className="ml-auto bg-gold-500 text-navy-950 text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
            3
          </span>
        </button>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-red-950/20 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
