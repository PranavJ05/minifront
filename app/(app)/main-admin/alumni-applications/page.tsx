"use client";

/**
 * Admin Alumni Applications Page
 * /main-admin/alumni-applications
 *
 * Features:
 * - View pending alumni applications
 * - Approve/Reject applications
 */

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle,
  XCircle,
  Loader2,
  AlertCircle,
  RefreshCw,
  Shield,
  Clock,
  Check,
  X,
  User,
  Mail,
  Building2,
  MapPin,
  Phone,
} from "lucide-react";
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
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
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

  // Check admin access on mount
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
        return;
      }
    } catch (err) {
      console.error("Failed to parse user:", err);
      router.replace("/auth/login");
    }
  }, [router]);

  async function handleApprove(application: AlumniApplication) {
    setError(null);
    setSuccessMessage(null);

    try {
      await approveMutation.mutateAsync(application.id);
      setSuccessMessage(
        `Application from "${application.name}" approved successfully!`,
      );
      if (showDetailModal) {
        setShowDetailModal(false);
        setSelectedApplication(null);
      }
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Failed to approve application"));
    }
  }

  async function handleReject(application: AlumniApplication) {
    if (
      !confirm(
        `Are you sure you want to reject "${application.name}"'s application?`,
      )
    ) {
      return;
    }

    setError(null);
    setSuccessMessage(null);

    try {
      await rejectMutation.mutateAsync(application.id);
      setSuccessMessage(`Application from "${application.name}" rejected`);
      if (showDetailModal) {
        setShowDetailModal(false);
        setSelectedApplication(null);
      }
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Failed to reject application"));
    }
  }

  function handleRefresh() {
    refetch();
  }

  function openDetailModal(application: AlumniApplication) {
    setSelectedApplication(application);
    setShowDetailModal(true);
  }

  // If not admin, don't flash the UI before the redirect happens
  if (!isUserAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-navy-800" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-navy-950 text-white">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gold-500 flex items-center justify-center">
                <Shield className="h-6 w-6 text-navy-950" />
              </div>
              <div>
                <h1 className="font-serif text-2xl font-bold">
                  Alumni Applications
                </h1>
                <p className="text-gray-400 text-sm mt-0.5">
                  Review and approve alumni membership applications
                </p>
              </div>
            </div>
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-navy-800 hover:bg-navy-700 disabled:opacity-50 transition-colors"
            >
              <RefreshCw
                className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
              />
              Refresh
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <StatCard
              icon={Clock}
              label="Pending Applications"
              value={applications.length}
              color="amber"
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-700">
            <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-sm">Error</p>
              <p className="text-sm mt-0.5">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-400 hover:text-red-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3 text-green-700">
            <CheckCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-sm">Success</p>
              <p className="text-sm mt-0.5">{successMessage}</p>
            </div>
            <button
              onClick={() => setSuccessMessage(null)}
              className="text-green-400 hover:text-green-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Applications List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-navy-800" />
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center py-12">
            <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              No Pending Applications
            </h3>
            <p className="text-gray-500">
              All alumni applications have been reviewed.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((application) => (
              <ApplicationCard
                key={application.id}
                application={application}
                onApprove={() => handleApprove(application)}
                onReject={() => handleReject(application)}
                onViewDetails={() => openDetailModal(application)}
                isProcessing={
                  approveMutation.isPending || rejectMutation.isPending
                }
              />
            ))}
          </div>
        )}
      </main>

      {/* Detail Modal */}
      {showDetailModal && selectedApplication && (
        <ApplicationDetailModal
          application={selectedApplication}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedApplication(null);
          }}
          onApprove={() => handleApprove(selectedApplication)}
          onReject={() => handleReject(selectedApplication)}
          isProcessing={approveMutation.isPending || rejectMutation.isPending}
        />
      )}
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: any;
  label: string;
  value: number;
  color: "amber" | "green" | "blue" | "purple";
}) {
  const colorClasses = {
    amber: "bg-amber-50 text-amber-700 border-amber-200",
    green: "bg-green-50 text-green-700 border-green-200",
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    purple: "bg-purple-50 text-purple-700 border-purple-200",
  };

  return (
    <div
      className={`p-4 rounded-xl border ${colorClasses[color]} flex items-center gap-4`}
    >
      <Icon className="h-6 w-6" />
      <div>
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-sm opacity-80">{label}</p>
      </div>
    </div>
  );
}

function ApplicationCard({
  application,
  onApprove,
  onReject,
  onViewDetails,
  isProcessing,
}: {
  application: AlumniApplication;
  onApprove: () => void;
  onReject: () => void;
  onViewDetails: () => void;
  isProcessing: boolean;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            {application.profilePicture ? (
              <img
                src={application.profilePicture}
                alt={application.name}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-navy-100 flex items-center justify-center">
                <User className="h-6 w-6 text-navy-600" />
              </div>
            )}
            <div>
              <h3 className="font-semibold text-lg text-navy-900">
                {application.name}
              </h3>
              <p className="text-sm text-gray-500 flex items-center gap-1">
                <Mail className="h-3 w-3" />
                {application.email}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            {application.department && (
              <div className="flex items-center gap-2 text-gray-600">
                <Building2 className="h-4 w-4" />
                <span>{application.department}</span>
              </div>
            )}
            {application.batchYear && (
              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="h-4 w-4" />
                <span>Batch {application.batchYear}</span>
              </div>
            )}
            {application.profession && (
              <div className="flex items-center gap-2 text-gray-600">
                <User className="h-4 w-4" />
                <span>{application.profession}</span>
              </div>
            )}
            {application.location && (
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="h-4 w-4" />
                <span>{application.location}</span>
              </div>
            )}
          </div>

          {application.bio && (
            <p className="mt-3 text-sm text-gray-600 line-clamp-2">
              {application.bio}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 ml-4">
          <button
            onClick={onViewDetails}
            className="px-3 py-2 text-sm font-medium text-navy-700 bg-navy-50 hover:bg-navy-100 rounded-lg transition-colors"
          >
            View Details
          </button>
          <button
            onClick={onApprove}
            disabled={isProcessing}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors disabled:opacity-50"
          >
            <CheckCircle className="h-4 w-4" />
            Approve
          </button>
          <button
            onClick={onReject}
            disabled={isProcessing}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50"
          >
            <XCircle className="h-4 w-4" />
            Reject
          </button>
        </div>
      </div>
    </div>
  );
}

function ApplicationDetailModal({
  application,
  onClose,
  onApprove,
  onReject,
  isProcessing,
}: {
  application: AlumniApplication;
  onClose: () => void;
  onApprove: () => void;
  onReject: () => void;
  isProcessing: boolean;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-navy-900">
              Application Details
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Profile Header */}
          <div className="flex items-center gap-4 mb-6">
            {application.profilePicture ? (
              <img
                src={application.profilePicture}
                alt={application.name}
                className="w-20 h-20 rounded-full object-cover"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-navy-100 flex items-center justify-center">
                <User className="h-10 w-10 text-navy-600" />
              </div>
            )}
            <div>
              <h3 className="text-2xl font-bold text-navy-900">
                {application.name}
              </h3>
              <p className="text-gray-500 flex items-center gap-2 mt-1">
                <Mail className="h-4 w-4" />
                {application.email}
              </p>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <DetailItem
              icon={Building2}
              label="Department"
              value={application.department || "Not specified"}
            />
            <DetailItem
              icon={Clock}
              label="Batch Year"
              value={
                application.batchYear
                  ? `Batch ${application.batchYear}`
                  : "Not specified"
              }
            />
            <DetailItem
              icon={User}
              label="Profession"
              value={application.profession || "Not specified"}
            />
            <DetailItem
              icon={MapPin}
              label="Location"
              value={application.location || "Not specified"}
            />
            {application.phone && (
              <DetailItem
                icon={Phone}
                label="Phone"
                value={application.phone}
              />
            )}
            {application.linkedin && (
              <DetailItem
                icon={Phone}
                label="LinkedIn"
                value={application.linkedin}
                isLink
              />
            )}
          </div>

          {/* Bio */}
          {application.bio && (
            <div className="mb-6">
              <h4 className="font-semibold text-navy-900 mb-2">Bio</h4>
              <p className="text-gray-600 whitespace-pre-wrap">
                {application.bio}
              </p>
            </div>
          )}

          {/* Timestamps */}
          <div className="text-sm text-gray-500 mb-6">
            <p>Applied: {new Date(application.createdAt).toLocaleString()}</p>
            {application.updatedAt !== application.createdAt && (
              <p>
                Last Updated: {new Date(application.updatedAt).toLocaleString()}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Close
            </button>
            <button
              onClick={onReject}
              disabled={isProcessing}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50"
            >
              <XCircle className="h-4 w-4" />
              Reject Application
            </button>
            <button
              onClick={onApprove}
              disabled={isProcessing}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors disabled:opacity-50"
            >
              <CheckCircle className="h-4 w-4" />
              Approve Application
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailItem({
  icon: Icon,
  label,
  value,
  isLink = false,
}: {
  icon: any;
  label: string;
  value: string;
  isLink?: boolean;
}) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="text-sm text-gray-500 mb-0.5">{label}</p>
        {isLink ? (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-navy-700 hover:text-navy-900 break-all"
          >
            {value}
          </a>
        ) : (
          <p className="text-sm font-medium text-navy-900 break-all">{value}</p>
        )}
      </div>
    </div>
  );
}
