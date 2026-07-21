"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Users,
  ExternalLink,
  AlertCircle,
  Tag,
  Plus,
  Camera,
  User,
  Sparkles,
  Video,
  Building2,
} from "lucide-react";
import EventMediaCarousel from "@/components/events/EventMediaCarousel";
import OrganizerPanel from "@/components/events/OrganizerPanel";
import {
  formatEventDate,
  formatMonth,
  formatDay,
  isPast,
} from "@/lib/utils/dateUtils";
import { useAuth } from "@/contexts/auth-context";
import { useEventQuery, useMyEventsQuery } from "@/hooks/queries/events";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { data: event, isLoading: loading, error: fetchError, refetch: loadEvent } = useEventQuery(Number(id));
  const { data: myEvents } = useMyEventsQuery();
  const isOrganizer = myEvents?.some((e) => e.id === event?.id) ?? false;
  const error: string | null = fetchError?.message ?? null;

  useEffect(() => {
    if (event && typeof window !== "undefined") {
      sessionStorage.setItem("current_event_title", event.title);
      window.dispatchEvent(new Event("current_event_title_changed"));
    }
  }, [event]);

  const handleMediaChanged = () => {
    loadEvent();
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <Skeleton className="h-4 w-28 rounded-md" />
        <div className="bg-card text-card-foreground rounded-2xl border border-border shadow-sm flex flex-col md:flex-row p-3 gap-4">
          <Skeleton className="aspect-square md:aspect-[4/5] w-full md:w-[35%] rounded-xl shrink-0" />
          <div className="flex-1 space-y-6 py-2 flex flex-col justify-between">
            <div className="space-y-3">
              <Skeleton className="h-4 w-24 rounded" />
              <Skeleton className="h-8 w-5/6 rounded-lg" />
              <Skeleton className="h-4 w-1/3 rounded" />
            </div>
            <Skeleton className="h-px w-full" />
            <div className="space-y-3">
              <Skeleton className="h-4 w-2/3 rounded" />
              <Skeleton className="h-4 w-1/2 rounded" />
            </div>
            <Skeleton className="h-px w-full" />
            <Skeleton className="h-8 w-28 rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center space-y-4 flex flex-col items-center justify-center">
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
  const eventMonth = formatMonth(event.eventDate);
  const eventDay = formatDay(event.eventDate);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Bar: Back Link & Admin Trigger */}
      <div className="flex items-center justify-between">
        <Link
          href="/events"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Events
        </Link>

        {isOrganizer && (
          <Dialog>
            <DialogTrigger
              render={
                <Button variant="outline" size="sm" className="gap-1.5 h-8 text-xs cursor-pointer">
                  <Plus className="h-3.5 w-3.5" />
                  Manage Media
                </Button>
              }
            />
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
        )}
      </div>

      {/* Main Split Flyer Card */}
      <div className="bg-card text-card-foreground rounded-2xl border border-border shadow-sm flex flex-col md:flex-row p-4 gap-6">
        {/* Left Column: Instagram Portrait Flyer/Poster */}
        <div className="relative aspect-square md:aspect-[4/5] w-full md:w-[35%] rounded-xl overflow-hidden bg-muted shrink-0 border border-border">
          {coverImage ? (
            <img
              src={coverImage}
              alt={event.title}
              className="w-full h-full object-cover select-none"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5 flex flex-col justify-between p-5 text-foreground select-none">
              <div className="flex items-center justify-between border-b border-border/40 pb-3">
                <span className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
                  {event.category || "Campus Event"}
                </span>
                <Calendar className="h-4 w-4 text-muted-foreground/50" />
              </div>
              <div className="my-auto space-y-1">
                <div className="text-5xl font-extrabold text-foreground leading-none">
                  {eventDay}
                </div>
                <div className="text-lg font-bold tracking-widest text-muted-foreground uppercase leading-none">
                  {eventMonth}
                </div>
              </div>
              <div className="border-t border-border/40 pt-3">
                <p className="text-[10px] text-muted-foreground/60 truncate font-semibold uppercase tracking-wider">{event.location}</p>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Details & Speaker Box */}
        <div className="flex-1 flex flex-col justify-between gap-5 min-w-0 py-1.5 px-1">
          {/* Header section */}
          <div className="space-y-4">
            <div className="flex items-center gap-1.5 flex-wrap">
              {past ? (
                <Badge variant="destructive" className="h-5 text-[10px] px-1.5 font-semibold rounded shrink-0">Past Event</Badge>
              ) : (
                <Badge variant="default" className="h-5 text-[10px] px-1.5 font-semibold rounded shrink-0">Upcoming</Badge>
              )}
              {event.category === "ALUMNI_SESSION" ? (
                <Badge variant="secondary" className="h-5 text-[10px] px-1.5 font-semibold bg-purple-500/10 text-purple-600 border border-purple-500/20 shrink-0">
                  <Sparkles className="h-3 w-3 mr-1" /> Alumni Session
                </Badge>
              ) : (
                <Badge variant="secondary" className="h-5 text-[10px] px-1.5 font-semibold rounded shrink-0">
                  {event.category || "General"}
                </Badge>
              )}
              {event.mode === "ONLINE" && (
                <Badge variant="outline" className="h-5 text-[10px] px-1.5 font-semibold rounded shrink-0">
                  <Video className="h-3 w-3 mr-1 text-blue-500" /> Online Webinar
                </Badge>
              )}
              {event.batchYear && (
                <Badge variant="outline" className="h-5 text-[10px] px-1.5 font-semibold rounded shrink-0">Batch {event.batchYear}</Badge>
              )}
            </div>

            <div className="space-y-1">
              <h1 className="text-2xl font-bold text-foreground leading-tight">
                {event.title}
              </h1>
              
              {event.createdByName && (
                <p className="text-xs text-muted-foreground">
                  Organized by <span className="font-semibold text-foreground">{event.createdByName}</span>
                  {isOrganizer && (
                    <span className="ml-1.5 inline-flex items-center px-1.5 py-0.5 rounded bg-primary/5 text-primary border border-primary/10 text-[9px] font-bold uppercase">You</span>
                  )}
                </p>
              )}
            </div>

            {/* Speaker Information Box */}
            {(event.speakerName || event.topicDomain || event.speakerDetails) && (
              <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/20 space-y-2">
                <div className="flex items-center gap-2 text-purple-600 font-bold text-xs uppercase tracking-wider">
                  <User className="h-4 w-4" /> Guest Speaker &amp; Session Info
                </div>
                {event.speakerName && (
                  <p className="text-sm font-semibold text-foreground">
                    {event.speakerName}
                  </p>
                )}
                {event.topicDomain && (
                  <p className="text-xs text-muted-foreground">
                    <span className="font-medium text-foreground">Domain / Topic:</span> {event.topicDomain}
                  </p>
                )}
                {event.speakerDetails && (
                  <p className="text-xs text-muted-foreground italic leading-relaxed pt-1 border-t border-purple-500/10">
                    &ldquo;{event.speakerDetails}&rdquo;
                  </p>
                )}
              </div>
            )}

            {/* Collaborating Clubs */}
            {event.collaboratingClubs && event.collaboratingClubs.length > 0 && (
              <div className="space-y-1.5 pt-1">
                <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5 text-primary" /> Collaborating Student Clubs
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {event.collaboratingClubs.map((club) => (
                    <Badge key={club.id} variant="secondary" className="text-xs font-medium px-2 py-0.5">
                      {club.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            <hr className="border-border" />
            
            {/* Standard details block */}
            <div className="flex flex-col gap-3.5 py-1">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-muted rounded-xl text-foreground shrink-0">
                  <Calendar className="h-4 w-4 text-primary" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/75 leading-none mb-1">Date & Time</span>
                  <span className="text-sm font-medium text-foreground">{formatEventDate(event.eventDate)}</span>
                </div>
              </div>

              {event.location && (
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-muted rounded-xl text-foreground shrink-0">
                    <MapPin className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/75 leading-none mb-1">Location / Platform</span>
                    <span className="text-sm font-medium text-foreground truncate" title={event.location}>{event.location}</span>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3">
                <div className="p-2 bg-muted rounded-xl text-foreground shrink-0">
                  <Users className="h-4 w-4 text-primary" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/75 leading-none mb-1">Access</span>
                  <span className="text-sm font-medium text-foreground">
                    {event.registrationRequired ? "Registration Required" : "Open Access (No Registration)"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer CTA Actions */}
          <div className="flex items-center gap-2 pt-3 border-t border-border mt-auto">
            {!past ? (
              event.registrationRequired && event.registrationLink ? (
                <a
                  href={event.registrationLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto"
                >
                  <Button className="w-full sm:w-auto cursor-pointer gap-1.5 text-xs h-8 px-4" size="sm">
                    Register for Event
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Button>
                </a>
              ) : (
                <p className="text-xs text-muted-foreground font-medium py-1">
                  ✨ Open admission. No prior registration required.
                </p>
              )
            ) : (
              <p className="text-xs text-muted-foreground font-medium py-1">This event has ended</p>
            )}
          </div>
        </div>
      </div>

      {/* Description & Media Carousel */}
      <div className="bg-card text-card-foreground rounded-2xl border border-border shadow-sm p-5 space-y-6">
        <div className="space-y-2">
          <h3 className="font-semibold text-foreground flex items-center gap-2 text-sm">
            <Tag className="h-4 w-4 text-primary" />
            About the Event
          </h3>
          <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
            {event.description || "No description provided."}
          </p>
        </div>

        {((event.photos?.length ?? 0) > 0 || (event.videos?.length ?? 0) > 0 || isOrganizer) && (
          <>
            <hr className="border-border" />
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground flex items-center gap-2 text-sm">
                <Camera className="h-4 w-4 text-primary" />
                Event Gallery &amp; Recordings
              </h3>
              
              <EventMediaCarousel
                eventId={event.id}
                photos={event.photos || []}
                videos={event.videos || []}
                isOrganizer={isOrganizer}
                onPhotosChanged={handleMediaChanged}
                onVideosChanged={handleMediaChanged}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
