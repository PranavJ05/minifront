"use client";

import Link from "next/link";
import { Calendar, Clock, ExternalLink, Tag, User, Video, Building2, Sparkles } from "lucide-react";
import { Event } from "@/lib/types/events";
import { formatEventDate, formatMonth, formatDay } from "@/lib/utils/dateUtils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  const coverImage = event.photoUrls?.[0] ?? null;

  return (
    <div className="bg-card text-card-foreground rounded-2xl border border-border shadow-sm hover:shadow-md transition-all duration-200 flex flex-col p-3 gap-3">
      {/* Cover Image */}
      <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-muted shrink-0">
        {coverImage ? (
          <img
            src={coverImage}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-primary/5 text-primary">
            <Calendar className="h-8 w-8 text-primary/40" />
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
              {event.category || "General Event"}
            </span>
          </div>
        )}

        {/* Category & Mode Badges */}
        <div className="absolute top-2 left-2 flex items-center gap-1 flex-wrap">
          {event.category === "ALUMNI_SESSION" ? (
            <Badge variant="secondary" className="text-[10px] font-semibold bg-purple-500/10 text-purple-600 border border-purple-500/20 backdrop-blur-xs">
              <Sparkles className="h-3 w-3 mr-1" /> Alumni Session
            </Badge>
          ) : (
            <Badge variant="secondary" className="text-[10px] font-semibold backdrop-blur-xs">
              {event.category || "General"}
            </Badge>
          )}

          {event.mode === "ONLINE" && (
            <Badge variant="outline" className="text-[10px] font-medium bg-background/80 backdrop-blur-xs">
              <Video className="h-3 w-3 mr-1 text-blue-500" /> Online
            </Badge>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-3 flex-1 px-1">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-sm leading-snug text-foreground line-clamp-1">
              {event.title}
            </h3>
            {event.batchYear && (
              <span className="text-[10px] font-medium text-muted-foreground border border-border rounded px-1.5 py-0.5 shrink-0">
                Class of {event.batchYear}
              </span>
            )}
          </div>
          {event.description && (
            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2 leading-relaxed">
              {event.description}
            </p>
          )}
        </div>

        {/* Speaker or Domain */}
        {event.speakerName && (
          <div className="flex items-center gap-1.5 text-xs text-foreground font-medium bg-muted/40 p-2 rounded-lg border border-border/50">
            <User className="h-3.5 w-3.5 text-primary shrink-0" />
            <span className="truncate">Speaker: {event.speakerName}</span>
          </div>
        )}

        {/* Collaborating Clubs */}
        {event.collaboratingClubs && event.collaboratingClubs.length > 0 && (
          <div className="flex items-center gap-1 flex-wrap pt-0.5">
            <span className="text-[10px] text-muted-foreground mr-1 flex items-center gap-0.5">
              <Building2 className="h-3 w-3 text-primary" /> Clubs:
            </span>
            {event.collaboratingClubs.map((club) => (
              <Badge key={club.id} variant="secondary" className="text-[9px] font-medium px-1.5 py-0">
                {club.name}
              </Badge>
            ))}
          </div>
        )}

        {/* Meta info */}
        <div className="flex flex-col gap-1.5 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-3.5 w-3.5 shrink-0 text-primary" />
            <span>{formatEventDate(event.eventDate)}</span>
          </div>
          {event.location && (
            <div className="flex items-center gap-2 truncate">
              <Clock className="h-3.5 w-3.5 shrink-0 text-primary" />
              <span className="truncate">{event.location}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-3 border-t border-border mt-auto">
          <Link href={`/events/${event.id}`} className="flex-1">
            <Button variant="outline" size="xs" className="w-full cursor-pointer">
              Details
            </Button>
          </Link>
          {event.registrationRequired && event.registrationLink && (
            <a
              href={event.registrationLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1"
            >
              <Button size="xs" className="w-full cursor-pointer gap-1.5">
                Register <ExternalLink className="h-3 w-3" />
              </Button>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
