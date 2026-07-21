"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Video, Loader2, AlertCircle } from "lucide-react";
import SessionCard from "@/components/alumni-sessions/SessionCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlumniSession } from "@/lib/types/alumniSession";
import { fetchAllSessions } from "@/lib/api/alumniSessions";
import { useAuth } from "@/contexts/auth-context";
import { isAlumni } from "@/lib/roleUtils";
import { getErrorMessage } from "@/lib/get-error-message";

export default function AlumniSessionsPage() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<AlumniSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchAllSessions();
        setSessions(data || []);
      } catch (err: unknown) {
        setError(getErrorMessage(err, "Failed to load sessions"));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const isAlumniUser = isAlumni(user?.roles);

  return (
    <div className="w-full px-4 sm:px-6 pb-6 space-y-6">
      {/* Sticky Header */}
      <div className="sticky top-14 z-30 bg-background/95 backdrop-blur-md py-4 border-b border-border/40 -mx-4 sm:-mx-6 px-4 sm:px-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h1 className="text-xl font-semibold tracking-tight text-foreground">
              Alumni Sessions
            </h1>
            <p className="text-xs text-muted-foreground">
              Browse, register, and watch recorded sessions from our alumni community.
            </p>
          </div>
          {isAlumniUser && (
            <Button size="sm" asChild className="cursor-pointer">
              <Link href="/alumni-sessions/create">
                <Plus className="h-4 w-4 mr-1" /> Create Session
              </Link>
            </Button>
          )}
        </div>
      </div>

      {/* Main Sessions Grid / States */}
      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="h-48 animate-pulse bg-muted/40" />
          ))}
        </div>
      ) : error ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-xs">{error}</AlertDescription>
        </Alert>
      ) : sessions.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center py-16 text-center gap-2">
            <Video className="h-8 w-8 text-muted-foreground/60 mb-1" />
            <p className="text-sm font-semibold text-foreground">No sessions found</p>
            <p className="text-xs text-muted-foreground">
              Check back soon for upcoming sessions hosted by alumni.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sessions.map((session) => (
            <SessionCard key={session.id} session={session} />
          ))}
        </div>
      )}
    </div>
  );
}
