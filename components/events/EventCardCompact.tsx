"use client";

import Link from "next/link";
import { Calendar, MapPin, ExternalLink } from "lucide-react";
import { Event } from "@/lib/types/events";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, CardAction } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface EventCardCompactProps {
  event: Event;
}

export default function EventCardCompact({ event }: EventCardCompactProps) {
  const coverImage = event.photoUrls?.[0] ?? null;

  return (
    <Card className="overflow-hidden">
      {coverImage ? (
        <img
          src={coverImage}
          alt={event.title}
          className="aspect-video object-cover"
        />
      ) : (
        <div className="aspect-video flex items-center justify-center bg-gradient-to-br from-primary/70 to-primary" />
      )}
      <CardHeader>
        <CardAction>
          {event.batchYear && <Badge variant="secondary">Batch {event.batchYear}</Badge>}
        </CardAction>
        <CardTitle className="line-clamp-1">{event.title}</CardTitle>
        <CardDescription className="flex items-center gap-1">
          <MapPin className="h-3 w-3 shrink-0" />
          <span className="truncate">{event.location}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground line-clamp-2">{event.description}</p>
      </CardContent>
      <CardFooter className="gap-2">
        <Link href={`/events/${event.id}`}>
          <Button size="sm">View</Button>
        </Link>
        {event.registrationRequired && event.registrationLink && (
          <a href={event.registrationLink} target="_blank" rel="noopener noreferrer">
            <Button size="sm" variant="secondary">
              Register <ExternalLink className="h-3 w-3" />
            </Button>
          </a>
        )}
      </CardFooter>
    </Card>
  );
}
