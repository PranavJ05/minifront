"use client";

import Link from "next/link";
import { Calendar, ExternalLink } from "lucide-react";
import { Event } from "@/lib/types/events";
import { formatEventDate, formatMonth, formatDay } from "@/lib/utils/dateUtils";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, CardAction } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  const coverImage = event.photoUrls?.[0] ?? null;

  return (
    <Card className="overflow-hidden">
      {coverImage ? (
        <img src={coverImage} alt={event.title} className="aspect-video object-cover" />
      ) : (
        <div className="aspect-video flex items-center justify-center bg-muted">
          <Calendar className="h-8 w-8 text-muted-foreground/50" />
        </div>
      )}
      <CardHeader>
        <CardAction>
          <div className="flex items-center gap-1.5">
            <Badge variant="outline">
              {formatMonth(event.eventDate)} {formatDay(event.eventDate)}
            </Badge>
            {event.batchYear && <Badge variant="secondary">Batch {event.batchYear}</Badge>}
          </div>
        </CardAction>
        <CardTitle>{event.title}</CardTitle>
        <CardDescription>
          {formatEventDate(event.eventDate)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-2">{event.description}</p>
      </CardContent>
      <CardFooter>
        <div className="flex items-center gap-2">
          <Link href={`/events/${event.id}`}>
            <Button size="sm" variant="outline">Details</Button>
          </Link>
          {event.registrationRequired && event.registrationLink && (
            <a href={event.registrationLink} target="_blank" rel="noopener noreferrer">
              <Button size="sm">
                Register <ExternalLink className="h-3 w-3" />
              </Button>
            </a>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
