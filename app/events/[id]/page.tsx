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
  Clock,
  Tag,
} from "lucide-react";
import PhotoGallery from "@/components/events/PhotoGallery";
import VideoList from "@/components/events/VideoList";
import OrganizerPanel from "@/components/events/OrganizerPanel";
import { fetchEventById } from "@/lib/api/events";
import type { Event } from "@/lib/types/events";
import {
  formatEventDate,
  formatMonth,
  formatDay,
  isPast,
} from "@/lib/utils/dateUtils";
import { getToken } from "@/lib/auth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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

      if (typeof window !== "undefined") {
        sessionStorage.setItem("current_event_title", data.title);
        window.dispatchEvent(new Event("current_event_title_changed"));
      }

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
      <div className="w-full px-6 py-6 space-y-4">
        <Skeleton className="h-4 w-24 rounded-md" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-[300px] rounded-2xl" />
            <Skeleton className="h-48 rounded-xl" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-64 rounded-xl" />
            <Skeleton className="h-10 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="w-full px-6 py-24 text-center space-y-4 flex flex-col items-center justify-center">
        <AlertCircle className="h-8 w-8 text-destructive mx-auto" />
        <h2 className="font-semibold text-foreground text-base">
          {error ?? "Event not found"}
        </h2>
        <Link href="/events">
          <Button variant="outline" size="sm">Back to Events</Button>
        </Link>
      </div>
    );
  }

  const coverImage = event.photoUrls?.[0] ?? null;
  const past = isPast(event.eventDate);

  return (
    <div className="w-full px-4 sm:px-6 py-6 space-y-6">
      {/* Back link */}
      <Link
        href="/events"
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-3 w-3" />
        All Events
      </Link>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

        {/* Left: Hero Card + Tabs */}
        <div className="lg:col-span-2 space-y-6">

          {/* Landscape Hero Card */}
          <div className="bg-card text-card-foreground rounded-2xl border border-border shadow-sm overflow-hidden">
            <div className="flex flex-col md:flex-row">

              {/* Image - padded with rounded corners */}
              <div className="md:w-[45%] p-3 shrink-0">
                <div className="relative w-full h-[220px] md:h-full min-h-[220px] rounded-xl overflow-hidden bg-muted">
                  {coverImage ? (
                    <img
                      src={coverImage}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground/30">
                      <Calendar className="h-12 w-12" />
                    </div>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 p-5 md:p-6 flex flex-col gap-4">
                {/* Badges */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  {past ? (
                    <Badge variant="secondary" className="text-[10px] font-semibold">Past Event</Badge>
                  ) : (
                    <Badge variant="default" className="text-[10px] font-semibold">Upcoming</Badge>
                  )}
                  {event.batchYear && (
                    <Badge variant="outline" className="text-[10px] font-semibold">
                      Batch {event.batchYear}
                    </Badge>
                  )}
                </div>

                {/* Title */}
                <h1 className="text-xl md:text-2xl font-bold tracking-tight text-foreground leading-tight">
                  {event.title}
                </h1>

                {/* Description */}
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {event.description || "No description provided."}
                </p>

                {/* Meta rows */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5 shrink-0" />
                    <span>{formatEventDate(event.eventDate)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3.5 w-3.5 shrink-0" />
                    <span>{formatMonth(event.eventDate)} {formatDay(event.eventDate)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5 shrink-0" />
                    <span>{event.location}</span>
                  </div>
                  {event.batchYear && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Tag className="h-3.5 w-3.5 shrink-0" />
                      <span>Batch {event.batchYear}</span>
                    </div>
                  )}
                  {event.createdByName && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Users className="h-3.5 w-3.5 shrink-0" />
                      <span>Organized by {event.createdByName}</span>
                      {isOrganizer && (
                        <Badge variant="secondary" className="text-[9px] px-1 py-0 h-4">You</Badge>
                      )}
                    </div>
                  )}
                </div>

                {/* Separator + Register */}
                <div className="mt-auto pt-3 border-t border-border/50">
                  {!past && event.registrationRequired && event.registrationLink ? (
                    <a
                      href={event.registrationLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button className="w-full cursor-pointer gap-1.5">
                        Register Now
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Button>
                    </a>
                  ) : past ? (
                    <p className="text-xs text-muted-foreground text-center py-2 font-medium">
                      This event has ended
                    </p>
                  ) : (
                    <p className="text-xs text-muted-foreground text-center py-2 font-medium">
                      No registration required
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Tabs: About / Photos / Videos */}
          <Tabs defaultValue="about" className="w-full">
            <TabsList className="bg-muted p-0.5 h-8">
              <TabsTrigger value="about" className="h-7 text-xs px-4">About</TabsTrigger>
              {(event.photos?.length ?? 0) > 0 && (
                <TabsTrigger value="photos" className="h-7 text-xs px-4">
                  Photos ({event.photos?.length})
                </TabsTrigger>
              )}
              {(event.videos?.length ?? 0) > 0 && (
                <TabsTrigger value="videos" className="h-7 text-xs px-4">
                  Videos ({event.videos?.length})
                </TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="about" className="mt-4 focus-visible:outline-none">
              <div className="bg-card text-card-foreground rounded-2xl border border-border shadow-sm p-5 space-y-4">
                <p className="text-xs text-muted-foreground whitespace-pre-line leading-relaxed">
                  {event.description || "No description provided."}
                </p>
                {/* Small photo previews */}
                {(event.photos?.length ?? 0) > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-foreground mb-2">Photos</p>
                    <div className="flex gap-2">
                      {event.photos?.slice(0, 4).map((photo, i) => (
                        <div key={i} className="w-16 h-16 rounded-lg overflow-hidden bg-muted shrink-0">
                          <img
                            src={photo.photoUrl}
                            alt={`Photo ${i + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            {(event.photos?.length ?? 0) > 0 && (
              <TabsContent value="photos" className="mt-4 focus-visible:outline-none">
                <PhotoGallery
                  eventId={event.id}
                  photos={event.photos ?? []}
                  isOrganizer={isOrganizer}
                  onPhotosChanged={handleMediaChanged}
                />
              </TabsContent>
            )}

            {(event.videos?.length ?? 0) > 0 && (
              <TabsContent value="videos" className="mt-4 focus-visible:outline-none">
                <VideoList
                  eventId={event.id}
                  videos={event.videos ?? []}
                  isOrganizer={isOrganizer}
                  onVideosChanged={handleMediaChanged}
                />
              </TabsContent>
            )}
          </Tabs>
        </div>

        {/* Right Column: Organizer controls only */}
        <div className="space-y-4">
          {/* Organizer controls */}
          {isOrganizer && (
            <div className="bg-card text-card-foreground rounded-2xl border border-dashed border-primary/30 p-5 bg-primary/5 space-y-3">
              <p className="text-xs font-semibold text-primary uppercase tracking-wider">Organizer Controls</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                You have administrative access to add photos and videos to this event.
              </p>
              <Dialog>
                <DialogTrigger>
                  <Button className="w-full cursor-pointer" size="sm">Add Media</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Add Event Media</DialogTitle>
                  </DialogHeader>
                  <div className="pt-2">
                    <OrganizerPanel
                      eventId={event.id}
                      onMediaAdded={handleMediaChanged}
                    />
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
