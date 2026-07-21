"use client";

import Link from "next/link";
import { MapPin, Users, Calendar, Video, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlumniSession } from "@/lib/types/alumniSession";

interface Props {
  session: AlumniSession;
}

export default function SessionCard({ session }: Props) {
  const isOpen = session.status === "OPEN";

  return (
    <Card className="p-4 flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow">
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1">
            <Badge variant="secondary" className="text-[10px]">
              {session.topicDomain || "Alumni Session"}
            </Badge>
            <h2 className="font-semibold text-sm leading-snug text-foreground">
              {session.title}
            </h2>
          </div>

          <Badge variant={isOpen ? "default" : "secondary"} className="text-[10px] shrink-0">
            {session.status}
          </Badge>
        </div>

        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
          {session.description}
        </p>

        <div className="space-y-1 text-xs text-muted-foreground/80 pt-1">
          {session.venue && (
            <div className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60" />
              <span className="truncate">{session.venue}</span>
            </div>
          )}
          <div className="flex items-center gap-4">
            {session.mode && (
              <div className="flex items-center gap-1.5">
                <Video className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60" />
                <span>{session.mode}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60" />
              <span>
                {session.registrationCount} / {session.maxParticipants} Registered
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 pt-2 border-t border-border/40">
        <Button variant="outline" size="xs" asChild className="flex-1 cursor-pointer">
          <Link href={`/alumni-sessions/${session.id}`}>
            View Details <ArrowRight className="h-3 w-3 ml-1" />
          </Link>
        </Button>

        {session.mediaAvailable && (
          <Button variant="secondary" size="xs" asChild className="cursor-pointer">
            <Link href={`/alumni-sessions/${session.id}/media`}>
              Media
            </Link>
          </Button>
        )}
      </div>
    </Card>
  );
}