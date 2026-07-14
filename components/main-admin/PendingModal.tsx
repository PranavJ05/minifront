"use client";
import { useState, useEffect, useCallback } from "react";
import { FaLinkedin } from "react-icons/fa";
import {
  UserCheck,
  X,
  Check,
  Loader2,
  Briefcase,
  GraduationCap,
} from "lucide-react";
import { api } from "@/lib/fetcher";
import { ApiError } from "@/lib/api-error";

interface PendingRequest {
  requestId: number;
  userId?: number;
  name?: string;
  fullName?: string;
  email?: string;
  batchYear?: number;
  department?: string;
  profession?: string;
  linkedinUrl?: string;
  status?: string;
  requestedAt?: string;
  [key: string]: unknown;
}

export default function PendingModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [requests, setRequests] = useState<PendingRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api<PendingRequest[]>("/admin/pending");
      setRequests(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to fetch";
      console.error("Failed to fetch pending requests:", message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleAction = async (
    requestId: number,
    action: "approve" | "reject",
  ) => {
    setActionLoading(requestId);
    try {
      await api<{ success: boolean }>(`/admin/${action}/${requestId}`, {
        method: "POST",
      });
      setRequests((prev) =>
        prev.filter((req) => req.requestId !== requestId),
      );
    } catch (err: unknown) {
      const message = err instanceof ApiError ? err.message : "Action failed";
      console.error(`Failed to ${action} request ${requestId}:`, message);
    } finally {
      setActionLoading(null);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "\u2014";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const resolveName = (req: PendingRequest): string => {
    return req.name || req.fullName || "Unknown";
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => {
          setIsOpen((prev) => !prev);
          if (!isOpen) fetchRequests();
        }}
        title="Pending Approvals"
        className="relative p-2 text-muted-foreground hover:text-foreground transition-colors"
      >
        <UserCheck className="h-5 w-5" />
        {requests.length > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-background">
            {requests.length}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40 cursor-default"
            aria-label="Close"
            onClick={() => setIsOpen(false)}
          />

          <div className="absolute right-0 top-full mt-3 w-96 bg-popover rounded-xl shadow-2xl border border-border z-50 overflow-hidden">
            <div className="px-4 py-3 bg-navy-950 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-white text-sm tracking-wide">
                  PENDING APPROVALS
                </h3>
                <p className="text-gray-400 text-xs mt-0.5">
                  Review new alumni registrations
                </p>
              </div>
              <span className="bg-gold-500 text-navy-950 text-xs px-2.5 py-1 rounded-full font-bold">
                {requests.length}
              </span>
            </div>

            <div className="max-h-[460px] overflow-y-auto bg-muted/30">
              {loading ? (
                <div className="flex flex-col items-center justify-center gap-4 py-14">
                  <div className="relative h-12 w-12">
                    <div className="absolute inset-0 rounded-full border-4 border-border" />
                    <div className="absolute inset-0 rounded-full border-4 border-t-gold-500 animate-spin" />
                  </div>
                  <p className="text-sm font-medium text-muted-foreground animate-pulse">
                    Loading requests...
                  </p>
                </div>
              ) : requests.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-3 py-14">
                  <div className="w-14 h-14 bg-green-50 border-2 border-green-100 rounded-full flex items-center justify-center">
                    <Check className="h-7 w-7 text-green-500" />
                  </div>
                  <p className="text-sm font-semibold text-foreground">
                    All caught up!
                  </p>
                  <p className="text-xs text-muted-foreground">
                    No pending requests right now.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {requests.map((req) => {
                    const displayName = resolveName(req);
                    const initial = displayName.charAt(0).toUpperCase();
                    return (
                      <div
                        key={req.requestId}
                        className="p-4 bg-card hover:bg-accent/50 transition-colors"
                      >
                        <div className="flex items-start gap-3 mb-3">
                          <div className="h-10 w-10 bg-navy-100 rounded-full flex items-center justify-center text-navy-700 font-bold text-sm border-2 border-white shadow-sm flex-shrink-0">
                            {initial}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <p className="font-bold text-foreground text-sm truncate">
                                {displayName}
                              </p>
                              <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded whitespace-nowrap flex-shrink-0">
                                {formatDate(req.requestedAt)}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground truncate mt-0.5">
                              {req.email ?? "\u2014"}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-3 pl-13">
                          <span className="flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-100 px-2 py-1 rounded text-xs font-medium">
                            <GraduationCap className="h-3 w-3" />
                            {req.batchYear ?? "\u2014"}
                          </span>
                          <span className="flex items-center gap-1 bg-purple-50 text-purple-700 border border-purple-100 px-2 py-1 rounded text-xs font-medium max-w-[120px] truncate">
                            {req.department ?? "\u2014"}
                          </span>
                          {req.profession && (
                            <span className="flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-100 px-2 py-1 rounded text-xs font-medium max-w-[130px] truncate">
                              <Briefcase className="h-3 w-3 flex-shrink-0" />
                              {req.profession}
                            </span>
                          )}
                        </div>

                        {req.linkedinUrl && (
                          <div className="mb-3 pl-13">
                            <a
                              href={req.linkedinUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline"
                            >
                              <FaLinkedin className="h-3 w-3" />
                              View LinkedIn
                            </a>
                          </div>
                        )}

                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              handleAction(req.requestId, "approve")
                            }
                            disabled={actionLoading === req.requestId}
                            className="flex-1 bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {actionLoading === req.requestId ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <Check className="h-3.5 w-3.5" />
                            )}
                            Approve
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              handleAction(req.requestId, "reject")
                            }
                            disabled={actionLoading === req.requestId}
                            className="flex-1 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {actionLoading === req.requestId ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <X className="h-3.5 w-3.5" />
                            )}
                            Reject
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {!loading && requests.length > 0 && (
              <div className="px-4 py-2.5 bg-muted/50 border-t border-border text-center">
                <p className="text-[10px] text-muted-foreground">
                  Actions are permanent and cannot be undone.
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
