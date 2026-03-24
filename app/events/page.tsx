"use client";

// app/events/page.tsx

import { useState, useEffect, useCallback } from "react";
import { Calendar, Plus, Loader2, AlertCircle } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import EventTabs, { EventTab } from "@/components/events/EventTabs";
import EventCard from "@/components/events/EventCard";
import EventCardCompact from "@/components/events/EventCardCompact";
import EventListItem from "@/components/events/EventListItem";
import CreateEventModal from "@/components/events/CreateEventModal";
import { fetchAllEvents } from "@/lib/api/events";
import { Event } from "@/lib/types/events";
import { formatMonthYear, isUpcoming, isPast } from "@/lib/utils/dateUtils";
import { getToken } from "@/lib/auth";

function groupByMonth(events: Event[]): Map<string, Event[]> {
  const map = new Map<string, Event[]>();
  for (const event of events) {
    const key = formatMonthYear(event.eventDate);
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(event);
  }
  return map;
}

export default function EventsPage() {
  // State for all public events
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  // State for user's specific events
  const [myEvents, setMyEvents] = useState<Event[]>([]);

  const [loading, setLoading] = useState(true);
  const [loadingMyEvents, setLoadingMyEvents] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<EventTab>("Upcoming");
  const [showCreateModal, setShowCreateModal] = useState(false);

  // 1. Fetch ALL public events (Upcoming & Past)
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

  // 2. Fetch ONLY the current user's events
  const loadMyEvents = useCallback(async () => {
    const token = getToken();
    if (!token) return; // Ignore if user isn't logged in

    setLoadingMyEvents(true);
    try {
      // NOTE: You might want to move this fetch to @/lib/api/events alongside fetchAllEvents
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

  // Initial load of public events
  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  // Trigger 'My Events' fetch ONLY when the user clicks the tab
  useEffect(() => {
    if (activeTab === "My Events" && myEvents.length === 0) {
      loadMyEvents();
    }
  }, [activeTab, loadMyEvents, myEvents.length]);

  // ---- Filter by tab ----
  const upcomingEvents = allEvents.filter((e) => isUpcoming(e.eventDate));
  const pastEvents = allEvents.filter((e) => isPast(e.eventDate));

  const displayEvents =
    activeTab === "Upcoming"
      ? upcomingEvents
      : activeTab === "Past"
        ? pastEvents
        : myEvents;

  const grouped = groupByMonth(displayEvents);

  // Determine if we should show a loading spinner based on the active tab
  const isCurrentlyLoading =
    activeTab === "My Events" ? loadingMyEvents : loading;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="bg-navy-950 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="font-serif text-3xl font-bold text-white mb-2">
              Events & Reunions
            </h1>
            <p className="text-gray-400">
              Upcoming events for our alumni community
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="h-4 w-4" />
            Submit Event
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <EventTabs active={activeTab} onChange={setActiveTab} />

        {isCurrentlyLoading && (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <Loader2 className="h-8 w-8 text-navy-400 animate-spin" />
            <p className="text-gray-400 text-sm">Loading events…</p>
          </div>
        )}

        {!isCurrentlyLoading && error && (
          <div className="rounded-2xl bg-red-50 border border-red-200 p-8 text-center">
            <AlertCircle className="h-10 w-10 text-red-400 mx-auto mb-3" />
            <p className="text-red-700 font-medium">{error}</p>
            <button onClick={loadEvents} className="btn-primary mt-4 px-6">
              Retry
            </button>
          </div>
        )}

        {!isCurrentlyLoading && !error && displayEvents.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
            <div className="w-16 h-16 rounded-2xl bg-navy-50 flex items-center justify-center">
              <Calendar className="h-8 w-8 text-navy-300" />
            </div>
            <div>
              <p className="text-navy-900 font-semibold text-lg">
                No {activeTab.toLowerCase()} events
              </p>
              <p className="text-gray-400 text-sm mt-1">
                {activeTab === "Upcoming"
                  ? "Check back soon — events will appear here when posted."
                  : activeTab === "My Events"
                    ? "You haven't created any events yet."
                    : "No past events to show."}
              </p>
            </div>
          </div>
        )}

        {!isCurrentlyLoading && !error && displayEvents.length > 0 && (
          <div className="space-y-10">
            {Array.from(grouped.entries()).map(
              ([monthYear, events], groupIdx) => (
                <section key={monthYear}>
                  <div className="flex items-center gap-2 mb-5">
                    <Calendar className="h-4 w-4 text-gold-500" />
                    <h2 className="font-bold text-navy-900 font-serif">
                      {monthYear}
                    </h2>
                  </div>

                  {groupIdx === 0 && events[0] && (
                    <EventCard event={events[0]} />
                  )}

                  {groupIdx === 0 && events.length > 1 && (
                    <div className="grid md:grid-cols-2 gap-5 mt-5">
                      {events.slice(1).map((event) => (
                        <EventCardCompact key={event.id} event={event} />
                      ))}
                    </div>
                  )}

                  {groupIdx > 0 && (
                    <div className="space-y-3">
                      {events.map((event) => (
                        <EventListItem key={event.id} event={event} />
                      ))}
                    </div>
                  )}
                </section>
              ),
            )}
          </div>
        )}
      </div>

      <Footer />

      {showCreateModal && (
        <CreateEventModal
          onClose={() => setShowCreateModal(false)}
          onCreated={() => {
            setShowCreateModal(false);
            loadEvents();
            if (activeTab === "My Events") loadMyEvents(); // Refresh my events if that tab is open
          }}
        />
      )}
    </div>
  );
}
