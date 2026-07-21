"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Loader2,
  ArrowRight,
  AlertCircle,
  MapPin,
  Calendar,
  Briefcase,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import DirectorySnapshot from "@/components/dashboard/DirectorySnapshot";
import { useAuth } from "@/contexts/auth-context";
import { useEventsQuery } from "@/hooks/queries/events";
import { useMyOpportunitiesQuery } from "@/hooks/queries/opportunities";
import { hasRole } from "@/lib/roleUtils";
import {
  formatDay,
  formatEventDate,
  formatMonth,
  isUpcoming,
} from "@/lib/utils/dateUtils";

const formatPostedDate = (value: string) =>
  new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

export default function AlumniDashboard() {
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
  } = useMyOpportunitiesQuery();
  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated || !user) {
      router.replace("/auth/login");
      return;
    }

    const userRole = user.roles || "";
    const isBlockedRole = hasRole(userRole, ["student", "faculty"]);
    const isAllowedRole = hasRole(userRole, ["alumni", "batch_admin", "admin"]);

    if (isBlockedRole || !isAllowedRole) {
      router.replace("/auth/login");
    }
  }, [authLoading, isAuthenticated, user, router]);

  const upcomingEvents = useMemo(
    () => events.filter((event) => isUpcoming(event.eventDate)).slice(0, 2),
    [events],
  );

  const opportunityPreview = useMemo(
    () => opportunities.slice(0, 3),
    [opportunities],
  );
  if (!user) return null;

  return (
    <div className="w-full px-4 sm:px-6 pb-6 space-y-6">
      {/* Sticky Header */}
      <div className="sticky top-14 z-30 bg-background/95 backdrop-blur-md py-4 border-b border-border/40 -mx-4 sm:-mx-6 px-4 sm:px-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h1 className="text-xl font-semibold tracking-tight text-foreground">
              Dashboard
            </h1>
            <p className="text-xs text-muted-foreground">
              Welcome back, {user.fullName}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild className="cursor-pointer">
              <Link href="/opportunities/create">
                <Plus className="h-4 w-4 mr-1" /> Post Opportunity
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Upcoming Events Section */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">Upcoming Events</h2>
          <Link href="/events" className="text-xs text-muted-foreground hover:text-foreground font-medium flex items-center gap-1">
            See all <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {eventsLoading ? (
          <Card>
            <CardContent className="flex items-center justify-center py-10 gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-xs">Loading events...</span>
            </CardContent>
          </Card>
        ) : eventsError ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-xs">
              {eventsError?.message || "Could not load events"}
            </AlertDescription>
          </Alert>
        ) : upcomingEvents.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center py-10 text-center gap-1">
              <Calendar className="h-6 w-6 text-muted-foreground/60 mb-1" />
              <p className="text-xs font-semibold text-foreground">No upcoming events</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {upcomingEvents.map((event) => {
              const coverImage = event.photoUrls?.[0] ?? null;
              return (
                <Card key={event.id} className="overflow-hidden flex flex-col justify-between">
                  <div className="relative h-32 bg-muted">
                    {coverImage ? (
                      <Image
                        src={coverImage}
                        alt={event.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-muted flex items-center justify-center text-muted-foreground/40">
                        <Calendar className="h-8 w-8" />
                      </div>
                    )}
                    <div className="absolute top-2 left-2 bg-background/90 backdrop-blur-xs text-foreground px-2.5 py-1 rounded-md text-center border border-border/40">
                      <span className="block text-[9px] font-semibold text-muted-foreground uppercase leading-none">
                        {formatMonth(event.eventDate)}
                      </span>
                      <span className="block text-sm font-bold leading-tight">
                        {formatDay(event.eventDate)}
                      </span>
                    </div>
                  </div>
                  <CardContent className="p-4 space-y-2">
                    <h3 className="font-semibold text-xs text-foreground line-clamp-1">
                      {event.title}
                    </h3>
                    <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3 shrink-0" /> {event.location}
                    </p>
                    <p className="text-[10px] text-muted-foreground/60">
                      {formatEventDate(event.eventDate)}
                    </p>
                    <Button variant="ghost" size="xs" asChild className="w-full justify-between cursor-pointer text-xs pt-2">
                      <Link href={`/events/${event.id}`}>
                        View Details <ArrowRight className="h-3 w-3" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </section>

      {/* My Opportunities Section */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">My Opportunities</h2>
          <Link href="/opportunities" className="text-xs text-muted-foreground hover:text-foreground font-medium flex items-center gap-1">
            View all <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {opportunitiesLoading ? (
          <Card>
            <CardContent className="flex items-center justify-center py-10 gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-xs">Loading opportunities...</span>
            </CardContent>
          </Card>
        ) : opportunitiesError ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-xs">
              {opportunitiesError?.message || "Could not load opportunities"}
            </AlertDescription>
          </Alert>
        ) : opportunityPreview.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center py-10 text-center gap-1">
              <Briefcase className="h-6 w-6 text-muted-foreground/60 mb-1" />
              <p className="text-xs font-semibold text-foreground">No opportunities posted yet</p>
              <Button variant="outline" size="xs" asChild className="mt-3 cursor-pointer">
                <Link href="/opportunities/create">Create Posting</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-3 gap-4">
            {opportunityPreview.map((opp) => (
              <Card key={opp.id} className="p-4 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <Badge variant="secondary" className="text-[10px]">
                    {opp.type}
                  </Badge>
                  <h3 className="font-semibold text-xs text-foreground line-clamp-1">
                    {opp.title}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-1">{opp.company}</p>
                  <p className="text-[10px] text-muted-foreground/80 flex items-center gap-1">
                    <MapPin className="h-3 w-3 shrink-0" /> {opp.location}
                  </p>
                </div>
                <div className="text-[10px] text-muted-foreground/60 border-t border-border/40 pt-2 flex items-center justify-between">
                  <span>Posted {formatPostedDate(opp.postedAt)}</span>
                  <Link href="/opportunities" className="text-foreground hover:underline font-medium">
                    View
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      <DirectorySnapshot title="Directory Snapshot" linkLabel="View directory" />
    </div>
  );
}
