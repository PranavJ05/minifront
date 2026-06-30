"use client";

import { useEffect, useState } from "react";
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
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ReferralRequest {
  id: number;
  opportunityId: number;
  requesterUserId: number;
  referrerUserId: number;
  message: string | null;
  resumeLink: string | null;
  status: "PENDING" | "APPROVED" | "REJECTED";
  responseMessage: string | null;
  requestedAt: string;
  reviewedAt: string | null;
}

function getToken(): string | null {
  try {
    return localStorage.getItem("token");
  } catch {
    return null;
  }
}

const STATUS_CONFIG = {
  PENDING: {
    label: "Pending",
    icon: Clock,
    color: "bg-amber-500/10 text-amber-600",
    border: "border-l-amber-500",
  },
  APPROVED: {
    label: "Approved",
    icon: CheckCircle2,
    color: "bg-green-500/10 text-green-600",
    border: "border-l-green-500",
  },
  REJECTED: {
    label: "Rejected",
    icon: XCircle,
    color: "bg-red-500/10 text-red-600",
    border: "border-l-red-500",
  },
};

function StatusBadge({ status }: { status: ReferralRequest["status"] }) {
  const cfg = STATUS_CONFIG[status];
  const Icon = cfg.icon;
  return (
    <Badge variant="secondary" className={`text-[10px] font-semibold gap-1 ${cfg.color}`}>
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

export default function MyReferralsPage() {
  const [referrals, setReferrals] = useState<ReferralRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<"ALL" | ReferralRequest["status"]>("ALL");
  const [refreshing, setRefreshing] = useState(false);

  const fetchReferrals = async (showRefreshing = false) => {
    if (showRefreshing) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const headers: Record<string, string> = {};
      const token = getToken();
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      const res = await fetch("http://localhost:8080/referrals/mine", { headers });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const data: ReferralRequest[] = await res.json();
      setReferrals(data);
    } catch (err: any) {
      setError(err.message || "Failed to load referrals.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchReferrals();
  }, []);

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
              <ArrowLeft className="h-3 w-3" />
              Back to Opportunities
            </Link>
            <h1 className="text-xl font-semibold tracking-tight text-foreground">
              My Referral Requests
            </h1>
            <p className="text-xs text-muted-foreground">
              Track the status of all referrals you've requested
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchReferrals(true)}
            disabled={refreshing}
            className="cursor-pointer"
          >
            <RefreshCw className={`h-4 w-4 mr-1.5 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {(["ALL", "PENDING", "APPROVED", "REJECTED"] as const).map((s) => {
          const cfg = s === "ALL" ? null : STATUS_CONFIG[s];
          return (
            <button
              key={s}
              onClick={() => setActiveFilter(s)}
              className={`rounded-xl p-4 text-left border transition-all cursor-pointer ${
                activeFilter === s
                  ? s === "ALL"
                    ? "border-primary bg-primary/5"
                    : `border-border ${cfg!.color}`
                  : "border-border bg-card hover:border-border/80"
              } shadow-sm`}
            >
              <p className={`text-2xl font-bold mb-0.5 ${
                s !== "ALL" && activeFilter === s ? cfg!.color.split(" ")[1] : "text-foreground"
              }`}>
                {counts[s]}
              </p>
              <p className="text-xs text-muted-foreground font-medium capitalize">
                {s === "ALL" ? "Total" : s.charAt(0) + s.slice(1).toLowerCase()}
              </p>
            </button>
          );
        })}
      </div>

      {/* Loading */}
      {loading && (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-40 rounded-xl" />
          ))}
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
          <Button onClick={() => fetchReferrals()} variant="outline" size="sm" className="mt-3 cursor-pointer">
            Retry
          </Button>
        </Alert>
      )}

      {/* Empty */}
      {!loading && !error && filtered.length === 0 && (
        <Card className="rounded-xl border border-border bg-card">
          <CardContent className="flex flex-col items-center py-16 text-center">
            <Inbox className="h-8 w-8 text-muted-foreground/60 mb-3" />
            <p className="font-semibold text-foreground text-sm">No referrals yet</p>
            <p className="text-xs text-muted-foreground mt-1">
              {activeFilter === "ALL"
                ? "Head to Opportunities and request a referral from an alumni."
                : `You have no ${activeFilter.toLowerCase()} referral requests.`}
            </p>
            <Link href="/opportunities">
              <Button variant="outline" size="sm" className="mt-4 cursor-pointer">
                Browse Opportunities
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Referrals List */}
      {!loading && !error && filtered.length > 0 && (
        <div className="space-y-3">
          {filtered.map((referral) => {
            const cfg = STATUS_CONFIG[referral.status];
            return (
              <div
                key={referral.id}
                className={`bg-card text-card-foreground rounded-2xl border border-border border-l-4 ${cfg.border} shadow-sm p-5`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-[10px] text-muted-foreground">
                        Opportunity #{referral.opportunityId}
                      </span>
                    </div>
                    <p className="font-semibold text-sm text-foreground">
                      Referral Request #{referral.id}
                    </p>
                  </div>
                  <StatusBadge status={referral.status} />
                </div>

                <div className="grid sm:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <CalendarDays className="h-3.5 w-3.5 shrink-0" />
                      <span>
                        <span className="font-medium text-foreground">Requested:</span>{" "}
                        {formatDate(referral.requestedAt)}
                      </span>
                    </div>
                    {referral.reviewedAt && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <CalendarDays className="h-3.5 w-3.5 shrink-0" />
                        <span>
                          <span className="font-medium text-foreground">Reviewed:</span>{" "}
                          {formatDate(referral.reviewedAt)}
                        </span>
                      </div>
                    )}
                  </div>

                  {referral.resumeLink && (
                    <div className="flex items-start gap-2 text-muted-foreground">
                      <FileText className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                      <a
                        href={referral.resumeLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline truncate"
                      >
                        View Resume
                      </a>
                    </div>
                  )}
                </div>

                {referral.message && (
                  <div className="mt-4 p-3 bg-muted/50 rounded-xl text-xs text-muted-foreground border border-border/50">
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1 flex items-center gap-1">
                      <MessageSquare className="h-3 w-3" /> Your Message
                    </p>
                    <p>{referral.message}</p>
                  </div>
                )}

                {referral.responseMessage && (
                  <div className={`mt-3 p-3 rounded-xl text-xs border ${cfg.color}`}>
                    <p className="text-[10px] font-semibold uppercase tracking-wide mb-1 flex items-center gap-1">
                      <MessageSquare className="h-3 w-3" /> Referrer's Response
                    </p>
                    <p>{referral.responseMessage}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
