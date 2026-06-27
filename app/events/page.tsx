"use client";

import { useState, useEffect, useCallback } from "react";
import { Calendar, Plus, AlertCircle } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import EventCard from "@/components/events/EventCard";
import CreateEventModal from "@/components/events/CreateEventModal";
import { fetchAllEvents } from "@/lib/api/events";
import { Event } from "@/lib/types/events";
import { isAnyAdmin } from "@/lib/roleUtils";
import { isUpcoming, isPast } from "@/lib/utils/dateUtils";
import { getToken, getUserRole } from "@/lib/auth";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";

const TABS = ["Upcoming", "My Events", "Past"] as const;
export type EventTab = (typeof TABS)[number];

export default function EventsPage() {
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [myEvents, setMyEvents] = useState<Event[]>([]);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMyEvents, setLoadingMyEvents] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<EventTab>("Upcoming");
  const [showCreateModal, setShowCreateModal] = useState(false);

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

  const isCurrentlyLoading = activeTab === "My Events" ? loadingMyEvents : loading;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Events
            </h1>
            <p className="text-sm text-muted-foreground">
              Upcoming events for our alumni community
            </p>
          </div>
          {hasAdminAccess && (
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="h-4 w-4" />
              Create Event
            </Button>
          )}
        </div>

        <Separator />

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as EventTab)}>
          <TabsList>
            {TABS.map((tab) => (
              <TabsTrigger key={tab} value={tab}>
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {isCurrentlyLoading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map(() => (
              <Skeleton key={crypto.randomUUID()} className="h-[320px] rounded-[min(var(--radius-4xl),24px)]" />
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

        {!isCurrentlyLoading && !error && displayEvents.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center py-16">
              <Calendar className="h-8 w-8 text-muted-foreground mb-4" />
              <p className="font-semibold text-foreground">
                No {activeTab.toLowerCase()} events
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {activeTab === "Upcoming"
                  ? "Check back soon."
                  : activeTab === "My Events"
                    ? "You haven't created any events yet."
                    : "No past events to show."}
              </p>
            </CardContent>
          </Card>
        )}

        {!isCurrentlyLoading && !error && displayEvents.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>

      <Footer />

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
