"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Users,
  ExternalLink,
  AlertCircle,
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
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardAction } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOrganizer, setIsOrganizer] = useState(false);

  const loadEvent = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = getToken() ?? "";
      const data = await fetchEventById(Number(id), token);
      setEvent(data);

      if (token) {
        try {
          const myEventsRes = await fetch("http://localhost:8080/events/mine", {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (myEventsRes.ok) {
            const myEvents: Event[] = await myEventsRes.json();
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

  const handleMediaChanged = useCallback(() => {
    loadEvent();
  }, [loadEvent]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-4">
          <Skeleton className="h-4 w-24" />
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <Skeleton className="h-[300px] rounded-[min(var(--radius-4xl),24px)]" />
              <Skeleton className="h-48 rounded-[min(var(--radius-4xl),24px)]" />
              <Skeleton className="h-24 rounded-[min(var(--radius-4xl),24px)]" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-64 rounded-[min(var(--radius-4xl),24px)]" />
              <Skeleton className="h-10 rounded-[min(var(--radius-4xl),24px)]" />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-2xl mx-auto px-4 py-24 text-center space-y-4">
          <AlertCircle className="h-8 w-8 text-destructive mx-auto" />
          <h2 className="font-semibold text-foreground text-xl">
            {error ?? "Event not found"}
          </h2>
          <Link href="/events">
            <Button variant="outline">Back to Events</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const coverImage = event.photoUrls?.[0] ?? null;
  const past = isPast(event.eventDate);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href="/events"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          All Events
        </Link>

        <div className="grid lg:grid-cols-3 gap-6 mt-4">
          <div className="lg:col-span-2 space-y-6">
            <Card className="overflow-hidden">
              {coverImage ? (
                <img
                  src={coverImage}
                  alt={event.title}
                  className="aspect-[2/1] object-cover"
                />
              ) : (
                <div className="aspect-[2/1] flex items-center justify-center bg-muted">
                  <Calendar className="h-12 w-12 text-muted-foreground/50" />
                </div>
              )}
              <CardHeader>
                {past && (
                  <CardAction>
                    <Badge variant="secondary">Past Event</Badge>
                  </CardAction>
                )}
                <CardTitle>{event.title}</CardTitle>
                <CardDescription>
                  {formatEventDate(event.eventDate)} &middot; {event.location}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <p className="text-sm text-foreground font-medium mb-2">
                    About this Event
                  </p>
                  <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
                    {event.description || "No description provided."}
                  </p>
                </div>

                <PhotoGallery
                  eventId={event.id}
                  photos={event.photos ?? []}
                  isOrganizer={isOrganizer}
                  onPhotosChanged={handleMediaChanged}
                />

                <VideoList
                  eventId={event.id}
                  videos={event.videos ?? []}
                  isOrganizer={isOrganizer}
                  onVideosChanged={handleMediaChanged}
                />

                {isOrganizer && (
                  <OrganizerPanel
                    eventId={event.id}
                    onMediaAdded={handleMediaChanged}
                  />
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Event Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="bg-primary text-primary-foreground text-center px-3 py-2 rounded-lg w-14 shrink-0">
                    <span className="block text-xs uppercase leading-none">
                      {formatMonth(event.eventDate)}
                    </span>
                    <span className="block text-xl font-bold leading-tight">
                      {formatDay(event.eventDate)}
                    </span>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium text-foreground">
                      {formatEventDate(event.eventDate)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {event.location}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  {event.batchYear && (
                    <p className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 shrink-0" />
                      Batch {event.batchYear}
                    </p>
                  )}
                  {event.createdByName && (
                    <p className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="h-4 w-4 shrink-0" />
                      Organized by {event.createdByName}
                      {isOrganizer && (
                        <Badge variant="secondary">You</Badge>
                      )}
                    </p>
                  )}
                </div>

                <Separator />

                {!past && event.registrationRequired && event.registrationLink ? (
                  <a
                    href={event.registrationLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button className="w-full">
                      Register Now
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </a>
                ) : past ? (
                  <p className="text-sm text-muted-foreground text-center">
                    This event has ended
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground text-center">
                    No registration required
                  </p>
                )}
              </CardContent>
            </Card>

            <Link href="/events">
              <Button variant="outline" className="w-full">
                <ArrowLeft className="h-4 w-4" />
                Back to All Events
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
