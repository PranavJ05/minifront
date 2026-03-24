"use client";

// app/events/[id]/page.tsx

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Users,
  ExternalLink,
  Loader2,
  AlertCircle,
  User,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PhotoGallery from "@/components/events/PhotoGallery";
import VideoList from "@/components/events/VideoList";
import OrganizerPanel from "@/components/events/OrganizerPanel";
import { fetchEventById } from "@/lib/api/events";
import { Event } from "@/lib/types/events";
import {
  formatEventDate,
  formatMonth,
  formatDay,
  isPast,
} from "@/lib/utils/dateUtils";
import { getToken } from "@/lib/auth";

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Replace the old localStorage check with a secure state variable
  const [isOrganizer, setIsOrganizer] = useState(false);

  const loadEvent = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = getToken() ?? "";

      // 1. Fetch the event details
      const data = await fetchEventById(Number(id), token);
      setEvent(data);

      // 2. Securely check if the user is the organizer using our new endpoint
      if (token) {
        try {
          const myEventsRes = await fetch("http://localhost:8080/events/mine", {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (myEventsRes.ok) {
            const myEvents: Event[] = await myEventsRes.json();
            // If this event's ID exists in their 'mine' list, they are the organizer!
            const ownsEvent = myEvents.some((e) => e.id === data.id);
            setIsOrganizer(ownsEvent);
          }
        } catch (authErr) {
          console.error("Failed to verify organizer status", authErr);
        }
      }
    } catch (err: any) {
      setError(err.message || "Failed to load event.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadEvent();
  }, [loadEvent]);

  // Called by OrganizerPanel / PhotoGallery / VideoList after any mutation
  const handleMediaChanged = useCallback(() => {
    loadEvent();
  }, [loadEvent]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center py-32">
          <Loader2 className="h-8 w-8 text-navy-400 animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-2xl mx-auto px-4 py-24 text-center">
          <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-navy-900 font-bold text-xl mb-2">
            {error ?? "Event not found"}
          </h2>
          <Link href="/events">
            <button className="btn-primary mt-4">Back to Events</button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const coverImage = event.photoUrls?.[0] ?? null;
  const past = isPast(event.eventDate);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* ── Hero ── */}
      <div className="bg-navy-950">
        <div className="relative h-64 md:h-80 w-full">
          {coverImage ? (
            <Image
              src={coverImage}
              alt={event.title}
              fill
              className="object-cover opacity-50"
              priority
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-navy-800 to-navy-950" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/30 to-transparent" />

          <div className="absolute bottom-0 left-0 right-0 max-w-5xl mx-auto px-4 sm:px-6 pb-8">
            <Link
              href="/events"
              className="inline-flex items-center gap-1.5 text-navy-300 hover:text-white text-sm mb-4 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> All Events
            </Link>
            <div className="flex items-start gap-3 flex-wrap">
              <h1 className="font-serif text-3xl md:text-4xl font-bold text-white leading-tight flex-1">
                {event.title}
              </h1>
              {past && (
                <span className="badge bg-gray-700 text-gray-300 text-xs self-center shrink-0">
                  Past Event
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* ── Main column ── */}
          <div className="lg:col-span-2 space-y-6">
            {/* About */}
            <div className="card p-6">
              <h2 className="font-serif font-bold text-navy-900 text-lg mb-3">
                About this Event
              </h2>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                {event.description || "No description provided."}
              </p>
            </div>

            {/* Photo Gallery — always shown (empty state handled inside) */}
            <PhotoGallery
              eventId={event.id}
              photos={event.photos ?? []}
              isOrganizer={isOrganizer}
              onPhotosChanged={handleMediaChanged}
            />

            {/* Video List — always shown */}
            <VideoList
              eventId={event.id}
              videos={event.videos ?? []}
              isOrganizer={isOrganizer}
              onVideosChanged={handleMediaChanged}
            />

            {/* Organizer Panel — only for the creator */}
            {isOrganizer && (
              <OrganizerPanel
                eventId={event.id}
                onMediaAdded={handleMediaChanged}
              />
            )}
          </div>

          {/* ── Sidebar ── */}
          <div className="space-y-4">
            {/* Event details */}
            <div className="card p-6">
              {/* Date badge */}
              <div className="flex items-center gap-3 mb-5">
                <div className="bg-navy-900 text-white text-center px-3 py-2 rounded-xl shrink-0 w-16">
                  <span className="block text-xs text-gray-400 uppercase leading-none">
                    {formatMonth(event.eventDate)}
                  </span>
                  <span className="block text-2xl font-bold leading-tight">
                    {formatDay(event.eventDate)}
                  </span>
                </div>
                <p className="text-navy-900 font-semibold text-sm leading-snug">
                  {formatEventDate(event.eventDate)}
                </p>
              </div>

              <div className="space-y-3 text-sm divide-y divide-gray-50">
                <div className="flex items-start gap-2.5 text-gray-600 pb-3">
                  <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-gray-400" />
                  <span>{event.location}</span>
                </div>

                {event.batchYear ? (
                  <div className="flex items-center gap-2.5 text-gray-600 py-3">
                    <Users className="h-4 w-4 shrink-0 text-gray-400" />
                    <span>Batch {event.batchYear}</span>
                  </div>
                ) : null}

                {event.createdByName && (
                  <div className="flex items-center gap-2.5 text-gray-600 pt-3">
                    <User className="h-4 w-4 shrink-0 text-gray-400" />
                    <span>Organized by {event.createdByName}</span>
                    {isOrganizer && (
                      <span className="ml-auto text-xs text-navy-500 font-semibold bg-navy-50 px-2 py-0.5 rounded-full">
                        You
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Media count summary */}
              {(event.photoUrls.length > 0 || event.videoUrls.length > 0) && (
                <div className="mt-4 flex gap-3">
                  {event.photoUrls.length > 0 && (
                    <span className="text-xs text-gray-500 bg-gray-50 px-2.5 py-1 rounded-full">
                      📷 {event.photoUrls.length} photo
                      {event.photoUrls.length !== 1 ? "s" : ""}
                    </span>
                  )}
                  {event.videoUrls.length > 0 && (
                    <span className="text-xs text-gray-500 bg-gray-50 px-2.5 py-1 rounded-full">
                      🎬 {event.videoUrls.length} video
                      {event.videoUrls.length !== 1 ? "s" : ""}
                    </span>
                  )}
                </div>
              )}

              {/* Registration CTA */}
              {!past && event.registrationRequired && event.registrationLink ? (
                <a
                  href={event.registrationLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-gold w-full flex items-center justify-center gap-2 mt-6"
                >
                  RSVP Now <ExternalLink className="h-3.5 w-3.5" />
                </a>
              ) : past ? (
                <div className="mt-6 p-3 bg-gray-50 rounded-xl text-center text-sm text-gray-400">
                  This event has ended
                </div>
              ) : (
                <div className="mt-6 p-3 bg-gray-50 rounded-xl text-center text-sm text-gray-500">
                  No registration required — just show up!
                </div>
              )}
            </div>

            <Link href="/events">
              <button className="btn-outline w-full text-sm">
                ← Back to All Events
              </button>
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
