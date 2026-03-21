"use client";
import { useState, useEffect } from "react";
import {
  UserCheck,
  X,
  Check,
  Loader2,
  Linkedin,
  Briefcase,
  GraduationCap,
} from "lucide-react";

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
  [key: string]: unknown; // allow unknown fields from backend
}

export default function PendingModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [requests, setRequests] = useState<PendingRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.warn("No token found in localStorage");
        return;
      }

      const res = await fetch("http://localhost:8080/admin/pending", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        const data: PendingRequest[] = await res.json();
        console.log("Pending requests raw response:", data);
        if (Array.isArray(data) && data.length > 0) {
          console.log("First item keys:", Object.keys(data[0]));
          console.log("First item values:", data[0]);
        }
        setRequests(data);
      } else {
        console.error("Failed to fetch pending requests. Status:", res.status);
      }
    } catch (error) {
      console.error("Network error fetching pending requests:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAction = async (
    requestId: number,
    action: "approve" | "reject",
  ) => {
    setActionLoading(requestId);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:8080/admin/${action}/${requestId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token ?? ""}`,
          },
        },
      );

      if (res.ok) {
        console.log(`Request ${requestId} ${action}d successfully`);
        setRequests((prev) =>
          prev.filter((req) => req.requestId !== requestId),
        );
      } else {
        console.error(
          `Failed to ${action} request ${requestId}. Status:`,
          res.status,
        );
      }
    } catch (error) {
      console.error(
        `Network error processing ${action} for request ${requestId}:`,
        error,
      );
    } finally {
      setActionLoading(null);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  // Backend may return "name" or "fullName" — resolve whichever exists
  const resolveName = (req: PendingRequest): string => {
    return req.name || req.fullName || "Unknown";
  };

  return (
    <div className="relative">
      {/* Trigger Button */}
      <button
        onClick={() => {
          setIsOpen((prev) => !prev);
          if (!isOpen) fetchRequests();
        }}
        title="Pending Approvals"
        className="relative p-2 text-gray-400 hover:text-navy-800 transition-colors"
      >
        <UserCheck className="h-6 w-6" />
        {requests.length > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white">
            {requests.length}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Panel */}
          <div className="absolute right-0 top-full mt-3 w-96 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden ring-1 ring-black/5">
            {/* Header */}
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

            {/* Body */}
            <div className="max-h-[460px] overflow-y-auto bg-gray-50">
              {/* Loading */}
              {loading ? (
                <div className="flex flex-col items-center justify-center gap-4 py-14">
                  <div className="relative h-12 w-12">
                    <div className="absolute inset-0 rounded-full border-4 border-gray-200" />
                    <div className="absolute inset-0 rounded-full border-4 border-t-gold-500 animate-spin" />
                  </div>
                  <p className="text-sm font-medium text-gray-500 animate-pulse">
                    Loading requests...
                  </p>
                </div>
              ) : requests.length === 0 ? (
                /* Empty */
                <div className="flex flex-col items-center justify-center gap-3 py-14">
                  <div className="w-14 h-14 bg-green-50 border-2 border-green-100 rounded-full flex items-center justify-center">
                    <Check className="h-7 w-7 text-green-500" />
                  </div>
                  <p className="text-sm font-semibold text-gray-600">
                    All caught up!
                  </p>
                  <p className="text-xs text-gray-400">
                    No pending requests right now.
                  </p>
                </div>
              ) : (
                /* List */
                <div className="divide-y divide-gray-100">
                  {requests.map((req) => {
                    const displayName = resolveName(req);
                    const initial = displayName.charAt(0).toUpperCase();
                    return (
                      <div
                        key={req.requestId}
                        className="p-4 bg-white hover:bg-gray-50/80 transition-colors"
                      >
                        {/* Avatar + name + date */}
                        <div className="flex items-start gap-3 mb-3">
                          <div className="h-10 w-10 bg-navy-100 rounded-full flex items-center justify-center text-navy-700 font-bold text-sm border-2 border-white shadow-sm flex-shrink-0">
                            {initial}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <p className="font-bold text-navy-900 text-sm truncate">
                                {displayName}
                              </p>
                              <span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded whitespace-nowrap flex-shrink-0">
                                {formatDate(req.requestedAt)}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500 truncate mt-0.5">
                              {req.email ?? "—"}
                            </p>
                          </div>
                        </div>

                        {/* Badges */}
                        <div className="flex flex-wrap gap-2 mb-3 pl-13">
                          <span className="flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-100 px-2 py-1 rounded text-xs font-medium">
                            <GraduationCap className="h-3 w-3" />
                            {req.batchYear ?? "—"}
                          </span>
                          <span className="flex items-center gap-1 bg-purple-50 text-purple-700 border border-purple-100 px-2 py-1 rounded text-xs font-medium max-w-[120px] truncate">
                            {req.department ?? "—"}
                          </span>
                          {req.profession && (
                            <span className="flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-100 px-2 py-1 rounded text-xs font-medium max-w-[130px] truncate">
                              <Briefcase className="h-3 w-3 flex-shrink-0" />
                              {req.profession}
                            </span>
                          )}
                        </div>

                        {/* LinkedIn */}
                        {req.linkedinUrl && (
                          <div className="mb-3 pl-13">
                            <a
                              href={req.linkedinUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline"
                            >
                              <Linkedin className="h-3 w-3" />
                              View LinkedIn
                            </a>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-2">
                          <button
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

            {/* Footer */}
            {!loading && requests.length > 0 && (
              <div className="px-4 py-2.5 bg-gray-50 border-t border-gray-100 text-center">
                <p className="text-[10px] text-gray-400">
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
