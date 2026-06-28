"use client";

import Link from "next/link";
import { Calendar, ExternalLink } from "lucide-react";
import { Event } from "@/lib/types/events";
import { formatEventDate, formatMonth, formatDay } from "@/lib/utils/dateUtils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  const coverImage = event.photoUrls?.[0] ?? null;

  return (
    <div className="relative flex flex-col overflow-hidden rounded-lg border border-border bg-card text-card-foreground shadow-xs hover:shadow-md hover:border-muted-foreground/30 transition-all duration-300 h-[380px] group">
      {/* Top Image Banner */}
      <div className="relative w-full h-[180px] shrink-0 overflow-hidden bg-muted">
        {coverImage ? (
          <img
            src={coverImage}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground/30">
            <Calendar className="h-8 w-8" />
          </div>
        )}
        {/* Blending Gradient Overlay: limited to the bottom 50% for reduced spread */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-card via-card/40 to-transparent pointer-events-none" />
      </div>

      {/* Content Area */}
      <div className="flex-1 flex flex-col justify-between p-4 bg-card relative z-10">
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 flex-wrap">
            <Badge variant="secondary" className="text-[10px] font-semibold tracking-wider">
              {formatMonth(event.eventDate)} {formatDay(event.eventDate)}
            </Badge>
            {event.batchYear && (
              <Badge variant="outline" className="text-[10px] font-semibold">
                Batch {event.batchYear}
              </Badge>
            )}
          </div>
          <h3 className="font-semibold text-sm leading-tight text-foreground line-clamp-1">
            {event.title}
          </h3>
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {event.description || "No description available."}
          </p>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col gap-2 pt-3 border-t border-border mt-auto">
          <div className="text-[10px] text-muted-foreground font-medium pl-0.5">
            {formatEventDate(event.eventDate)}
          </div>
          <div className="flex items-center gap-2">
            <Link href={`/events/${event.id}`} className="flex-1">
              <Button size="xs" variant="outline" className="w-full cursor-pointer">Details</Button>
            </Link>
            {event.registrationRequired && event.registrationLink && (
              <a href={event.registrationLink} target="_blank" rel="noopener noreferrer" className="flex-1">
                <Button size="xs" className="w-full cursor-pointer flex items-center justify-center gap-1">
                  Register <ExternalLink className="h-3 w-3" />
                </Button>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
