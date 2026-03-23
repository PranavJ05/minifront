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
    dot: "bg-amber-400",
  },
  APPROVED: {
    label: "Approved",
    icon: CheckCircle2,
    bg: "bg-green-50",
    text: "text-green-700",
    border: "border-green-200",
    dot: "bg-green-500",
  },
  REJECTED: {
    label: "Rejected",
    icon: XCircle,
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-200",
    dot: "bg-red-400",
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

export default function MyReferralsPage() {
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
      // Build request headers and include Authorization when a token is available.
      const headers: Record<string, string> = {};
      const token = getToken();
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      const res = await fetch("http://localhost:8080/referrals/mine", {
        headers,
      });
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-serif text-3xl font-bold text-white mb-1">
                My Referral Requests
              </h1>
              <p className="text-navy-400 text-sm">
                Track the status of all referrals you've requested
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
                className={`rounded-xl p-4 text-left border-2 transition-all ${
                  activeFilter === s
                    ? s === "ALL"
                      ? "border-navy-700 bg-navy-50"
                      : `${cfg!.border} ${cfg!.bg}`
                    : "border-transparent bg-white hover:border-gray-200"
                } shadow-sm`}
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
                <p className="text-xs text-gray-500 font-medium capitalize">
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
              <p className="text-gray-400 text-sm">Loading your referrals…</p>
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
                No referrals yet
              </p>
              <p className="text-gray-400 text-sm mt-1">
                {activeFilter === "ALL"
                  ? "Head to Opportunities and request a referral from an alumni."
                  : `You have no ${activeFilter.toLowerCase()} referral requests.`}
              </p>
            </div>
            <Link href="/opportunities">
              <button className="btn-primary mt-2">Browse Opportunities</button>
            </Link>
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
                        <p className="text-navy-900 font-semibold">
                          Referral Request #{referral.id}
                        </p>
                      </div>
                      <StatusBadge status={referral.status} />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4 text-sm">
                      {/* Timestamps */}
                      <div className="space-y-2">
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
                      </div>

                      {/* Resume Link */}
                      {referral.resumeLink && (
                        <div className="flex items-start gap-2 text-gray-500">
                          <FileText className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                          <a
                            href={referral.resumeLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-navy-600 hover:underline truncate"
                          >
                            View Resume
                          </a>
                        </div>
                      )}
                    </div>

                    {/* Your message */}
                    {referral.message && (
                      <div className="mt-4 p-3 bg-gray-50 rounded-xl text-sm text-gray-600 border border-gray-100">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1 flex items-center gap-1">
                          <MessageSquare className="h-3 w-3" /> Your Message
                        </p>
                        <p>{referral.message}</p>
                      </div>
                    )}

                    {/* Referrer's response */}
                    {referral.responseMessage && (
                      <div
                        className={`mt-3 p-3 rounded-xl text-sm border ${cfg.bg} ${cfg.border}`}
                      >
                        <p
                          className={`text-xs font-semibold uppercase tracking-wide mb-1 flex items-center gap-1 ${cfg.text}`}
                        >
                          <MessageSquare className="h-3 w-3" /> Referrer's
                          Response
                        </p>
                        <p className={cfg.text}>{referral.responseMessage}</p>
                      </div>
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
