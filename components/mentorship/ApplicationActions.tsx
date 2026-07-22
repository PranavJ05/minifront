"use client";

import type { MentorshipApplicationStatus } from "@/lib/types/mentorship";
import {
  useConfirmMatchMutation,
  useDeclineMatchMutation,
  useMarkCompleteMutation,
} from "@/hooks/queries/mentorships";
import { Button } from "@/components/ui/button";
import { Loader2, Check, X, CheckCheck, Star } from "lucide-react";
import { useState } from "react";

interface ApplicationActionsProps {
  applicationId: number;
  status: MentorshipApplicationStatus;
  onOpenFeedback?: () => void;
}

export function ApplicationActions({ applicationId, status, onOpenFeedback }: ApplicationActionsProps) {
  const confirmMutation = useConfirmMatchMutation();
  const declineMutation = useDeclineMatchMutation();
  const completeMutation = useMarkCompleteMutation();
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  async function handleConfirm() {
    setActionLoading("confirm");
    try {
      await confirmMutation.mutateAsync(applicationId);
    } catch {
      // handled
    } finally {
      setActionLoading(null);
    }
  }

  async function handleDecline() {
    if (!window.confirm("Decline this mentee?")) return;
    setActionLoading("decline");
    try {
      await declineMutation.mutateAsync(applicationId);
    } catch {
      // handled
    } finally {
      setActionLoading(null);
    }
  }

  async function handleComplete() {
    if (!window.confirm("Mark this mentorship as complete?")) return;
    setActionLoading("complete");
    try {
      await completeMutation.mutateAsync(applicationId);
    } catch {
      // handled
    } finally {
      setActionLoading(null);
    }
  }

  if (status === "FINAL_SELECTED") {
    return (
      <div className="flex gap-1.5">
        <Button
          size="xs"
          variant="default"
          onClick={handleConfirm}
          disabled={actionLoading !== null}
          className="cursor-pointer"
        >
          {actionLoading === "confirm" ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <Check className="h-3 w-3" />
          )}
          Confirm
        </Button>
        <Button
          size="xs"
          variant="destructive"
          onClick={handleDecline}
          disabled={actionLoading !== null}
          className="cursor-pointer"
        >
          {actionLoading === "decline" ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <X className="h-3 w-3" />
          )}
          Decline
        </Button>
      </div>
    );
  }

  if (status === "CONFIRMED") {
    return (
      <Button
        size="xs"
        variant="outline"
        onClick={handleComplete}
        disabled={actionLoading !== null}
        className="cursor-pointer"
      >
        {actionLoading === "complete" ? (
          <Loader2 className="h-3 w-3 animate-spin" />
        ) : (
          <CheckCheck className="h-3 w-3" />
        )}
        Mark Complete
      </Button>
    );
  }

  if (status === "COMPLETED" && onOpenFeedback) {
    return (
      <Button
        size="xs"
        variant="secondary"
        onClick={onOpenFeedback}
        className="cursor-pointer"
      >
        <Star className="h-3 w-3" />
        Feedback
      </Button>
    );
  }

  return null;
}
