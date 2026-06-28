"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Calendar,
  Plus,
  AlertCircle,
  LayoutGrid,
  List,
  Search,
  ExternalLink,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import DashboardSidebar from "@/components/layout/DashboardSidebar";
import EventCard from "@/components/events/EventCard";
import CreateEventModal from "@/components/events/CreateEventModal";
import { fetchAllEvents } from "@/lib/api/events";
import type { Event } from "@/lib/types/events";
import { SidebarInset } from "@/components/ui/sidebar";
import { isAnyAdmin } from "@/lib/roleUtils";
import { isUpcoming, isPast, formatEventDate } from "@/lib/utils/dateUtils";
import { getToken, getUserRole } from "@/lib/auth";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const TABS = ["Upcoming", "My Events", "Past"] as const;
export type EventTab = (typeof TABS)[number];

export default function EventsPage() {
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [myEvents, setMyEvents] = useState<Event[]>([]);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMyEvents, setLoadingMyEvents] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<EventTab>("Upcoming");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"card" | "table">("card");

  const loadEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = getToken() ?? "";
      const data = await fetchAllEvents(token);
      setAllEvents(data);
    } catch (err: any) {
      setError(err.message || "Failed to load events.");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMyEvents = useCallback(async () => {
    const token = getToken();
    if (!token) return;
    setLoadingMyEvents(true);
    try {
      const res = await fetch("http://localhost:8080/events/mine", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch your events");
      const data = await res.json();
      setMyEvents(data);
    } catch (err: any) {
      console.error("Error loading my events:", err);
    } finally {
      setLoadingMyEvents(false);
    }
  }, []);

  useEffect(() => {
    const role = getUserRole();
    setUserRole(role);

    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("alumni_user");
      if (stored) {
        try {
          setUser(JSON.parse(stored));
        } catch (e) {
          console.error("Failed to parse user storage in events list:", e);
        }
      }
    }
  }, []);

  const hasAdminAccess = isAnyAdmin(userRole);
  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  useEffect(() => {
    if (activeTab === "My Events" && myEvents.length === 0) {
      loadMyEvents();
    }
  }, [activeTab, loadMyEvents, myEvents.length]);

  const upcomingEvents = allEvents.filter((e) => isUpcoming(e.eventDate));
  const pastEvents = allEvents.filter((e) => isPast(e.eventDate));

  const displayEvents =
    activeTab === "Upcoming"
      ? upcomingEvents
      : activeTab === "Past"
        ? pastEvents
        : myEvents;

  const filteredEvents = displayEvents.filter((event) => {
    const query = searchQuery.toLowerCase();
    return (
      event.title.toLowerCase().includes(query) ||
      (event.description && event.description.toLowerCase().includes(query)) ||
      event.location.toLowerCase().includes(query)
    );
  });

  const isCurrentlyLoading =
    activeTab === "My Events" ? loadingMyEvents : loading;

  return (
    <div className="flex min-h-screen bg-background w-full">
      {user && (
        <DashboardSidebar
          role={(userRole as any) || "alumni"}
          userName={user.fullName || user.name}
          userEmail={user.email}
        />
      )}

      <SidebarInset>
        <Navbar />

        <div className="w-full px-6 pb-6 space-y-6">
          <div className="sticky top-14 z-30 bg-background/95 backdrop-blur-md py-4 border-b border-border/40 -mx-6 px-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h1 className="text-xl font-semibold tracking-tight text-foreground">
                  Events
                </h1>
                <p className="text-xs text-muted-foreground">
                  Connect and participate in our community events
                </p>
              </div>
              {hasAdminAccess && (
                <Button
                  onClick={() => setShowCreateModal(true)}
                  className="cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  Create Event
                </Button>
              )}
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-wrap">
              <Tabs
                value={activeTab}
                onValueChange={(v) => setActiveTab(v as EventTab)}
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

              {/* View Switcher (Grid/List) */}
              <div className="flex items-center border border-border rounded p-0.5 h-8 bg-muted/40">
                <Button
                  variant={viewMode === "card" ? "secondary" : "ghost"}
                  size="icon-xs"
                  onClick={() => setViewMode("card")}
                  className="size-7 p-0 cursor-pointer"
                  title="Grid View"
                >
                  <LayoutGrid className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant={viewMode === "table" ? "secondary" : "ghost"}
                  size="icon-xs"
                  onClick={() => setViewMode("table")}
                  className="size-7 p-0 cursor-pointer"
                  title="Table View"
                >
                  <List className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Search Box */}
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/60" />
                <Input
                  placeholder="Search events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-8 pl-8 text-xs bg-muted/30 border-border w-[200px] md:w-[240px] focus-visible:ring-1"
                />
              </div>

              {!isCurrentlyLoading && !error && (
                <span className="text-xs font-medium text-muted-foreground shrink-0 hidden sm:inline">
                  Showing {filteredEvents.length} of {displayEvents.length}{" "}
                  events
                </span>
              )}
            </div>
          </div>

          {isCurrentlyLoading && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map(() => (
                <Skeleton
                  key={crypto.randomUUID()}
                  className="h-[380px] rounded-xl"
                />
              ))}
            </div>
          )}

          {!isCurrentlyLoading && error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
              <div className="mt-3">
                <Button onClick={loadEvents} variant="outline" size="sm">
                  Retry
                </Button>
              </div>
            </Alert>
          )}

          {!isCurrentlyLoading && !error && filteredEvents.length === 0 && (
            <Card className="rounded-lg border border-border bg-card">
              <CardContent className="flex flex-col items-center py-16 text-center">
                <Calendar className="h-8 w-8 text-muted-foreground/60 mb-3" />
                <p className="font-semibold text-foreground text-sm">
                  {searchQuery
                    ? "No matching events found"
                    : `No ${activeTab.toLowerCase()} events`}
                </p>
                <p className="text-xs text-muted-foreground mt-1 max-w-sm">
                  {searchQuery
                    ? "Try adjusting your search keywords or clear the filter."
                    : activeTab === "Upcoming"
                      ? "Check back soon for new announcements."
                      : activeTab === "My Events"
                        ? "You haven't created any events yet."
                        : "No past events are archived."}
                </p>
                {searchQuery && (
                  <Button
                    onClick={() => setSearchQuery("")}
                    variant="outline"
                    className="mt-4 cursor-pointer"
                  >
                    Clear Search
                  </Button>
                )}
              </CardContent>
            </Card>
          )}

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
              <div className="rounded-lg border border-border bg-card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left text-xs text-foreground min-w-[600px]">
                    <thead>
                      <tr className="border-b border-border bg-muted/40 text-[10px] uppercase font-semibold text-muted-foreground tracking-wider">
                        <th className="p-3 pl-4">Title</th>
                        <th className="p-3">Date</th>
                        <th className="p-3">Location</th>
                        <th className="p-3">Batch restriction</th>
                        <th className="p-3 text-right pr-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredEvents.map((event) => {
                        const past = isPast(event.eventDate);
                        return (
                          <tr
                            key={event.id}
                            className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors"
                          >
                            <td className="p-3 pl-4 font-semibold text-foreground">
                              {event.title}
                            </td>
                            <td className="p-3 text-muted-foreground">
                              {formatEventDate(event.eventDate)}
                            </td>
                            <td className="p-3 text-muted-foreground">
                              {event.location}
                            </td>
                            <td className="p-3">
                              {event.batchYear ? (
                                <Badge
                                  variant="outline"
                                  className="text-[10px] font-semibold"
                                >
                                  Batch {event.batchYear}
                                </Badge>
                              ) : (
                                <span className="text-muted-foreground/30">
                                  &mdash;
                                </span>
                              )}
                            </td>
                            <td className="p-3 text-right pr-4">
                              <div className="flex items-center justify-end gap-2">
                                <Link href={`/events/${event.id}`}>
                                  <Button
                                    variant="outline"
                                    className="cursor-pointer"
                                  >
                                    Details
                                  </Button>
                                </Link>
                                {!past &&
                                  event.registrationRequired &&
                                  event.registrationLink && (
                                    <a
                                      href={event.registrationLink}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      <Button className="cursor-pointer flex items-center gap-1">
                                        Register{" "}
                                        <ExternalLink className="h-3 w-3" />
                                      </Button>
                                    </a>
                                  )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
        </div>
      </SidebarInset>

      <CreateEventModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onCreated={() => {
          setShowCreateModal(false);
          loadEvents();
          if (activeTab === "My Events") loadMyEvents();
        }}
      />
    </div>
  );
}
