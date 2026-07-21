"use client";

import { useState } from "react";
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
  Shield,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

import Logo from "@/components/layout/Logo";
import { cn } from "@/lib/utils";
import { UserRole } from "@/types";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";

interface SidebarProps {
  role: UserRole;
}

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

  const isNetworkActive = pathname.startsWith("/network");
  const isAlumniActive = pathname === "/network/alumni" || pathname.startsWith("/alumni/");
  const isFacultyActive = pathname === "/network/faculty" || pathname.startsWith("/faculty/");

  const [networkOpen, setNetworkOpen] = useState(true);

  return (
    <Sidebar
      collapsible="icon"
      onClick={(e) => {
        const target = e.target as HTMLElement;
        if (
          target.closest("a") ||
          target.closest("button[data-sidebar='rail']") ||
          target.closest("button")
        )
          return;
        setOpen(state === "collapsed");
      }}
      className={cn(state === "collapsed" && "cursor-pointer")}
    >
      <SidebarHeader className="p-2 border-b border-sidebar-border group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-3">
        <Logo href={homeHref} size="sm" textClassName="group-data-[collapsible=icon]:hidden font-semibold" />
      </SidebarHeader>

      <SidebarContent className="p-2">
        <SidebarMenu>
          {/* Home */}
          <SidebarMenuItem className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center">
            <SidebarMenuButton
              isActive={pathname === homeHref}
              tooltip="Home"
              className={cn(
                "h-9 px-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer group-data-[collapsible=icon]:!w-auto",
                pathname === homeHref
                  ? "!bg-primary !text-primary-foreground shadow-sm"
                  : "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent"
              )}
              render={<Link href={homeHref} className="flex items-center gap-2.5 group-data-[collapsible=icon]:justify-center" />}
            >
              <Home className="h-5 w-5 shrink-0" />
              <span className="group-data-[collapsible=icon]:hidden whitespace-nowrap">Home</span>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* Network Hub Collapsible Item with Sub-menu */}
          <SidebarMenuItem className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center">
            <div className="flex items-center w-full">
              <SidebarMenuButton
                isActive={isNetworkActive}
                tooltip="Network Hub"
                className={cn(
                  "h-9 px-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer flex-1 group-data-[collapsible=icon]:!w-auto",
                  isNetworkActive
                    ? "!bg-primary !text-primary-foreground shadow-sm"
                    : "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent"
                )}
                render={<Link href="/network" className="flex items-center justify-between w-full" />}
              >
                <div className="flex items-center gap-2.5">
                  <Users className="h-5 w-5 shrink-0" />
                  <span className="group-data-[collapsible=icon]:hidden whitespace-nowrap">Network Hub</span>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setNetworkOpen(!networkOpen);
                  }}
                  className="group-data-[collapsible=icon]:hidden p-1 text-inherit opacity-70 hover:opacity-100 cursor-pointer"
                >
                  {networkOpen ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
                </button>
              </SidebarMenuButton>
            </div>

            {/* Sub-menu for Alumni & Faculty */}
            {networkOpen && (
              <SidebarMenuSub className="mt-1 space-y-0.5 group-data-[collapsible=icon]:hidden">
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton
                    isActive={isAlumniActive}
                    className={cn(
                      "text-xs px-2.5 py-1.5 rounded-md font-medium flex items-center gap-2 transition-colors cursor-pointer",
                      isAlumniActive
                        ? "bg-primary/10 text-primary font-semibold"
                        : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
                    )}
                    render={<Link href="/network/alumni" />}
                  >
                    <GraduationCap className="h-3.5 w-3.5 text-primary shrink-0" />
                    <span>Alumni Directory</span>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>

                <SidebarMenuSubItem>
                  <SidebarMenuSubButton
                    isActive={isFacultyActive}
                    className={cn(
                      "text-xs px-2.5 py-1.5 rounded-md font-medium flex items-center gap-2 transition-colors cursor-pointer",
                      isFacultyActive
                        ? "bg-primary/10 text-primary font-semibold"
                        : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
                    )}
                    render={<Link href="/network/faculty" />}
                  >
                    <Users className="h-3.5 w-3.5 text-primary shrink-0" />
                    <span>Faculty Directory</span>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              </SidebarMenuSub>
            )}
          </SidebarMenuItem>

          {/* Opportunities */}
          <SidebarMenuItem className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center">
            <SidebarMenuButton
              isActive={pathname.startsWith("/opportunities")}
              tooltip="Opportunities"
              className={cn(
                "h-9 px-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer group-data-[collapsible=icon]:!w-auto",
                pathname.startsWith("/opportunities")
                  ? "!bg-primary !text-primary-foreground shadow-sm"
                  : "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent"
              )}
              render={<Link href="/opportunities" className="flex items-center gap-2.5 group-data-[collapsible=icon]:justify-center" />}
            >
              <Briefcase className="h-5 w-5 shrink-0" />
              <span className="group-data-[collapsible=icon]:hidden whitespace-nowrap">Opportunities</span>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* Unified Events */}
          <SidebarMenuItem className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center">
            <SidebarMenuButton
              isActive={pathname.startsWith("/events")}
              tooltip="Events"
              className={cn(
                "h-9 px-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer group-data-[collapsible=icon]:!w-auto",
                pathname.startsWith("/events")
                  ? "!bg-primary !text-primary-foreground shadow-sm"
                  : "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent"
              )}
              render={<Link href="/events" className="flex items-center gap-2.5 group-data-[collapsible=icon]:justify-center" />}
            >
              <Calendar className="h-5 w-5 shrink-0" />
              <span className="group-data-[collapsible=icon]:hidden whitespace-nowrap">Events</span>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* My Profile */}
          <SidebarMenuItem className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center">
            <SidebarMenuButton
              isActive={pathname === "/profile"}
              tooltip="My Profile"
              className={cn(
                "h-9 px-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer group-data-[collapsible=icon]:!w-auto",
                pathname === "/profile"
                  ? "!bg-primary !text-primary-foreground shadow-sm"
                  : "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent"
              )}
              render={<Link href="/profile" className="flex items-center gap-2.5 group-data-[collapsible=icon]:justify-center" />}
            >
              <User className="h-5 w-5 shrink-0" />
              <span className="group-data-[collapsible=icon]:hidden whitespace-nowrap">My Profile</span>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* Privacy Settings (Alumni only) */}
          {role === "alumni" && (
            <SidebarMenuItem className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center">
              <SidebarMenuButton
                isActive={pathname === "/profile/privacy"}
                tooltip="Privacy Settings"
                className={cn(
                  "h-9 px-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer group-data-[collapsible=icon]:!w-auto",
                  pathname === "/profile/privacy"
                    ? "!bg-primary !text-primary-foreground shadow-sm"
                    : "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent"
                )}
                render={<Link href="/profile/privacy" className="flex items-center gap-2.5 group-data-[collapsible=icon]:justify-center" />}
              >
                <Shield className="h-5 w-5 shrink-0" />
                <span className="group-data-[collapsible=icon]:hidden whitespace-nowrap">Privacy Settings</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}

          {/* Mentorship (Alumni & Student) */}
          {(role === "alumni" || role === "student") && (
            <SidebarMenuItem className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center">
              <SidebarMenuButton
                isActive={pathname.startsWith("/alumni-mentorship")}
                tooltip="Mentorship"
                className={cn(
                  "h-9 px-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer group-data-[collapsible=icon]:!w-auto",
                  pathname.startsWith("/alumni-mentorship")
                    ? "!bg-primary !text-primary-foreground shadow-sm"
                    : "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent"
                )}
                render={<Link href="/alumni-mentorship" className="flex items-center gap-2.5 group-data-[collapsible=icon]:justify-center" />}
              >
                <Handshake className="h-5 w-5 shrink-0" />
                <span className="group-data-[collapsible=icon]:hidden whitespace-nowrap">Mentorship</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
}
