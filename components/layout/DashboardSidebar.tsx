"use client";

import Link from "next/link";

import { usePathname } from "next/navigation";
import {
  Home,
  Users,
  Briefcase,
  Calendar,
  User,
  GraduationCap,
  Handshake,
  Newspaper,
  Shield,
} from "lucide-react";

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
}
const facultyLinks = [
  { href: "/dashboard/faculty", label: "Overview", icon: Home },
  { href: "/alumni", label: "Alumni", icon: GraduationCap },
  { href: "/faculty", label: "Faculty", icon: Users },
  { href: "/events", label: "Events", icon: Calendar },
  { href: "/club-events", label: "Club Events", icon: Calendar },
  { href: "/alumni-sessions", label: "Alumni Sessions", icon: Newspaper },
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
  { href: "/alumni-sessions", label: "Alumni Sessions", icon: Newspaper },
  { href: "/profile", label: "My Profile", icon: User },
  { href: "/alumni-mentorship", label: "Mentorship", icon: Handshake },
];

const studentLinks = [
  { href: "/dashboard/student", label: "Home", icon: Home },
  { href: "/alumni", label: "Find Alumni", icon: Users },
  { href: "/faculty", label: "Faculty", icon: GraduationCap },
  { href: "/opportunities", label: "Opportunities", icon: Briefcase },
  { href: "/events", label: "Events", icon: Calendar },
  { href: "/club-events", label: "Club Events", icon: Calendar },
  { href: "/alumni-sessions", label: "Alumni Sessions", icon: Newspaper },
  { href: "/profile", label: "My Profile", icon: User },
  { href: "/alumni-mentorship", label: "Mentorship", icon: Handshake },
];

const adminLinks = [
  { href: "/dashboard/mainadmin", label: "Dashboard", icon: Home },

  { href: "/club-events", label: "Club Events", icon: Calendar },

  { href: "/alumni-sessions", label: "Alumni Sessions", icon: Newspaper },

  { href: "/events", label: "Events", icon: Calendar },

  { href: "/opportunities", label: "Job Board", icon: Briefcase },

  { href: "/profile", label: "My Profile", icon: User },
];

export default function DashboardSidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const { state, setOpen } = useSidebar();

  const homeHref =
    role === "admin"
      ? "/dashboard/mainadmin"
      : role === "faculty"
        ? "/dashboard/faculty"
        : role === "student"
          ? "/dashboard/student"
          : "/dashboard/alumni";
  const links =
    role === "faculty"
      ? facultyLinks
      : role === "alumni"
        ? alumniLinks
        : role === "admin"
          ? adminLinks
          : studentLinks;

  return (
    <Sidebar
      collapsible="icon"
      onClick={(e) => {
        const target = e.target as HTMLElement;
        if (
          target.closest("a") ||
          target.closest("button[data-sidebar='rail']")
        )
          return;
        setOpen(state === "collapsed");
      }}
      className={cn(state === "collapsed" && "cursor-pointer")}
    >
      <SidebarHeader className="p-2 border-b border-sidebar-border group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-3">
        <Link
          href={homeHref}
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

      <SidebarContent className="p-2">
        <SidebarMenu>
          {links.map((link) => {
            const Icon = link.icon;
            const isActive =
              pathname === link.href ||
              (link.href !== "/" && pathname.startsWith(link.href));

            return (
              <SidebarMenuItem
                key={link.href}
                className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center"
              >
                <SidebarMenuButton
                  isActive={isActive}
                  tooltip={link.label}
                  className={cn(
                    "h-9 px-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer group-data-[collapsible=icon]:!w-auto",
                    isActive
                      ? "!bg-primary !text-primary-foreground shadow-sm"
                      : "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent",
                  )}
                  render={
                    <Link
                      href={link.href}
                      className="flex items-center gap-2.5 group-data-[collapsible=icon]:justify-center"
                    />
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
        </SidebarMenu>
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
}
