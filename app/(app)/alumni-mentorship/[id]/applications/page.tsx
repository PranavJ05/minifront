"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import {
  useMentorshipQuery,
  useGetApplicantsQuery,
  useUpdateApplicationStatusMutation,
  useForceCloseApplicationsMutation,
  useFinalSubmitMentorshipMutation,
} from "@/hooks/queries/mentorships";
import { StatusBadge } from "@/components/mentorship/StatusBadge";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ReviewableMentorshipApplicationStatus } from "@/lib/types/mentorship";
import {
  Loader2,
  AlertCircle,
  ArrowLeft,
  Lock,
  CheckCheck,
  Users,
  ExternalLink,
} from "lucide-react";

const REVIEW_STATUSES: ReviewableMentorshipApplicationStatus[] = [
  "PROVISIONAL_SELECTED",
  "DROPPED_OUT",
];

export default function ApplicationsPage() {
  const params = useParams();
  const mentorshipId = Number(params.id);

  const { data: mentorship, isLoading: mentorshipLoading } = useMentorshipQuery(mentorshipId);
  const { data: applications, isLoading: appsLoading, isError } = useGetApplicantsQuery(mentorshipId);
  const updateStatus = useUpdateApplicationStatusMutation();
  const forceClose = useForceCloseApplicationsMutation();
  const finalSubmit = useFinalSubmitMentorshipMutation();

  const isPublished = mentorship?.finalListVisibleToMentor === true;

  if (mentorshipLoading || appsLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Failed to load applications.</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <Link
        href={`/alumni-mentorship/${mentorshipId}`}
        className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Mentorship
      </Link>

      <div className="space-y-1">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Applications
        </h1>
        {mentorship && (
          <p className="text-xs text-muted-foreground">{mentorship.title}</p>
        )}
      </div>

      {/* Admin Controls */}
      <div className="flex flex-wrap gap-3 items-center">
        <Badge
          variant={isPublished ? "default" : "secondary"}
          className="text-[10px] font-semibold"
        >
          {isPublished ? "Final list published" : "Review in progress"}
        </Badge>

        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            if (!confirm("Force close applications for testing? Continue?")) return;
            forceClose.mutate(mentorshipId);
          }}
          disabled={forceClose.isPending || isPublished}
          className="cursor-pointer text-xs"
        >
          {forceClose.isPending ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Lock className="h-3.5 w-3.5" />
          )}
          {isPublished ? "Testing Disabled" : "Force Close"}
        </Button>

        <Button
          variant="default"
          size="sm"
          onClick={() => {
            if (!confirm("Final submit will publish results to mentor. Continue?")) return;
            finalSubmit.mutate(mentorshipId);
          }}
          disabled={finalSubmit.isPending || isPublished}
          className="cursor-pointer text-xs"
        >
          {finalSubmit.isPending ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <CheckCheck className="h-3.5 w-3.5" />
          )}
          {isPublished ? "Already Published" : "Final Submit"}
        </Button>
      </div>

      {/* Applications Table */}
      {!applications || applications.length === 0 ? (
        <Card className="rounded-xl border border-border bg-card">
          <CardContent className="flex flex-col items-center py-16 text-center">
            <Users className="h-8 w-8 text-muted-foreground/60 mb-3" />
            <p className="font-semibold text-foreground text-sm">No applications yet</p>
            <p className="text-xs text-muted-foreground mt-1">
              Applications will appear here once students apply.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <table className="w-full border-collapse text-left text-xs text-foreground min-w-[700px]">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-[10px] uppercase font-semibold text-muted-foreground tracking-wider">
                <th className="p-3 pl-4">Student</th>
                <th className="p-3 hidden md:table-cell">Email</th>
                <th className="p-3 hidden lg:table-cell">Branch</th>
                <th className="p-3 hidden lg:table-cell">Batch</th>
                <th className="p-3">CGPA</th>
                <th className="p-3">Status</th>
                <th className="p-3 pr-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app.applicationId} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                  <td className="p-3 pl-4">
                    <div>
                      <p className="font-semibold text-foreground">{app.fullName}</p>
                      <p className="text-xs text-muted-foreground">{app.rollNumber}</p>
                    </div>
                  </td>
                  <td className="p-3 text-muted-foreground hidden md:table-cell">{app.email}</td>
                  <td className="p-3 text-muted-foreground hidden lg:table-cell">{app.branch}</td>
                  <td className="p-3 text-muted-foreground hidden lg:table-cell">{app.batchYear}</td>
                  <td className="p-3"><span className="font-medium tabular-nums">{app.cgpaAtApplication.toFixed(2)}</span></td>
                  <td className="p-3"><StatusBadge status={app.status} /></td>
                  <td className="p-3 pr-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {REVIEW_STATUSES.map((status) => (
                        <Button
                          key={status}
                          size="xs"
                          variant="outline"
                          disabled={isPublished || updateStatus.isPending || app.status === status}
                          onClick={() =>
                            updateStatus.mutate({ mentorshipId, applicationId: app.applicationId, status })
                          }
                          className="cursor-pointer"
                        >
                          {status === "PROVISIONAL_SELECTED" ? "Select" : "Drop"}
                        </Button>
                      ))}
                      {app.resumeUrl && (
                        <a
                          href={app.resumeUrl}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <Button size="xs" variant="ghost" className="cursor-pointer">
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        </a>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
