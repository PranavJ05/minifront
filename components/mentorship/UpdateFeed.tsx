"use client";

import { useState } from "react";
import { useGetUpdatesQuery } from "@/hooks/queries/mentorships";
import { UpdateForm } from "./UpdateForm";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle, Star, Clock, ChevronDown, ChevronUp } from "lucide-react";

interface UpdateFeedProps {
  applicationId: number;
  isMentor: boolean;
  initiallyOpen?: boolean;
}

export function UpdateFeed({ applicationId, isMentor, initiallyOpen = false }: UpdateFeedProps) {
  const [isOpen, setIsOpen] = useState(initiallyOpen);
  const { data: updates, isLoading, isError } = useGetUpdatesQuery(applicationId);

  if (!isOpen) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="cursor-pointer text-xs"
      >
        <ChevronDown className="h-3.5 w-3.5" />
        View Updates {updates && updates.length > 0 && `(${updates.length})`}
      </Button>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-foreground">Progress Updates</h4>
        <Button
          variant="ghost"
          size="xs"
          onClick={() => setIsOpen(false)}
          className="cursor-pointer text-xs"
        >
          <ChevronUp className="h-3.5 w-3.5" />
          Hide
        </Button>
      </div>

      {isMentor && <UpdateForm applicationId={applicationId} />}

      {isLoading && (
        <div className="space-y-2">
          <Skeleton className="h-16 rounded-lg" />
          <Skeleton className="h-12 rounded-lg" />
        </div>
      )}

      {isError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Failed to load updates</AlertDescription>
        </Alert>
      )}

      {!isLoading && !isError && updates && updates.length === 0 && (
        <p className="text-xs text-muted-foreground py-2">No updates yet.</p>
      )}

      {!isLoading && !isError && updates && updates.length > 0 && (
        <div className="space-y-2 max-h-80 overflow-y-auto">
          {[...updates].reverse().map((update) => (
            <div
              key={update.id}
              className={`p-3 rounded-lg border ${
                update.isMilestone
                  ? "bg-muted/40 border-border"
                  : "bg-card border-border"
              }`}
            >
              <div className="flex items-start gap-2">
                {update.isMilestone && (
                  <Star className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground whitespace-pre-wrap">
                    {update.content}
                  </p>
                  <div className="flex items-center gap-1 mt-1.5 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {new Date(update.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                    {update.isMilestone && (
                      <span className="text-primary font-medium ml-1">• Milestone</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
