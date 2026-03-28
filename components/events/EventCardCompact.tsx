"use client";

// components/events/EventCardCompact.tsx

import Image from "next/image";
import Link from "next/link";
import { MapPin, ExternalLink, Wifi } from "lucide-react";
import { Event } from "@/lib/types/events";
import { formatMonth, formatDay, formatEventDate } from "@/lib/utils/dateUtils";

interface EventCardCompactProps {
  event: Event;
}

const isOnline = (location: string) =>
  /online|virtual|zoom|meet|teams/i.test(location);

export default function EventCardCompact({ event }: EventCardCompactProps) {
  const coverImage = event.photoUrls?.[0] ?? null;
  const online = isOnline(event.location);

  return (
    <div className="card overflow-hidden group hover:-translate-y-1 transition-all duration-300">
      {/* Cover image */}
      <div className="h-44 relative bg-navy-100">
        {coverImage ? (
          <Image
            src={coverImage}
            alt={event.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-navy-700 to-navy-950" />
        )}
        {online && (
          <span className="absolute top-3 right-3 badge bg-blue-100 text-blue-700 flex items-center gap-1">
            <Wifi className="h-3 w-3" /> Online
          </span>
        )}
      </div>

      <div className="p-5">
        {/* Date + batch */}
        <div className="flex items-center gap-2 mb-3">
          <div className="bg-navy-900 text-white text-center px-2 py-1 rounded-lg shrink-0">
            <span className="block text-xs font-normal text-gray-400 uppercase leading-none">
              {formatMonth(event.eventDate)}
            </span>
            <span className="block text-sm font-bold leading-tight">
              {formatDay(event.eventDate)}
            </span>
          </div>
          {event.batchYear && (
            <span className="badge bg-green-100 text-green-700 text-xs">
              Batch {event.batchYear}
            </span>
          )}
        </div>

        <h3 className="font-bold text-navy-900 text-base mb-2 leading-snug line-clamp-2 group-hover:text-navy-700 transition-colors">
          {event.title}
        </h3>

        <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-4">
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">{event.location}</span>
        </div>

        <p className="text-gray-500 text-sm mb-4 line-clamp-2">
          {event.description}
        </p>

        <div className="flex items-center justify-between mt-auto">
          <Link href={`/events/${event.id}`}>
            <button className="btn-outline text-xs py-2 px-4">View →</button>
          </Link>
          {event.registrationRequired && event.registrationLink && (
            <a
              href={event.registrationLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-xs py-2 px-4 flex items-center gap-1"
            >
              Register <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
