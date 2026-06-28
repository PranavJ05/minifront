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
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
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
  const [activeTab, setActiveTab] = useState("about");

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
            <Skeleton className="h-[300px] rounded-xl" />
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
    <div className="w-full px-6 py-6 md:px-8 space-y-6">
      <Link
        href="/events"
        className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-3 w-3" />
        All Events
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column: Cover Card & Tabbed Info */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Proper Event Card */}
          <Card className="overflow-hidden border border-border bg-card">
            <div className="flex flex-col md:flex-row min-h-[220px]">
              {/* Cover Image container */}
              <div className="md:w-2/5 relative min-h-[200px] md:min-h-auto bg-muted overflow-hidden shrink-0">
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
                {/* Sharp clean border next to content */}
                <div className="absolute inset-y-0 right-0 w-[1px] bg-border hidden md:block" />
                <div className="absolute inset-x-0 bottom-0 h-[1px] bg-border md:hidden" />
              </div>

              {/* Text details area */}
              <div className="flex-1 p-5 md:p-6 flex flex-col justify-between space-y-4">
                <div className="space-y-2.5">
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
                  
                  <h1 className="text-xl md:text-2xl font-bold tracking-tight text-foreground leading-tight">
                    {event.title}
                  </h1>
                  
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                    {event.description || "No description provided."}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium flex-wrap pt-2 border-t border-border/30">
                  <span>{formatEventDate(event.eventDate)}</span>
                  <span className="text-border">&bull;</span>
                  <span>{event.location}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Tabbed Info */}
          {/* Tabbed Info */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="bg-muted p-0.5 h-8">
              <TabsTrigger value="about" className="h-7 text-xs px-4">About</TabsTrigger>
              {(event.photos?.length > 0 || isOrganizer) && (
                <TabsTrigger value="gallery" className="h-7 text-xs px-4">Gallery</TabsTrigger>
              )}
              {(event.videos?.length > 0 || isOrganizer) && (
                <TabsTrigger value="videos" className="h-7 text-xs px-4">Videos</TabsTrigger>
              )}
            </TabsList>
            
            <TabsContent value="about" className="mt-4 focus-visible:outline-none space-y-6">
              <div className="rounded-lg border border-border bg-card p-6 space-y-4">
                <h3 className="text-sm font-semibold text-foreground">About this Event</h3>
                <p className="text-xs text-muted-foreground whitespace-pre-line leading-relaxed">
                  {event.description || "No description provided."}
                </p>
              </div>

              {/* Photos preview block */}
              {event.photos?.length > 0 && (
                <div className="relative">
                  <span
                    onClick={() => setActiveTab("gallery")}
                    className="absolute top-6 right-6 z-10 text-[11px] text-primary hover:underline cursor-pointer font-medium"
                  >
                    View Gallery
                  </span>
                  <PhotoGallery
                    eventId={event.id}
                    photos={event.photos}
                    isOrganizer={isOrganizer}
                    onPhotosChanged={handleMediaChanged}
                  />
                </div>
              )}

              {/* Videos preview block */}
              {event.videos?.length > 0 && (
                <div className="relative">
                  <span
                    onClick={() => setActiveTab("videos")}
                    className="absolute top-6 right-6 z-10 text-[11px] text-primary hover:underline cursor-pointer font-medium"
                  >
                    View Videos
                  </span>
                  <VideoList
                    eventId={event.id}
                    videos={event.videos}
                    isOrganizer={isOrganizer}
                    onVideosChanged={handleMediaChanged}
                  />
                </div>
              )}
            </TabsContent>
            
            {(event.photos?.length > 0 || isOrganizer) && (
              <TabsContent value="gallery" className="mt-4 focus-visible:outline-none">
                <PhotoGallery
                  eventId={event.id}
                  photos={event.photos ?? []}
                  isOrganizer={isOrganizer}
                  onPhotosChanged={handleMediaChanged}
                />
              </TabsContent>
            )}
            
            {(event.videos?.length > 0 || isOrganizer) && (
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

        {/* Right Column: Widgets */}
        <div className="space-y-4">
          {/* Event details widget */}
          <div className="rounded-lg border border-border bg-card p-5 space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Details</h3>
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 text-primary text-center px-2 py-1.5 rounded w-12 shrink-0 border border-primary/20">
                <span className="block text-[10px] uppercase leading-none font-semibold">
                  {formatMonth(event.eventDate)}
                </span>
                <span className="block text-base font-bold leading-tight mt-0.5">
                  {formatDay(event.eventDate)}
                </span>
              </div>
              <div className="space-y-0.5">
                <p className="text-xs font-semibold text-foreground">
                  {formatEventDate(event.eventDate)}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  {event.location}
                </p>
              </div>
            </div>

            <Separator className="bg-border/60" />

            <div className="space-y-2 text-xs">
              {event.batchYear && (
                <p className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0" />
                  Batch {event.batchYear} Restriction
                </p>
              )}
              {event.createdByName && (
                <p className="flex items-center gap-2 text-muted-foreground">
                  <Users className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0" />
                  Organized by {event.createdByName}
                  {isOrganizer && (
                    <Badge variant="secondary" className="text-[9px] px-1 py-0 h-4 ml-1">You</Badge>
                  )}
                </p>
              )}
            </div>
          </div>

          {/* Registration action widget */}
          <div className="rounded-lg border border-border bg-card p-5 space-y-3">
            {!past && event.registrationRequired && event.registrationLink ? (
              <a
                href={event.registrationLink}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Button className="w-full cursor-pointer flex items-center justify-center gap-1.5" size="sm">
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

          {/* Organizer panel modal trigger */}
          {isOrganizer && (
            <div className="rounded-lg border border-dashed border-primary/30 p-5 bg-primary/5 space-y-3">
              <p className="text-xs font-semibold text-primary uppercase tracking-wider">Organizer Controls</p>
              <p className="text-xs text-muted-foreground leading-relaxed">You have administrative access to add photos and videos to this event.</p>
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
