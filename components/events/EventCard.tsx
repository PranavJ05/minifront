"use client";
import Link from "next/link";
import { Calendar, Clock, ExternalLink, Tag } from "lucide-react";
import { Event } from "@/lib/types/events";
import { formatEventDate, formatMonth, formatDay } from "@/lib/utils/dateUtils";
import { Button } from "@/components/ui/button";

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  const coverImage = event.photoUrls?.[0] ?? null;

  return (
    <div className="bg-card text-card-foreground rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col p-3 gap-3">

      {/* Image — padded, own rounded corners */}
      <div className="relative w-full h-[180px] rounded-xl overflow-hidden bg-muted shrink-0">
        {coverImage ? (
          <img
            src={coverImage}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Calendar className="h-8 w-8 text-muted-foreground/30" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col gap-3 flex-1 px-1">

        {/* Title + batch */}
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-sm leading-snug text-foreground line-clamp-1">
              {event.title}
            </h3>
            {event.batchYear && (
              <span className="text-[10px] font-medium text-muted-foreground border border-border rounded px-1.5 py-0.5 shrink-0">
                {event.batchYear}
              </span>
            )}
          </div>
          {event.description && (
            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
              {event.description}
            </p>
          )}
        </div>

        {/* Meta rows */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="h-3.5 w-3.5 shrink-0" />
            <span>{formatEventDate(event.eventDate)}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-3.5 w-3.5 shrink-0" />
            <span>{formatMonth(event.eventDate)} {formatDay(event.eventDate)}</span>
          </div>
          {event.batchYear && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Tag className="h-3.5 w-3.5 shrink-0" />
              <span>Batch {event.batchYear}</span>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2 pt-3 border-t border-border mt-auto">
          <Link href={`/events/${event.id}`} className="flex-1">
            <Button variant="outline" className="w-full cursor-pointer">
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
              <Button className="w-full cursor-pointer gap-1.5">
                Register
                <ExternalLink className="h-3 w-3" />
              </Button>
            </a>
          )}
        </div>

      </div>
    </div>
  );
}
