"use client";

import Link from "next/link";
import { MapPin, Calendar } from "lucide-react";
import { Event } from "@/lib/types/events";
import { formatMonth, formatDay, formatEventDate } from "@/lib/utils/dateUtils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface EventListItemProps {
  event: Event;
}

export default function EventListItem({ event }: EventListItemProps) {
  return (
    <Card className="flex items-center gap-4 p-(--card-spacing)">
      <div className="bg-primary text-primary-foreground text-center px-3 py-2 rounded-lg w-14 shrink-0">
        <span className="block text-xs uppercase text-primary-foreground/60">{formatMonth(event.eventDate)}</span>
        <span className="block text-lg font-bold">{formatDay(event.eventDate)}</span>
      </div>
      <div className="flex-1 min-w-0 space-y-0.5">
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-foreground truncate">{event.title}</h3>
          {event.batchYear && <Badge variant="outline" className="shrink-0">{event.batchYear}</Badge>}
        </div>
        <p className="text-sm text-muted-foreground truncate flex items-center gap-1">
          <MapPin className="h-3 w-3 shrink-0" />
          {event.location}
          <span className="mx-1">&middot;</span>
          <Calendar className="h-3 w-3 shrink-0" />
          {formatEventDate(event.eventDate)}
        </p>
      </div>
      <Link href={`/events/${event.id}`} className="shrink-0">
        <Button variant="outline" size="sm">View</Button>
      </Link>
    </Card>
  );
}
