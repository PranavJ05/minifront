"use client";

// components/events/EventListItem.tsx

import Link from "next/link";
import { Wifi } from "lucide-react";
import { Event } from "@/lib/types/events";
import { formatMonth, formatDay, formatEventDate } from "@/lib/utils/dateUtils";

interface EventListItemProps {
  event: Event;
}

const isOnline = (location: string) =>
  /online|virtual|zoom|meet|teams/i.test(location);

export default function EventListItem({ event }: EventListItemProps) {
  const online = isOnline(event.location);

  return (
    <div className="card p-5 flex items-center gap-5 hover:-translate-y-0.5 transition-transform duration-200">
      {/* Date badge */}
      <div className="bg-navy-900 text-white text-center px-3 py-2 rounded-lg shrink-0 w-14">
        <span className="block text-xs text-gray-400 uppercase leading-none">
          {formatMonth(event.eventDate)}
        </span>
        <span className="text-lg font-bold leading-tight">
          {formatDay(event.eventDate)}
        </span>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
          {online && <Wifi className="h-3.5 w-3.5 text-blue-500 shrink-0" />}
          <h3 className="font-bold text-navy-900 truncate">{event.title}</h3>
          {event.batchYear && (
            <span className="badge bg-gray-100 text-gray-500 text-xs shrink-0">
              {event.batchYear}
            </span>
          )}
        </div>
        <p className="text-sm text-gray-500 truncate">
          {event.location} · {formatEventDate(event.eventDate)}
        </p>
      </div>

      {/* Action */}
      <Link href={`/events/${event.id}`} className="shrink-0">
        <button className="btn-outline text-sm py-2 px-4">View →</button>
      </Link>
    </div>
  );
}
