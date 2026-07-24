"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Calendar,
  Briefcase,
  Loader2,
  ArrowRight,
  MapPin,
  GraduationCap,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import DirectorySnapshot from "@/components/dashboard/DirectorySnapshot";
import { hasRole } from "@/lib/roleUtils";
import { useAuth } from "@/contexts/auth-context";
import { useEventsQuery } from "@/hooks/queries/events";
import { useOpportunitiesQuery } from "@/hooks/queries/opportunities";
import { useAlumniSearchQuery } from "@/hooks/queries/alumni";

export default function FacultyDashboard() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const {
    data: events = [],
    isLoading: eventsLoading,
    error: eventsError,
  } = useEventsQuery();
  const {
    data: opportunities = [],
    isLoading: opportunitiesLoading,
    error: opportunitiesError,
  } = useOpportunitiesQuery();
  const {
    data: directoryData,
  } = useAlumniSearchQuery();

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated || !user) {
      router.replace("/auth/login");
      return;
    }
    const userRole = user.roles || "";
    const isAllowedRole = hasRole(userRole, ["faculty"]);

    if (!isAllowedRole) {
      router.replace("/auth/login");
    }
  }, [authLoading, isAuthenticated, user, router]);

  const directory = useMemo(() => {
    const data = Array.isArray(directoryData) ? directoryData : [];
    return data.map((item) => ({
      id: item.id,
      name: item.name || "Unknown",
      profession: item.profession ?? null,
      department: item.department ?? null,
      location: item.location ?? null,
      profileImageUrl: item.profileImageUrl ?? null,
    }));
  }, [directoryData]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const upcomingEvents = useMemo(
    () => events.filter((e) => new Date(e.eventDate) >= new Date()).slice(0, 4),
    [events],
  );

  const opportunityPreview = useMemo(
    () => opportunities.slice(0, 3),
    [opportunities],
  );

  const statsData = useMemo(
    () => [
      {
        label: "Total Alumni",
        value: String(directory.length || 0),
        icon: GraduationCap,
      },
      {
        label: "Open Opportunities",
        value: String(opportunities.length || 0),
        icon: Briefcase,
      },
      {
        label: "Upcoming Events",
        value: String(upcomingEvents.length || 0),
        icon: Calendar,
      },
      {
        label: "Departments",
        value: String(
          new Set(directory.map((item) => item.department).filter(Boolean)).size,
        ),
        icon: Building2,
      },
    ],
    [directory, opportunities, upcomingEvents],
  );

  if (!user) return null;

  return (
    <div className="w-full px-4 sm:px-6 pb-6 space-y-6">
      {/* Sticky Header */}
      <div className="sticky top-14 z-30 bg-background/95 backdrop-blur-md py-4 border-b border-border/40 -mx-4 sm:-mx-6 px-4 sm:px-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h1 className="text-xl font-semibold tracking-tight text-foreground">
              Faculty Dashboard
            </h1>
            <p className="text-xs text-muted-foreground">
              Platform overview, events &amp; alumni community insights
            </p>
          </div>
          <Button variant="outline" size="sm" asChild className="cursor-pointer">
            <Link href="/network/alumni">View Directory</Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statsData.map(({ label, value, icon: Icon }) => (
          <Card key={label} className="p-4">
            <CardContent className="p-0 flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-muted text-foreground shrink-0">
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <div className="text-lg font-semibold tracking-tight text-foreground leading-none">
                  {value}
                </div>
                <div className="text-xs text-muted-foreground mt-1 truncate">
                  {label}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Directory Link */}
      <Card className="p-4 bg-muted/30 border-border">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h2 className="text-sm font-semibold text-foreground">Find Alumni Fast</h2>
            <p className="text-xs text-muted-foreground">Search by name, department, or company</p>
          </div>
          <Button variant="outline" size="sm" asChild className="cursor-pointer">
            <Link href="/network/alumni">
              Browse Directory <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Link>
          </Button>
        </div>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Upcoming Events */}
        <Card className="p-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                Upcoming Events
              </h2>
            </div>

            {eventsLoading ? (
              <div className="flex items-center justify-center py-8 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            ) : eventsError ? (
              <Alert variant="destructive">
                <AlertDescription className="text-xs">
                  {eventsError?.message || "Could not load events"}
                </AlertDescription>
              </Alert>
            ) : upcomingEvents.length === 0 ? (
              <p className="text-xs text-muted-foreground py-6 text-center">
                No upcoming events scheduled
              </p>
            ) : (
              <div className="space-y-3">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="p-2.5 rounded-lg bg-muted/30 border border-border/60 space-y-1">
                    <p className="text-xs font-medium text-foreground line-clamp-1">
                      {event.title}
                    </p>
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                      <span>{formatDate(event.eventDate)}</span>
                      {event.location && (
                        <>
                          <span>&middot;</span>
                          <span className="truncate">{event.location}</span>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>

        {/* Opportunities */}
        <Card className="lg:col-span-2 p-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                Active Opportunities
              </h2>
              <Link href="/opportunities" className="text-xs text-muted-foreground hover:text-foreground font-medium">
                View All
              </Link>
            </div>

            {opportunitiesLoading ? (
              <div className="flex items-center justify-center py-8 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            ) : opportunitiesError ? (
              <Alert variant="destructive">
                <AlertDescription className="text-xs">
                  {opportunitiesError?.message || "Could not load opportunities"}
                </AlertDescription>
              </Alert>
            ) : opportunityPreview.length === 0 ? (
              <p className="text-xs text-muted-foreground py-6 text-center">
                No active opportunities
              </p>
            ) : (
              <div className="grid sm:grid-cols-3 gap-3">
                {opportunityPreview.map((opp) => (
                  <div key={opp.id} className="p-3 rounded-lg border border-border bg-card space-y-1.5 flex flex-col justify-between">
                    <div className="space-y-1">
                      <Badge variant="secondary" className="text-[9px]">
                        {opp.type}
                      </Badge>
                      <h4 className="font-semibold text-xs text-foreground line-clamp-1">
                        {opp.title}
                      </h4>
                      <p className="text-[10px] text-muted-foreground line-clamp-1">
                        {opp.company}
                      </p>
                    </div>
                    <p className="text-[10px] text-muted-foreground/60 flex items-center gap-1 pt-1">
                      <MapPin className="h-2.5 w-2.5 shrink-0" /> {opp.location}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      </div>

      <DirectorySnapshot title="Alumni Directory Snapshot" />
    </div>
  );
}
