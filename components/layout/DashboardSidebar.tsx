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
  CheckCircle2,
  Award,
  UserCheck,
} from "lucide-react";

import Logo from "@/components/layout/Logo";
import { cn } from "@/lib/utils";
import { UserRole } from "@/types";
import { isMainAdmin, isBatchAdmin } from "@/lib/roleUtils";
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
  rawRoles?: string | string[];
}

export default function DashboardSidebar({ role, rawRoles }: SidebarProps) {
  const pathname = usePathname();
  const { state, setOpen } = useSidebar();

  const isMainAdminUser = isMainAdmin(rawRoles);
  const isBatchAdminUser = isBatchAdmin(rawRoles);

  const homeHref =
    isMainAdminUser
      ? "/main-admin"
      : role === "faculty"
        ? "/dashboard/faculty"
        : role === "student"
          ? "/dashboard/student"
          : "/dashboard/alumni";

  const isNetworkActive = pathname.startsWith("/network");
  const isAlumniActive = pathname === "/network/alumni" || pathname.startsWith("/alumni/");
  const isFacultyActive = pathname === "/network/faculty" || pathname.startsWith("/faculty/");

  const isAdminPortalActive = pathname.startsWith("/main-admin");
  const isAlumniAppsActive = pathname === "/main-admin/alumni-applications";
  const isUsersMgmtActive = pathname === "/main-admin/users";
  const isSkillApprovalActive = pathname === "/main-admin/skills";
  const isBatchAdminMgmtActive = pathname === "/main-admin/manage-batch-admin";

  const [networkOpen, setNetworkOpen] = useState(true);
  const [adminOpen, setAdminOpen] = useState(true);

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
      <SidebarHeader className="h-14 px-2 border-b border-sidebar-border group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:h-11 group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0">
        <Logo href={homeHref} size="sm" textClassName="group-data-[collapsible=icon]:hidden font-semibold" />
      </SidebarHeader>

      <SidebarContent className="p-2">
        <SidebarMenu>
          {/* Home / Overview */}
          <SidebarMenuItem>
            <SidebarMenuButton
              isActive={pathname === homeHref}
              tooltip="Home"
              className={cn(
                "h-9 px-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer group-data-[collapsible=icon]:justify-center",
                pathname === homeHref
                  ? "!bg-primary !text-primary-foreground shadow-sm"
                  : "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent"
              )}
              render={<Link href={homeHref} className="flex items-center gap-2.5" />}
            >
              <Home className="h-5 w-5 shrink-0" />
              <span className="group-data-[collapsible=icon]:hidden whitespace-nowrap">Home</span>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* Network Hub */}
          <SidebarMenuItem>
            <SidebarMenuButton
              isActive={isNetworkActive}
              tooltip="Network Hub"
              className={cn(
                "h-9 px-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer justify-between group-data-[collapsible=icon]:justify-center",
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

            {/* Network Sub-menu */}
            {networkOpen && (
              <SidebarMenuSub className="mt-1 space-y-0.5 group-data-[collapsible=icon]:hidden">
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton
                    isActive={isAlumniActive}
                    className={cn(
                      "text-xs px-2.5 py-1.5 rounded-md font-medium flex items-center gap-2 transition-colors cursor-pointer translate-x-0",
                      isAlumniActive
                        ? "bg-primary/10 text-primary font-semibold"
                        : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
                    )}
                    render={<Link href="/network/alumni" />}
                  >
                    <GraduationCap className="h-4 w-4 text-primary shrink-0" />
                    <span>Alumni Directory</span>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>

                <SidebarMenuSubItem>
                  <SidebarMenuSubButton
                    isActive={isFacultyActive}
                    className={cn(
                      "text-xs px-2.5 py-1.5 rounded-md font-medium flex items-center gap-2 transition-colors cursor-pointer translate-x-0",
                      isFacultyActive
                        ? "bg-primary/10 text-primary font-semibold"
                        : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
                    )}
                    render={<Link href="/network/faculty" />}
                  >
                    <Users className="h-4 w-4 text-primary shrink-0" />
                    <span>Faculty Directory</span>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              </SidebarMenuSub>
            )}
          </SidebarMenuItem>

          {/* Opportunities */}
          <SidebarMenuItem>
            <SidebarMenuButton
              isActive={pathname.startsWith("/opportunities")}
              tooltip="Opportunities"
              className={cn(
                "h-9 px-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer group-data-[collapsible=icon]:justify-center",
                pathname.startsWith("/opportunities")
                  ? "!bg-primary !text-primary-foreground shadow-sm"
                  : "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent"
              )}
              render={<Link href="/opportunities" className="flex items-center gap-2.5" />}
            >
              <Briefcase className="h-5 w-5 shrink-0" />
              <span className="group-data-[collapsible=icon]:hidden whitespace-nowrap">Opportunities</span>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* Unified Events */}
          <SidebarMenuItem>
            <SidebarMenuButton
              isActive={pathname.startsWith("/events")}
              tooltip="Events"
              className={cn(
                "h-9 px-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer group-data-[collapsible=icon]:justify-center",
                pathname.startsWith("/events")
                  ? "!bg-primary !text-primary-foreground shadow-sm"
                  : "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent"
              )}
              render={<Link href="/events" className="flex items-center gap-2.5" />}
            >
              <Calendar className="h-5 w-5 shrink-0" />
              <span className="group-data-[collapsible=icon]:hidden whitespace-nowrap">Events</span>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* My Profile */}
          <SidebarMenuItem>
            <SidebarMenuButton
              isActive={pathname === "/profile"}
              tooltip="My Profile"
              className={cn(
                "h-9 px-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer group-data-[collapsible=icon]:justify-center",
                pathname === "/profile"
                  ? "!bg-primary !text-primary-foreground shadow-sm"
                  : "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent"
              )}
              render={<Link href="/profile" className="flex items-center gap-2.5" />}
            >
              <User className="h-5 w-5 shrink-0" />
              <span className="group-data-[collapsible=icon]:hidden whitespace-nowrap">My Profile</span>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* Mentorship (Alumni & Student) */}
          {(role === "alumni" || role === "student") && (
            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={pathname.startsWith("/alumni-mentorship")}
                tooltip="Mentorship"
                className={cn(
"h-9 px-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer group-data-[collapsible=icon]:justify-center",
                pathname.startsWith("/alumni-mentorship")
                    ? "!bg-primary !text-primary-foreground shadow-sm"
                    : "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent"
                )}
                render={<Link href="/alumni-mentorship" className="flex items-center gap-2.5" />}
              >
                <Handshake className="h-5 w-5 shrink-0" />
                <span className="group-data-[collapsible=icon]:hidden whitespace-nowrap">Mentorship</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}

          {/* Batch Admin Section */}
          {isBatchAdminUser && (
            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={isAlumniAppsActive}
                tooltip="Alumni Approvals"
                className={cn(
                  "h-9 px-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer group-data-[collapsible=icon]:justify-center",
                  isAlumniAppsActive
                    ? "!bg-primary !text-primary-foreground shadow-sm"
                    : "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent"
                )}
                render={<Link href="/main-admin/alumni-applications" className="flex items-center gap-2.5" />}
              >
                <CheckCircle2 className="h-5 w-5 shrink-0" />
                <span className="group-data-[collapsible=icon]:hidden whitespace-nowrap">Alumni Approvals</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}

          {/* Admin Control Portal (Main Admin only) */}
          {isMainAdminUser && (
            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={isAdminPortalActive}
                tooltip="Admin Portal"
                className={cn(
                  "h-9 px-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer justify-between group-data-[collapsible=icon]:justify-center",
                  isAdminPortalActive
                    ? "!bg-primary !text-primary-foreground shadow-sm"
                    : "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent"
                )}
                render={<Link href="/main-admin" className="flex items-center justify-between w-full" />}
              >
                <div className="flex items-center gap-2.5">
                  <Shield className="h-5 w-5 shrink-0" />
                  <span className="group-data-[collapsible=icon]:hidden whitespace-nowrap">Admin Portal</span>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setAdminOpen(!adminOpen);
                  }}
                  className="group-data-[collapsible=icon]:hidden p-1 text-inherit opacity-70 hover:opacity-100 cursor-pointer"
                >
                  {adminOpen ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
                </button>
              </SidebarMenuButton>

              {/* Admin Sub-menu */}
              {adminOpen && (
                <SidebarMenuSub className="mt-1 space-y-0.5 group-data-[collapsible=icon]:hidden">
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton
                      isActive={isAlumniAppsActive}
                      className={cn(
                      "text-xs px-2.5 py-1.5 rounded-md font-medium flex items-center gap-2 transition-colors cursor-pointer translate-x-0",
                      isAlumniAppsActive
                        ? "bg-primary/10 text-primary font-semibold"
                        : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
                    )}
                    render={<Link href="/main-admin/alumni-applications" />}
                  >
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                      <span>Alumni Approvals</span>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>

                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton
                      isActive={isUsersMgmtActive}
                      className={cn(
"text-xs px-2.5 py-1.5 rounded-md font-medium flex items-center gap-2 transition-colors cursor-pointer translate-x-0",
                      isUsersMgmtActive
                          ? "bg-primary/10 text-primary font-semibold"
                          : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
                      )}
                      render={<Link href="/main-admin/users" />}
                    >
                      <Users className="h-4 w-4 text-primary shrink-0" />
                      <span>User Management</span>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>

                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton
                      isActive={isSkillApprovalActive}
                      className={cn(
"text-xs px-2.5 py-1.5 rounded-md font-medium flex items-center gap-2 transition-colors cursor-pointer translate-x-0",
                      isSkillApprovalActive
                          ? "bg-primary/10 text-primary font-semibold"
                          : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
                      )}
                      render={<Link href="/main-admin/skills" />}
                    >
                      <Award className="h-4 w-4 text-primary shrink-0" />
                      <span>Skill Approvals</span>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>

                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton
                      isActive={isBatchAdminMgmtActive}
                      className={cn(
"text-xs px-2.5 py-1.5 rounded-md font-medium flex items-center gap-2 transition-colors cursor-pointer translate-x-0",
                      isBatchAdminMgmtActive
                          ? "bg-primary/10 text-primary font-semibold"
                          : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
                      )}
                      render={<Link href="/main-admin/manage-batch-admin" />}
                    >
                      <UserCheck className="h-4 w-4 text-primary shrink-0" />
                      <span>Batch Admins</span>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              )}
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
}
