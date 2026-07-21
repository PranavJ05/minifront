"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  Calendar,
  Plus,
  AlertCircle,
  LayoutGrid,
  List,
  Search,
  ExternalLink,
  Sparkles,
  Users,
  Building2,
  Video,
} from "lucide-react";
import EventCard from "@/components/events/EventCard";
import CreateEventModal from "@/components/events/CreateEventModal";
import { isAnyAdmin, isAlumni, isFaculty } from "@/lib/roleUtils";
import { isUpcoming, isPast, formatEventDate } from "@/lib/utils/dateUtils";
import { useAuth } from "@/contexts/auth-context";
import { useEventsQuery, useMyEventsQuery } from "@/hooks/queries/events";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const TABS = ["All Events", "Alumni Sessions", "Club Collaborations", "My Events"] as const;
export type UnifiedEventTab = (typeof TABS)[number];

export default function UnifiedEventsPage() {
  const searchParams = useSearchParams();
  const initialTabParam = searchParams.get("tab");

  const [activeTab, setActiveTab] = useState<UnifiedEventTab>("All Events");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"card" | "table">("card");

  useEffect(() => {
    if (initialTabParam === "alumni-sessions") {
      setActiveTab("Alumni Sessions");
    } else if (initialTabParam === "club-events") {
      setActiveTab("Club Collaborations");
    }
  }, [initialTabParam]);

  const { user } = useAuth();
  const { data: allEventsData, isLoading: loading, error: fetchError, refetch: loadEvents } = useEventsQuery();
  const { data: myEventsData, isLoading: loadingMyEvents } = useMyEventsQuery();

  const allEvents = allEventsData ?? [];
  const myEvents = myEventsData ?? [];
  const userRoles = user?.roles ?? [];

  const canCreateEvent = isAnyAdmin(userRoles) || isAlumni(userRoles) || isFaculty(userRoles);
  const error: string | null = fetchError?.message ?? null;

  const filteredEvents = useMemo(() => {
    let dataset = allEvents;

    if (activeTab === "Alumni Sessions") {
      dataset = allEvents.filter((e) => e.category === "ALUMNI_SESSION");
    } else if (activeTab === "Club Collaborations") {
      dataset = allEvents.filter((e) => e.collaboratingClubs && e.collaboratingClubs.length > 0);
    } else if (activeTab === "My Events") {
      dataset = myEvents;
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      dataset = dataset.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          (e.description && e.description.toLowerCase().includes(q)) ||
          e.location.toLowerCase().includes(q) ||
          (e.speakerName && e.speakerName.toLowerCase().includes(q))
      );
    }

    return dataset;
  }, [allEvents, myEvents, activeTab, searchQuery]);

  const isCurrentlyLoading = activeTab === "My Events" ? loadingMyEvents : loading;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 pb-6 space-y-6">
      {/* Header */}
      <div className="sticky top-14 z-30 bg-background/95 backdrop-blur-md py-4 border-b border-border/40 -mx-4 sm:-mx-6 px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" /> Events &amp; Sessions Hub
            </h1>
            <p className="text-xs text-muted-foreground">
              Discover campus activities, alumni keynote talks, club collaborations, and webinars.
            </p>
          </div>
          {canCreateEvent && (
            <Button
              onClick={() => setShowCreateModal(true)}
              size="sm"
              className="cursor-pointer shrink-0"
            >
              <Plus className="h-4 w-4 mr-1.5" />
              Publish Event / Talk
            </Button>
          )}
        </div>
      </div>

      {/* Tabs & Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-wrap">
          <Tabs
            value={activeTab}
            onValueChange={(v) => setActiveTab(v as UnifiedEventTab)}
          >
            <TabsList className="h-8 p-0.5 bg-muted">
              {TABS.map((tab) => (
                <TabsTrigger
                  key={tab}
                  value={tab}
                  className="h-7 text-xs px-3"
                >
                  {tab}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          {/* View Switcher */}
          <div className="flex items-center border border-border rounded-lg p-0.5 h-8 bg-muted/40">
            <Button
              variant={viewMode === "card" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => setViewMode("card")}
              className="h-7 w-7 p-0 cursor-pointer"
              title="Grid View"
            >
              <LayoutGrid className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant={viewMode === "table" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => setViewMode("table")}
              className="h-7 w-7 p-0 cursor-pointer"
              title="Table View"
            >
              <List className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/60" />
            <Input
              placeholder="Search by title, speaker, location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 pl-8 text-xs bg-muted/30 border-border w-[200px] md:w-[240px] focus-visible:ring-1"
            />
          </div>

          {!isCurrentlyLoading && !error && (
            <span className="text-xs font-medium text-muted-foreground shrink-0 hidden sm:inline">
              {filteredEvents.length} events
            </span>
          )}
        </div>
      </div>

      {/* Loading */}
      {isCurrentlyLoading && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-[340px] rounded-xl" />
          ))}
        </div>
      )}

      {/* Error */}
      {!isCurrentlyLoading && error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
          <div className="mt-3">
            <Button onClick={() => loadEvents()} variant="outline" size="xs">
              Retry
            </Button>
          </div>
        </Alert>
      )}

      {/* Empty */}
      {!isCurrentlyLoading && !error && filteredEvents.length === 0 && (
        <Card className="rounded-xl border border-border bg-card">
          <CardContent className="flex flex-col items-center py-16 text-center">
            <Calendar className="h-8 w-8 text-muted-foreground/60 mb-3" />
            <p className="font-semibold text-foreground text-sm">
              {searchQuery ? "No matching events found" : `No ${activeTab.toLowerCase()} available`}
            </p>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm">
              {searchQuery
                ? "Try adjusting your search keywords."
                : activeTab === "Alumni Sessions"
                  ? "No alumni keynote sessions or webinars posted yet."
                  : activeTab === "Club Collaborations"
                    ? "No club collaborated events posted yet."
                    : "Check back soon for new announcements."}
            </p>
            {searchQuery && (
              <Button
                onClick={() => setSearchQuery("")}
                variant="outline"
                size="xs"
                className="mt-4 cursor-pointer"
              >
                Clear Search
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Grid / Table Views */}
      {!isCurrentlyLoading &&
        !error &&
        filteredEvents.length > 0 &&
        (viewMode === "card" ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-xs text-foreground min-w-[600px]">
                <thead>
                  <tr className="border-b border-border bg-muted/40 text-[10px] uppercase font-semibold text-muted-foreground tracking-wider">
                    <th className="p-3 pl-4">Title &amp; Type</th>
                    <th className="p-3">Date</th>
                    <th className="p-3">Location / Mode</th>
                    <th className="p-3">Speaker / Clubs</th>
                    <th className="p-3 text-right pr-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEvents.map((event) => (
                    <tr
                      key={event.id}
                      className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors"
                    >
                      <td className="p-3 pl-4">
                        <p className="font-bold text-foreground">{event.title}</p>
                        <Badge variant="secondary" className="text-[9px] font-normal mt-0.5">
                          {event.category || "GENERAL"}
                        </Badge>
                      </td>
                      <td className="p-3 text-muted-foreground">
                        {formatEventDate(event.eventDate)}
                      </td>
                      <td className="p-3 text-muted-foreground">
                        {event.location}
                      </td>
                      <td className="p-3 text-muted-foreground">
                        {event.speakerName ? (
                          <span className="font-medium text-foreground">{event.speakerName}</span>
                        ) : event.collaboratingClubs && event.collaboratingClubs.length > 0 ? (
                          <span>{event.collaboratingClubs.map((c) => c.name).join(", ")}</span>
                        ) : (
                          <span className="text-muted-foreground/40">&mdash;</span>
                        )}
                      </td>
                      <td className="p-3 text-right pr-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/events/${event.id}`}>
                            <Button variant="outline" size="xs" className="cursor-pointer">
                              Details
                            </Button>
                          </Link>
                          {event.registrationRequired && event.registrationLink && (
                            <a
                              href={event.registrationLink}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Button size="xs" className="cursor-pointer gap-1">
                                Register <ExternalLink className="h-3 w-3" />
                              </Button>
                            </a>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}

      <CreateEventModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onCreated={() => {
          setShowCreateModal(false);
          loadEvents();
        }}
      />
    </div>
  );
}
