"use client";

import { useState } from "react";
import { FaLinkedin } from "react-icons/fa";
import {
  UserCheck,
  Check,
  Loader2,
  Briefcase,
  GraduationCap,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  usePendingUsersQuery,
  useApproveUserMutation,
  useRejectUserMutation,
} from "@/hooks/queries/admin";
import { isCurrentAdmin } from "@/lib/auth";
import { getErrorMessage } from "@/lib/get-error-message";

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
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const isAuthorized = isCurrentAdmin();

  const {
    data: rawRequests = [],
    isLoading: loading,
    refetch,
  } = usePendingUsersQuery({ enabled: isOpen && isAuthorized });

  const approveMutation = useApproveUserMutation();
  const rejectMutation = useRejectUserMutation();

  const requests = (rawRequests as unknown as PendingRequest[]) || [];

  const handleAction = async (
    requestId: number,
    action: "approve" | "reject",
  ) => {
    setActionLoading(requestId);
    try {
      if (action === "approve") {
        await approveMutation.mutateAsync(requestId);
        toast.success("Registration approved successfully");
      } else {
        await rejectMutation.mutateAsync(requestId);
        toast.success("Registration rejected");
      }
      refetch();
    } catch (err: unknown) {
      const message = getErrorMessage(err, `Failed to ${action} request`);
      toast.error(message);
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

  const resolveName = (req: PendingRequest): string => {
    return req.name || req.fullName || "Unknown";
  };

  if (!isAuthorized) return null;

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => {
          setIsOpen((prev) => !prev);
          if (!isOpen) refetch();
        }}
        title="Pending Approvals"
        className="relative cursor-pointer"
      >
        <UserCheck className="h-4 w-4 text-muted-foreground" />
        {requests.length > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-xs font-bold text-destructive-foreground">
            {requests.length}
          </span>
        )}
      </Button>

      {isOpen && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40 cursor-default"
            aria-label="Close modal background"
            onClick={() => setIsOpen(false)}
          />

          <div className="absolute right-0 top-full mt-2 w-96 bg-popover rounded-xl shadow-xl border border-border z-50 overflow-hidden text-popover-foreground">
            <div className="px-4 py-3 bg-muted/60 border-b border-border flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-foreground text-sm">
                  Pending Approvals
                </h3>
                <p className="text-xs text-muted-foreground">
                  Review new registration applications
                </p>
              </div>
              <Badge variant="secondary" className="text-xs">
                {requests.length}
              </Badge>
            </div>

            <div className="max-h-[420px] overflow-y-auto bg-card">
              {loading ? (
                <div className="flex flex-col items-center justify-center gap-2 py-12 text-muted-foreground">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <p className="text-xs">Loading requests...</p>
                </div>
              ) : requests.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
                  <div className="w-10 h-10 bg-emerald-500/10 text-emerald-600 rounded-full flex items-center justify-center">
                    <Check className="h-5 w-5" />
                  </div>
                  <p className="text-sm font-semibold text-foreground">All caught up!</p>
                  <p className="text-xs text-muted-foreground">
                    No pending approval requests.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-border/60">
                  {requests.map((req) => {
                    const displayName = resolveName(req);
                    const initial = displayName.charAt(0).toUpperCase();
                    return (
                      <div key={req.requestId} className="p-3.5 space-y-2.5 hover:bg-muted/20 transition-colors">
                        <div className="flex items-start gap-3">
                          <div className="h-8 w-8 rounded-full bg-muted border border-border flex items-center justify-center font-semibold text-xs text-foreground shrink-0">
                            {initial}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1">
                              <p className="font-semibold text-xs text-foreground truncate">
                                {displayName}
                              </p>
                              <span className="text-[11px] text-muted-foreground shrink-0">
                                {formatDate(req.requestedAt)}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground truncate">
                              {req.email ?? "—"}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1.5 text-xs">
                          <Badge variant="outline" className="font-normal text-xs">
                            <GraduationCap className="h-3 w-3 mr-1" />
                            {req.batchYear ?? "—"}
                          </Badge>
                          <Badge variant="secondary" className="font-normal text-xs">
                            {req.department ?? "—"}
                          </Badge>
                          {req.profession && (
                            <Badge variant="outline" className="font-normal text-xs">
                              <Briefcase className="h-3 w-3 mr-1" />
                              {req.profession}
                            </Badge>
                          )}
                        </div>

                        {req.linkedinUrl && (
                          <div>
                            <a
                              href={req.linkedinUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                            >
                              <FaLinkedin className="h-3 w-3" />
                              LinkedIn Profile
                            </a>
                          </div>
                        )}

                        <div className="flex gap-2 pt-1">
                          <Button
                            size="xs"
                            onClick={() => handleAction(req.requestId, "approve")}
                            disabled={actionLoading === req.requestId}
                            className="flex-1 cursor-pointer"
                          >
                            {actionLoading === req.requestId ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              "Approve"
                            )}
                          </Button>
                          <Button
                            size="xs"
                            variant="outline"
                            onClick={() => handleAction(req.requestId, "reject")}
                            disabled={actionLoading === req.requestId}
                            className="flex-1 cursor-pointer text-destructive hover:text-destructive"
                          >
                            {actionLoading === req.requestId ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              "Reject"
                            )}
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {!loading && requests.length > 0 && (
              <div className="px-4 py-2 bg-muted/40 border-t border-border text-center">
                <p className="text-xs text-muted-foreground">
                  Actions take effect immediately.
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
