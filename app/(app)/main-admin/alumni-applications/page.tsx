"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle,
  Loader2,
  RefreshCw,
  Shield,
  Clock,
  Check,
  X,
  User,
  Mail,
  Building2,
  MapPin,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  usePendingAlumniApplicationsQuery,
  useApproveAlumniApplicationMutation,
  useRejectAlumniApplicationMutation,
} from "@/hooks/queries/alumniApplications";
import { getErrorMessage } from "@/lib/get-error-message";
import { isAnyAdmin } from "@/lib/roleUtils";
import type { AlumniApplication } from "@/lib/types/alumniApplications";

export default function AdminAlumniApplicationsPage() {
  const router = useRouter();
  const [isUserAdmin, setIsUserAdmin] = useState(false);
  const [selectedApplication, setSelectedApplication] =
    useState<AlumniApplication | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const {
    data: applications = [],
    isLoading,
    refetch,
  } = usePendingAlumniApplicationsQuery();

  const approveMutation = useApproveAlumniApplicationMutation();
  const rejectMutation = useRejectAlumniApplicationMutation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("alumni_user");

    if (!token || !storedUser) {
      router.replace("/auth/login");
      return;
    }

    try {
      const user = JSON.parse(storedUser);
      const hasAdminRights = isAnyAdmin(user?.roles);
      setIsUserAdmin(hasAdminRights);

      if (!hasAdminRights) {
        router.replace("/main-admin");
      }
    } catch (err) {
      console.error("Failed to parse user:", err);
      router.replace("/auth/login");
    }
  }, [router]);

  async function handleApprove(application: AlumniApplication) {
    try {
      await approveMutation.mutateAsync(application.id);
      toast.success(`Application from "${application.name}" approved successfully!`);
      if (showDetailModal) {
        setShowDetailModal(false);
        setSelectedApplication(null);
      }
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "Failed to approve application"));
    }
  }

  async function handleReject(application: AlumniApplication) {
    if (
      !confirm(
        `Are you sure you want to reject "${application.name}"'s application?`
      )
    ) {
      return;
    }

    try {
      await rejectMutation.mutateAsync(application.id);
      toast.success(`Application from "${application.name}" rejected`);
      if (showDetailModal) {
        setShowDetailModal(false);
        setSelectedApplication(null);
      }
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "Failed to reject application"));
    }
  }

  if (!isUserAdmin) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 pb-6 space-y-6">
      {/* Sticky Header */}
      <div className="sticky top-14 z-30 bg-background/95 backdrop-blur-md py-4 border-b border-border/40 -mx-4 sm:-mx-6 px-4 sm:px-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h1 className="text-xl font-semibold tracking-tight text-foreground flex items-center gap-2">
              <Shield className="h-5 w-5 text-muted-foreground" /> Alumni Applications
            </h1>
            <p className="text-xs text-muted-foreground">
              Review and process pending alumni membership applications.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs font-normal">
              {applications.length} Pending
            </Badge>
            <Button
              variant="outline"
              size="xs"
              onClick={() => refetch()}
              disabled={isLoading}
              className="cursor-pointer"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : applications.length === 0 ? (
        <Card className="p-12 text-center">
          <CardContent className="p-0 flex flex-col items-center gap-2">
            <Clock className="h-8 w-8 text-muted-foreground/40" />
            <p className="font-semibold text-sm text-foreground">No Pending Applications</p>
            <p className="text-xs text-muted-foreground">
              All submitted applications have been reviewed.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {applications.map((application) => (
            <Card key={application.id} className="p-4 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-muted overflow-hidden flex items-center justify-center shrink-0 border border-border">
                    {application.profilePicture ? (
                      <img src={application.profilePicture} alt={application.name} className="w-full h-full object-cover" />
                    ) : (
                      <User className="h-4 w-4 text-muted-foreground/60" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-xs text-foreground truncate">
                      {application.name}
                    </h3>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 truncate">
                      <Mail className="h-3 w-3 shrink-0" /> {application.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <Button
                    variant="outline"
                    size="xs"
                    onClick={() => {
                      setSelectedApplication(application);
                      setShowDetailModal(true);
                    }}
                    className="cursor-pointer"
                  >
                    View Details
                  </Button>
                  <Button
                    size="xs"
                    onClick={() => handleApprove(application)}
                    disabled={approveMutation.isPending || rejectMutation.isPending}
                    className="cursor-pointer"
                  >
                    <Check className="h-3.5 w-3.5 mr-1" /> Approve
                  </Button>
                  <Button
                    variant="outline"
                    size="xs"
                    onClick={() => handleReject(application)}
                    disabled={approveMutation.isPending || rejectMutation.isPending}
                    className="cursor-pointer text-destructive hover:text-destructive"
                  >
                    <X className="h-3.5 w-3.5 mr-1" /> Reject
                  </Button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 text-xs text-muted-foreground pt-1 border-t border-border/40">
                {application.department && (
                  <span className="flex items-center gap-1">
                    <Building2 className="h-3 w-3" /> {application.department}
                  </span>
                )}
                {application.batchYear && (
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" /> Batch {application.batchYear}
                  </span>
                )}
                {application.profession && (
                  <span className="flex items-center gap-1">
                    <User className="h-3 w-3" /> {application.profession}
                  </span>
                )}
                {application.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> {application.location}
                  </span>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedApplication && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <Card className="max-w-lg w-full p-6 space-y-4 max-h-[85vh] overflow-y-auto border-border shadow-xl">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h2 className="text-sm font-semibold text-foreground">Application Details</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setShowDetailModal(false);
                  setSelectedApplication(null);
                }}
                className="cursor-pointer h-7 w-7"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <p className="text-xs text-muted-foreground">Full Name</p>
                <p className="font-semibold text-foreground">{selectedApplication.name}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="font-medium text-foreground">{selectedApplication.email}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-muted-foreground">Department</p>
                  <p className="font-medium text-foreground">{selectedApplication.department || "N/A"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Batch Year</p>
                  <p className="font-medium text-foreground">{selectedApplication.batchYear || "N/A"}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Profession</p>
                <p className="font-medium text-foreground">{selectedApplication.profession || "N/A"}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Location</p>
                <p className="font-medium text-foreground">{selectedApplication.location || "N/A"}</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
              <Button
                variant="outline"
                size="xs"
                onClick={() => {
                  setShowDetailModal(false);
                  setSelectedApplication(null);
                }}
                className="cursor-pointer"
              >
                Close
              </Button>
              <Button
                size="xs"
                onClick={() => handleApprove(selectedApplication)}
                disabled={approveMutation.isPending || rejectMutation.isPending}
                className="cursor-pointer"
              >
                Approve
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
