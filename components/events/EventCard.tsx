"use client";

// components/events/EventCard.tsx

import Image from "next/image";
import Link from "next/link";
import { Calendar, MapPin, Users, Star, ExternalLink } from "lucide-react";
import { Event } from "@/lib/types/events";
import { formatEventDate, formatMonth, formatDay } from "@/lib/utils/dateUtils";

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  const coverImage = event.photoUrls?.[0] ?? null;

  return (
    <div className="card overflow-hidden mb-5">
      <div className="grid lg:grid-cols-2">
        {/* Image side */}
        <div className="h-64 lg:h-auto relative bg-navy-100">
          {coverImage ? (
            <Image
              src={coverImage}
              alt={event.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-navy-800 to-navy-950 flex items-center justify-center">
              <Calendar className="h-16 w-16 text-navy-600" />
            </div>
          )}
          <span className="absolute top-4 left-4 bg-gold-500 text-navy-950 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1">
            <Star className="h-3 w-3" /> Featured
          </span>
        </div>

        {/* Content side */}
        <div className="p-8">
          {/* Date badge */}
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-navy-900 text-white text-center px-3 py-2 rounded-lg w-16 shrink-0">
              <span className="block text-xs font-normal text-gray-400 uppercase">
                {formatMonth(event.eventDate)}
              </span>
              <span className="block text-xl font-bold leading-tight">
                {formatDay(event.eventDate)}
              </span>
            </div>
            {event.batchYear && (
              <span className="badge bg-purple-100 text-purple-700">
                Batch {event.batchYear}
              </span>
            )}
          </div>

          <h2 className="font-serif text-2xl font-bold text-navy-900 mb-4 leading-snug">
            {event.title}
          </h2>

          <div className="space-y-2 mb-5">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <MapPin className="h-4 w-4 shrink-0" />
              <span>{event.location}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="h-4 w-4 shrink-0" />
              <span>{formatEventDate(event.eventDate)}</span>
            </div>
            {event.createdByName && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Users className="h-4 w-4 shrink-0" />
                <span>Organized by {event.createdByName}</span>
              </div>
            )}
          </div>

          <p className="text-gray-600 mb-6 leading-relaxed line-clamp-3">
            {event.description}
          </p>

          <div className="flex gap-3 flex-wrap">
            <Link href={`/events/${event.id}`}>
              <button className="btn-primary">View Details</button>
            </Link>
            {event.registrationRequired && event.registrationLink && (
              <a
                href={event.registrationLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold flex items-center gap-2"
              >
                RSVP Now <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
