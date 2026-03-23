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
  User,
  ThumbsUp,
  ThumbsDown,
  Loader2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

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

/**
 * Read the JWT token from localStorage at runtime.
 * Keeps secrets out of source and allows the signed-in user's token to be used.
 * Adjust the key if your app stores the token under a different name.
 */
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
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
  },
  APPROVED: {
    label: "Approved",
    icon: CheckCircle2,
    bg: "bg-green-50",
    text: "text-green-700",
    border: "border-green-200",
  },
  REJECTED: {
    label: "Rejected",
    icon: XCircle,
    bg: "bg-red-50",
    text: "text-red-600",
    border: "border-red-200",
  },
};

function StatusBadge({ status }: { status: ReferralRequest["status"] }) {
  const cfg = STATUS_CONFIG[status];
  const Icon = cfg.icon;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${cfg.bg} ${cfg.text} ${cfg.border}`}
    >
      <Icon className="h-3 w-3" />
      {cfg.label}
    </span>
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
      // Read token from localStorage for authenticated actions
      let tokenFromStorage: string | null = null;
      try {
        tokenFromStorage = localStorage.getItem("token");
      } catch {
        tokenFromStorage = null;
      }

      if (!tokenFromStorage) {
        setError(
          "Authentication required. Please sign in to respond to requests.",
        );
        setSubmitting(false);
        return;
      }

      const res = await fetch(
        `http://localhost:8080/referrals/respond/${referralId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenFromStorage}`,
          },
          body: JSON.stringify({
            approved: action === "approve",
            responseMessage: responseMessage.trim() || undefined,
          }),
        },
      );

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.message || `Error ${res.status}`);
      }

      onResponded(referralId, action === "approve", responseMessage);
    } catch (err: any) {
      setError(err.message || "Failed to submit response.");
      setSubmitting(false);
    }
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="mt-4 flex items-center gap-1.5 text-sm text-navy-600 font-medium hover:text-navy-800 transition-colors"
      >
        Respond to Request <ChevronDown className="h-4 w-4" />
      </button>
    );
  }

  return (
    <div className="mt-4 border-t border-gray-100 pt-4 space-y-4">
      {/* Action toggle */}
      <div className="flex gap-3">
        <button
          onClick={() => setAction("approve")}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all ${
            action === "approve"
              ? "bg-green-600 border-green-600 text-white"
              : "border-gray-200 text-gray-600 hover:border-green-400 hover:text-green-600"
          }`}
        >
          <ThumbsUp className="h-4 w-4" />
          Approve
        </button>
        <button
          onClick={() => setAction("reject")}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all ${
            action === "reject"
              ? "bg-red-500 border-red-500 text-white"
              : "border-gray-200 text-gray-600 hover:border-red-400 hover:text-red-500"
          }`}
        >
          <ThumbsDown className="h-4 w-4" />
          Reject
        </button>
      </div>

      {/* Response Message */}
      <div>
        <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
          Response Message{" "}
          <span className="normal-case font-normal">(optional)</span>
        </label>
        <textarea
          value={responseMessage}
          onChange={(e) => setResponseMessage(e.target.value)}
          rows={2}
          placeholder={
            action === "approve"
              ? "I've submitted your referral! Best of luck..."
              : "I'm unable to provide a referral at this time..."
          }
          className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-navy-400 focus:border-transparent resize-none transition-all"
          disabled={submitting}
        />
      </div>

      {error && (
        <p className="text-red-500 text-xs flex items-center gap-1">
          <XCircle className="h-3.5 w-3.5" /> {error}
        </p>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={handleSubmit}
          disabled={!action || submitting}
          className="btn-primary flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Submitting…
            </>
          ) : (
            "Confirm"
          )}
        </button>
        <button
          onClick={() => {
            setOpen(false);
            setAction(null);
            setResponseMessage("");
            setError(null);
          }}
          className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors"
          disabled={submitting}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default function ReceivedReferralsPage() {
  const [referrals, setReferrals] = useState<ReferralRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<
    "ALL" | ReferralRequest["status"]
  >("ALL");
  const [refreshing, setRefreshing] = useState(false);

  const fetchReferrals = async (showRefreshing = false) => {
    if (showRefreshing) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      // Build headers dynamically from localStorage token when available.
      const headers: Record<string, string> = {};
      const token = getToken();
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      console.log(`Auth Bearer: ${headers.Authorization}`);
      const res = await fetch("http://localhost:8080/referrals/received", {
        headers,
      });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const data: ReferralRequest[] = await res.json();
      console.log(`Fetched ${data.length} referral requests`);
      if (data.length > 0) {
        console.log(`First referral:`, data[0]);
      } else {
        console.log(`No referrals found`);
      }
      setReferrals(data);
    } catch (err: any) {
      setError(err.message || "Failed to load referral requests.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchReferrals();
  }, []);

  const handleResponded = (
    id: number,
    approved: boolean,
    responseMsg: string,
  ) => {
    setReferrals((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status: approved ? "APPROVED" : "REJECTED",
              responseMessage: responseMsg,
              reviewedAt: new Date().toISOString(),
            }
          : r,
      ),
    );
  };

  const filtered =
    activeFilter === "ALL"
      ? referrals
      : referrals.filter((r) => r.status === activeFilter);

  const counts = {
    ALL: referrals.length,
    PENDING: referrals.filter((r) => r.status === "PENDING").length,
    APPROVED: referrals.filter((r) => r.status === "APPROVED").length,
    REJECTED: referrals.filter((r) => r.status === "REJECTED").length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Page Header */}
      <div className="bg-navy-950 py-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/opportunities"
            className="inline-flex items-center gap-1.5 text-navy-400 hover:text-white text-sm mb-4 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Opportunities
          </Link>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h1 className="font-serif text-3xl font-bold text-white mb-1">
                Referral Requests
              </h1>
              <p className="text-navy-400 text-sm">
                Review and respond to referral requests from fellow alumni and
                students
              </p>
            </div>
            <button
              onClick={() => fetchReferrals(true)}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-navy-800 hover:bg-navy-700 text-white text-sm font-medium transition-colors disabled:opacity-60"
            >
              <RefreshCw
                className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
              />
              Refresh
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {(["ALL", "PENDING", "APPROVED", "REJECTED"] as const).map((s) => {
            const cfg = s === "ALL" ? null : STATUS_CONFIG[s];
            return (
              <button
                key={s}
                onClick={() => setActiveFilter(s)}
                className={`rounded-xl p-4 text-left border-2 transition-all shadow-sm ${
                  activeFilter === s
                    ? s === "ALL"
                      ? "border-navy-700 bg-navy-50"
                      : `${cfg!.border} ${cfg!.bg}`
                    : "border-transparent bg-white hover:border-gray-200"
                }`}
              >
                <p
                  className={`text-2xl font-bold mb-0.5 ${
                    s !== "ALL" && activeFilter === s
                      ? cfg!.text
                      : "text-navy-900"
                  }`}
                >
                  {counts[s]}
                </p>
                <p className="text-xs text-gray-500 font-medium">
                  {s === "ALL"
                    ? "Total"
                    : s.charAt(0) + s.slice(1).toLowerCase()}
                </p>
              </button>
            );
          })}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-4 border-navy-200 border-t-navy-700 rounded-full animate-spin" />
              <p className="text-gray-400 text-sm">
                Loading referral requests…
              </p>
            </div>
          </div>
        ) : error ? (
          <div className="rounded-2xl bg-red-50 border border-red-200 p-8 text-center">
            <XCircle className="h-10 w-10 text-red-400 mx-auto mb-3" />
            <p className="text-red-700 font-medium">{error}</p>
            <button
              onClick={() => fetchReferrals()}
              className="mt-4 btn-primary px-6"
            >
              Retry
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
            <div className="w-16 h-16 rounded-2xl bg-navy-50 flex items-center justify-center">
              <Inbox className="h-8 w-8 text-navy-300" />
            </div>
            <div>
              <p className="text-navy-900 font-semibold text-lg">
                {activeFilter === "ALL"
                  ? "No referral requests yet"
                  : `No ${activeFilter.toLowerCase()} requests`}
              </p>
              <p className="text-gray-400 text-sm mt-1">
                {activeFilter === "ALL"
                  ? "When someone requests a referral through your posted opportunities, they'll appear here."
                  : `You have no ${activeFilter.toLowerCase()} referral requests.`}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((referral) => {
              const cfg = STATUS_CONFIG[referral.status];
              return (
                <div
                  key={referral.id}
                  className={`bg-white rounded-2xl border-l-4 ${cfg.border} shadow-sm overflow-hidden`}
                >
                  <div className="p-5 sm:p-6">
                    <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Building2 className="h-4 w-4 text-gray-400" />
                          <span className="text-xs text-gray-400">
                            Opportunity #{referral.opportunityId}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-navy-100 flex items-center justify-center">
                            <User className="h-4 w-4 text-navy-500" />
                          </div>
                          <div>
                            <p className="text-navy-900 font-semibold text-sm leading-tight">
                              User #{referral.requesterUserId}
                            </p>
                            <p className="text-gray-400 text-xs">
                              Requesting a referral
                            </p>
                          </div>
                        </div>
                      </div>
                      <StatusBadge status={referral.status} />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-3 text-sm mb-3">
                      <div className="flex items-center gap-2 text-gray-500">
                        <CalendarDays className="h-3.5 w-3.5 shrink-0" />
                        <span>
                          <span className="font-medium text-gray-700">
                            Requested:
                          </span>{" "}
                          {formatDate(referral.requestedAt)}
                        </span>
                      </div>
                      {referral.reviewedAt && (
                        <div className="flex items-center gap-2 text-gray-500">
                          <CalendarDays className="h-3.5 w-3.5 shrink-0" />
                          <span>
                            <span className="font-medium text-gray-700">
                              Reviewed:
                            </span>{" "}
                            {formatDate(referral.reviewedAt)}
                          </span>
                        </div>
                      )}
                      {referral.resumeLink && (
                        <div className="flex items-center gap-2 text-gray-500">
                          <FileText className="h-3.5 w-3.5 shrink-0" />
                          <a
                            href={referral.resumeLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-navy-600 hover:underline"
                          >
                            View Resume →
                          </a>
                        </div>
                      )}
                    </div>

                    {/* Requester message */}
                    {referral.message && (
                      <div className="p-3 bg-gray-50 rounded-xl text-sm text-gray-600 border border-gray-100">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1 flex items-center gap-1">
                          <MessageSquare className="h-3 w-3" /> Their Message
                        </p>
                        <p>{referral.message}</p>
                      </div>
                    )}

                    {/* Your prior response */}
                    {referral.responseMessage && (
                      <div
                        className={`mt-3 p-3 rounded-xl text-sm border ${cfg.bg} ${cfg.border}`}
                      >
                        <p
                          className={`text-xs font-semibold uppercase tracking-wide mb-1 flex items-center gap-1 ${cfg.text}`}
                        >
                          <MessageSquare className="h-3 w-3" /> Your Response
                        </p>
                        <p className={cfg.text}>{referral.responseMessage}</p>
                      </div>
                    )}

                    {/* Respond Panel (only for PENDING) */}
                    {referral.status === "PENDING" && (
                      <RespondPanel
                        referralId={referral.id}
                        onResponded={handleResponded}
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
