"use client";

import { useState } from "react";
import {
  Clock,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  FileText,
  MessageSquare,
  RefreshCw,
  Building2,
  CalendarDays,
  Inbox,
  User,
  ThumbsUp,
  ThumbsDown,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/contexts/auth-context";
import { useReceivedReferralsQuery } from "@/hooks/queries/referrals";
import type { ReferralRequest } from "@/hooks/queries/referrals";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/hooks/queries/keys";
import { BACKEND_URL } from "@/lib/config";
import { getErrorMessage } from "@/lib/get-error-message";

const STATUS_CONFIG = {
  PENDING: {
    label: "Pending",
    icon: Clock,
  },
  APPROVED: {
    label: "Approved",
    icon: CheckCircle2,
  },
  REJECTED: {
    label: "Rejected",
    icon: XCircle,
  },
};

function StatusBadge({ status }: { status: ReferralRequest["status"] }) {
  const cfg = STATUS_CONFIG[status];
  const Icon = cfg.icon;
  return (
    <Badge variant={status === "APPROVED" ? "default" : status === "REJECTED" ? "destructive" : "secondary"} className="text-[10px] gap-1">
      <Icon className="h-3 w-3" />
      {cfg.label}
    </Badge>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

interface RespondPanelProps {
  referralId: number;
  onResponded: (id: number, approved: boolean, message: string) => void;
}

function RespondPanel({ referralId, onResponded }: RespondPanelProps) {
  const { token } = useAuth();
  const [open, setOpen] = useState(false);
  const [action, setAction] = useState<"approve" | "reject" | null>(null);
  const [responseMessage, setResponseMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (action === null) return;
    setSubmitting(true);
    setError(null);

    try {
      if (!token) {
        setError("You must be logged in to respond.");
        setSubmitting(false);
        return;
      }

      const endpoint =
        action === "approve"
          ? `${BACKEND_URL}/api/referrals/${referralId}/approve`
          : `${BACKEND_URL}/api/referrals/${referralId}/reject`;

      const res = await fetch(endpoint, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: responseMessage }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Failed to ${action} referral.`);
      }

      onResponded(referralId, action === "approve", responseMessage);
      setOpen(false);
    } catch (err: unknown) {
      setError(getErrorMessage(err, `Failed to ${action} referral.`));
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) {
    return (
      <div className="flex items-center gap-2 pt-3 border-t border-border/40">
        <Button
          size="xs"
          onClick={() => {
            setAction("approve");
            setOpen(true);
          }}
          className="cursor-pointer"
        >
          <ThumbsUp className="h-3 w-3 mr-1" /> Approve Referral
        </Button>
        <Button
          variant="outline"
          size="xs"
          onClick={() => {
            setAction("reject");
            setOpen(true);
          }}
          className="cursor-pointer text-destructive hover:text-destructive"
        >
          <ThumbsDown className="h-3 w-3 mr-1" /> Decline Request
        </Button>
      </div>
    );
  }

  return (
    <div className="pt-3 border-t border-border/40 space-y-3">
      {error && (
        <Alert variant="destructive">
          <AlertDescription className="text-xs">{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-1.5">
        <label className="text-xs font-medium text-foreground">
          {action === "approve" ? "Approval Message (Optional)" : "Reason / Message (Optional)"}
        </label>
        <Textarea
          placeholder={
            action === "approve"
              ? "Add a note or next steps for the applicant..."
              : "Explain why you are unable to provide a referral..."
          }
          value={responseMessage}
          onChange={(e) => setResponseMessage(e.target.value)}
          className="text-xs min-h-[70px]"
        />
      </div>

      <div className="flex items-center gap-2">
        <Button
          size="xs"
          onClick={handleSubmit}
          disabled={submitting}
          className="cursor-pointer"
        >
          {submitting ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : action === "approve" ? (
            "Confirm Approval"
          ) : (
            "Confirm Decline"
          )}
        </Button>
        <Button
          variant="outline"
          size="xs"
          onClick={() => {
            setOpen(false);
            setAction(null);
            setError(null);
          }}
          disabled={submitting}
          className="cursor-pointer"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}

export default function ReceivedReferralsPage() {
  const {
    data: referrals = [],
    isLoading,
    error: queryError,
    refetch,
    isRefetching,
  } = useReceivedReferralsQuery();
  const [activeFilter, setActiveFilter] = useState<"ALL" | ReferralRequest["status"]>("ALL");

  const error = queryError ? (queryError instanceof Error ? queryError.message : "Failed to load referral requests.") : null;

  const queryClient = useQueryClient();

  const handleResponded = (id: number, approved: boolean, responseMsg: string) => {
    queryClient.setQueryData<ReferralRequest[]>(
      queryKeys.referrals.received(),
      (prev) =>
        prev?.map((r) =>
          r.id === id
            ? {
                ...r,
                status: approved ? "APPROVED" : "REJECTED",
                responseMessage: responseMsg,
                reviewedAt: new Date().toISOString(),
              }
            : r
        ) ?? []
    );
  };

  const filtered = activeFilter === "ALL"
    ? referrals
    : referrals.filter((r) => r.status === activeFilter);

  const counts = {
    ALL: referrals.length,
    PENDING: referrals.filter((r) => r.status === "PENDING").length,
    APPROVED: referrals.filter((r) => r.status === "APPROVED").length,
    REJECTED: referrals.filter((r) => r.status === "REJECTED").length,
  };

  return (
    <div className="w-full px-4 sm:px-6 pb-6 space-y-6">
      {/* Header */}
      <div className="sticky top-14 z-30 bg-background/95 backdrop-blur-md py-4 border-b border-border/40 -mx-4 sm:-mx-6 px-4 sm:px-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Link
              href="/opportunities"
              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors mb-1"
            >
              <ArrowLeft className="h-3 w-3" /> Back to Opportunities
            </Link>
            <h1 className="text-xl font-semibold tracking-tight text-foreground">
              Received Referral Requests
            </h1>
            <p className="text-xs text-muted-foreground">
              Review and respond to referral applications from students and alumni.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isRefetching}
            className="cursor-pointer"
          >
            <RefreshCw className={`h-4 w-4 mr-1.5 ${isRefetching ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {(["ALL", "PENDING", "APPROVED", "REJECTED"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setActiveFilter(s)}
            className={`rounded-xl p-3.5 text-left border transition-all cursor-pointer ${
              activeFilter === s
                ? "border-primary bg-primary/5 text-foreground"
                : "border-border bg-card hover:border-border/80 text-muted-foreground"
            } shadow-xs`}
          >
            <div className="text-xl font-bold text-foreground mb-0.5">{counts[s]}</div>
            <div className="text-xs font-medium capitalize">
              {s === "ALL" ? "Total" : s.charAt(0) + s.slice(1).toLowerCase()}
            </div>
          </button>
        ))}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-36 rounded-xl" />
          ))}
        </div>
      )}

      {/* Error */}
      {!isLoading && error && (
        <Alert variant="destructive">
          <AlertDescription className="text-xs">{error}</AlertDescription>
        </Alert>
      )}

      {/* Empty State */}
      {!isLoading && !error && filtered.length === 0 && (
        <Card className="rounded-xl border border-border bg-card">
          <CardContent className="flex flex-col items-center py-16 text-center">
            <Inbox className="h-8 w-8 text-muted-foreground/60 mb-3" />
            <p className="font-semibold text-foreground text-sm">
              {activeFilter === "ALL" ? "No referral requests received" : `No ${activeFilter.toLowerCase()} requests`}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              When members apply for referrals on your opportunity postings, they will appear here.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Referrals List */}
      {!isLoading && !error && filtered.length > 0 && (
        <div className="space-y-3">
          {filtered.map((referral) => (
            <Card key={referral.id} className="p-4 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Building2 className="h-3.5 w-3.5" />
                    <span>Opportunity #{referral.opportunityId}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-muted border border-border flex items-center justify-center">
                      <User className="h-3.5 w-3.5 text-muted-foreground" />
                    </div>
                    <span className="font-semibold text-xs text-foreground">
                      User #{referral.requesterUserId}
                    </span>
                  </div>
                </div>
                <StatusBadge status={referral.status} />
              </div>

              <div className="flex flex-wrap gap-4 text-xs text-muted-foreground pt-1">
                <span className="flex items-center gap-1">
                  <CalendarDays className="h-3.5 w-3.5" /> Requested: {formatDate(referral.requestedAt)}
                </span>
                {referral.reviewedAt && (
                  <span className="flex items-center gap-1">
                    <CalendarDays className="h-3.5 w-3.5" /> Reviewed: {formatDate(referral.reviewedAt)}
                  </span>
                )}
                {referral.resumeLink && (
                  <a
                    href={referral.resumeLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-primary hover:underline font-medium"
                  >
                    <FileText className="h-3.5 w-3.5" /> View Resume
                  </a>
                )}
              </div>

              {referral.message && (
                <div className="p-3 bg-muted/40 rounded-lg text-xs space-y-1 border border-border/40">
                  <span className="text-[10px] font-semibold text-muted-foreground flex items-center gap-1">
                    <MessageSquare className="h-3 w-3" /> Requester Message
                  </span>
                  <p className="text-foreground leading-relaxed">{referral.message}</p>
                </div>
              )}

              {referral.responseMessage && (
                <div className="p-3 bg-muted/20 rounded-lg text-xs space-y-1 border border-border/40">
                  <span className="text-[10px] font-semibold text-muted-foreground flex items-center gap-1">
                    <MessageSquare className="h-3 w-3" /> Your Response
                  </span>
                  <p className="text-foreground leading-relaxed">{referral.responseMessage}</p>
                </div>
              )}

              {referral.status === "PENDING" && (
                <RespondPanel referralId={referral.id} onResponded={handleResponded} />
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
