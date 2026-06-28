"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  Users,
  Briefcase,
  Calendar,
  User,
  GraduationCap,
  Handshake,
  Newspaper,
} from "lucide-react";
import { getMyClubs } from "@/lib/api/clubs";
import { cn } from "@/lib/utils";
import { UserRole } from "@/types";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";

interface SidebarProps {
  role: UserRole;
  userName: string | null;
  userEmail: string;
}
const facultyLinks = [
  { href: "/dashboard/faculty", label: "Overview", icon: Home },
  { href: "/alumni", label: "Alumni", icon: GraduationCap },
  { href: "/faculty", label: "Faculty", icon: Users },
  { href: "/events", label: "Events", icon: Calendar },
  { href: "/club-events", label: "Club Events", icon: Calendar },
  { href: "/opportunities", label: "Job Board", icon: Briefcase },
  { href: "/profile", label: "My Profile", icon: User },
];

const alumniLinks = [
  { href: "/dashboard/alumni", label: "Home", icon: Home },
  { href: "/alumni", label: "My Network", icon: Users },
  { href: "/faculty", label: "Faculty", icon: GraduationCap },
  { href: "/opportunities", label: "Opportunities", icon: Briefcase },
  { href: "/events", label: "Events", icon: Calendar },
  { href: "/club-events", label: "Club Events", icon: Calendar },
  { href: "/alumni-sessions", label: "Sessions", icon: Newspaper },
  { href: "/profile", label: "My Profile", icon: User },
  {href: "/alumni-mentorship",label:"Mentorship",icon:Handshake}
];

const studentLinks = [
  { href: "/dashboard/student", label: "Home", icon: Home },
  { href: "/alumni", label: "Find Alumni", icon: Users },
  { href: "/faculty", label: "Faculty", icon: GraduationCap },
  { href: "/opportunities", label: "Opportunities", icon: Briefcase },
  { href: "/events", label: "Events", icon: Calendar },
  { href: "/club-events", label: "Club Events", icon: Calendar },
  { href: "/profile", label: "My Profile", icon: User },
  {href: "/alumni-mentorship",label:"Mentorship",icon:Handshake}

];

const adminLinks = [

  { href: "/dashboard/mainadmin", label: "Dashboard", icon: Home },

  { href: "/main-admin/users", label: "User Management", icon: Users },

  { href: "/club-events", label: "Club Events", icon: Calendar },

  { href: "/events", label: "Events", icon: Calendar },

  { href: "/opportunities", label: "Job Board", icon: Briefcase },

  { href: "/profile", label: "My Profile", icon: User },

];
const token = localStorage.getItem("token");


export default function DashboardSidebar({
  role,
  userName,
  userEmail,
}: SidebarProps) {
  const [isClubManager, setIsClubManager] =
    useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { state, setOpen } = useSidebar();
  const links =
  role === "faculty"
    ? facultyLinks
    : role === "alumni"
    ? alumniLinks
    : role === "admin"
    ? adminLinks
    : studentLinks;

  useEffect(() => {

    const token =
        localStorage.getItem("token");

    if (!token) return;

    getMyClubs(token)

        .then(clubs => {

            setIsClubManager(
                clubs.length > 0
            );

        })

        .catch(() => {});

}, []);

  const handleLogout = () => {
    console.log("[Logout] Clearing all auth data from DashboardSidebar...");
    if (typeof window !== "undefined") {
      localStorage.removeItem("alumni_user");
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("email");
      console.log("[Logout] localStorage cleared");
    }
    router.push("/");
  };

  const roleBadgeColor =
    role === "faculty"
      ? "bg-primary/10 text-primary border border-primary/20"
      : role === "alumni"
        ? "bg-muted text-muted-foreground border border-border"
        : "bg-accent text-accent-foreground border border-border";

  const roleLabel =
  role === "faculty"
    ? "Faculty"
    : role === "alumni"
      ? "Alumni"
      : role === "admin"
        ? "Main Administrator"
        : "Student";
  return (
    <Sidebar
      collapsible="icon"
      onClick={(e) => {
        const target = e.target as HTMLElement;
        if (target.closest("a") || target.closest("button[data-sidebar='rail']")) return;
        setOpen(state === "collapsed");
      }}
      className={cn(state === "collapsed" && "cursor-pointer")}
    >
      <SidebarHeader className="p-2 border-b border-sidebar-border group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-3">
        <Link
          href="/"
          className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-sidebar-accent transition-colors group"
        >
          <div className="bg-primary/10 p-1.5 rounded-lg text-primary group-hover:bg-primary/20 transition-colors shrink-0 group-data-[collapsible=icon]:p-2">
            <GraduationCap className="h-5 w-5" />
          </div>
          <span className="font-semibold text-sm tracking-wide text-foreground group-data-[collapsible=icon]:hidden whitespace-nowrap">
            ALUMNI
          </span>
        </Link>
      </SidebarHeader>

      {/* User Info Block */}
      <div className="p-4 border-b border-sidebar-border space-y-3 group-data-[collapsible=icon]:p-2 group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:items-center">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold shrink-0 border border-primary/20">
            {userName ? userName.charAt(0).toUpperCase() : "U"}
          </div>
          <div className="min-w-0 group-data-[collapsible=icon]:hidden">
            <p className="font-medium text-xs text-foreground truncate">
              {userName || "User"}
            </p>
            <p className="text-[10px] text-muted-foreground truncate">{userEmail}</p>
          </div>
        </div>
        <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-semibold tracking-wide uppercase group-data-[collapsible=icon]:hidden", roleBadgeColor)}>
          {role === "faculty" && <GraduationCap className="h-3 w-3 mr-1" />}
          {roleLabel}
        </span>
      </div>

      <SidebarContent className="p-2">
        <SidebarMenu>
          {links.map((link) => {
            const Icon = link.icon;
            const isActive =
              pathname === link.href ||
              (link.href !== "/" && pathname.startsWith(link.href));

            return (
              <SidebarMenuItem key={link.href} className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center">
                <SidebarMenuButton
                  isActive={isActive}
                  tooltip={link.label}
                  className={cn(
                    "h-9 px-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer group-data-[collapsible=icon]:!w-auto",
                    isActive
                      ? "!bg-primary !text-primary-foreground shadow-sm"
                      : "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent"
                  )}
                  render={
                    <Link href={link.href} className="flex items-center gap-2.5 group-data-[collapsible=icon]:justify-center" />
                  }
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  <span className="group-data-[collapsible=icon]:hidden whitespace-nowrap">
                    {link.label}
                  </span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
          {isClubManager && (
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === "/club-events/mine"}
                tooltip="My Club Events"
                className={cn(
                  "w-full flex items-center gap-2.5 px-3 py-2 rounded text-xs font-medium transition-colors cursor-pointer",
                  pathname === "/club-events/mine"
                    ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold"
                    : "text-sidebar-foreground/75 hover:text-sidebar-foreground hover:bg-sidebar-accent/50",
                )}
              >
                <Link href="/club-events/mine" className="flex items-center gap-2.5 w-full">
                  <Calendar className="h-4 w-4 shrink-0" />
                  <span className="group-data-[collapsible=icon]:hidden">My Club Events</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
}
