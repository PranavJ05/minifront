"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Calendar,
  Clock,
  MapPin,
  Loader2,
  AlertCircle,
  Trash2,
  Pencil,
  Users,
  ExternalLink,
  BookOpen,
  Award,
  ArrowLeft,
  CheckCircle2,
  GraduationCap,
  MessageSquare,
  Send,
} from "lucide-react";

import { useAuth } from "@/contexts/auth-context";
import { isAnyAdmin, isAlumni, isStudent } from "@/lib/roleUtils";
import {
  useMentorshipQuery,
  useMyMentorshipsQuery,
  useMyApplicationsQuery,
  useGetApplicationStatusQuery,
  useGetFinalMenteesQuery,
  useDeleteMentorshipMutation,
  useCancelApplicationMutation,
} from "@/hooks/queries/mentorships";
import { StatusBadge } from "@/components/mentorship/StatusBadge";
import { UpdateFeed } from "@/components/mentorship/UpdateFeed";
import { ApplicationActions } from "@/components/mentorship/ApplicationActions";
import { FeedbackModal } from "@/components/mentorship/FeedbackModal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function MentorshipDetailPage() {
  const params = useParams();
  const router = useRouter();
  const mentorshipId = Number(params.id);
  const { user } = useAuth();
  const roles = user?.roles ?? "";

  const isStudentUser = isStudent(roles);
  const isAlumniUser = isAlumni(roles);
  const isAdminUser = isAnyAdmin(roles);

  const { data: mentorship, isLoading, isError, error } = useMentorshipQuery(mentorshipId);
  const { data: myMentorships } = useMyMentorshipsQuery();
  const { data: applicationStatus } = useGetApplicationStatusQuery(mentorshipId, { enabled: isStudentUser });
  const { data: finalMentees } = useGetFinalMenteesQuery(mentorshipId, { enabled: isAlumniUser });
  const { data: myApplications } = useMyApplicationsQuery({ enabled: isStudentUser });
  const deleteMutation = useDeleteMentorshipMutation();
  const cancelMutation = useCancelApplicationMutation();

  const [feedbackAppId, setFeedbackAppId] = useState<number | null>(null);
  const [selectedAppId, setSelectedAppId] = useState<number | null>(null);
  const [mentorTab, setMentorTab] = useState("applications");

  const isOwner = isAlumniUser && myMentorships?.some((m) => m.id === mentorshipId);
  const applied = applicationStatus?.applied === true;
  const studentStatus = applicationStatus?.status;
  const studentAppId = myApplications?.find((a) => a.mentorshipId === mentorshipId)?.applicationId;

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-8 w-72" />
        <div className="grid sm:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  if (isError || !mentorship) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error instanceof Error ? error.message : "This mentorship doesn't exist or has been removed."}
          </AlertDescription>
        </Alert>
        <Link href="/alumni-mentorship">
          <Button variant="link" className="mt-4 cursor-pointer text-xs">
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Mentorships
          </Button>
        </Link>
      </div>
    );
  }

  // ─── Mentor/Owner View ───────────────────────────────────────
  if (isOwner) {
    const handleDelete = async () => {
      if (!window.confirm("Delete this mentorship?")) return;
      try {
        await deleteMutation.mutateAsync(mentorshipId);
        router.push("/alumni-mentorship");
      } catch {
        // handled
      }
    };

    const activeCount = (finalMentees ?? []).filter((a) => a.status === "CONFIRMED").length;
    const completedCount = (finalMentees ?? []).filter((a) => a.status === "COMPLETED").length;
    const pendingCount = (finalMentees ?? []).filter((a) => a.status === "FINAL_SELECTED").length;

    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <Link
              href="/alumni-mentorship"
              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Mentorships
            </Link>
            <h1 className="text-xl font-semibold tracking-tight text-foreground mt-1">
              {mentorship.title}
            </h1>
            <p className="text-xs text-muted-foreground">{mentorship.domain} &middot; {mentorship.duration}</p>
          </div>
          <div className="flex gap-2">
            <Link href={`/alumni-mentorship/${mentorship.id}/edit`}>
              <Button variant="outline" size="sm" className="cursor-pointer">
                <Pencil className="h-4 w-4" />
                Edit
              </Button>
            </Link>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="cursor-pointer"
            >
              {deleteMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
              Delete
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="rounded-xl border border-border bg-card">
            <CardContent className="flex flex-col gap-1 px-(--card-spacing) py-(--card-spacing)">
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/75">Total Applications</p>
              <p className="text-2xl font-bold text-foreground">{finalMentees?.length ?? 0}</p>
            </CardContent>
          </Card>
          <Card className="rounded-xl border border-border bg-card">
            <CardContent className="flex flex-col gap-1 px-(--card-spacing) py-(--card-spacing)">
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/75">Active</p>
              <p className="text-2xl font-bold text-foreground">{activeCount}</p>
            </CardContent>
          </Card>
          <Card className="rounded-xl border border-border bg-card">
            <CardContent className="flex flex-col gap-1 px-(--card-spacing) py-(--card-spacing)">
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/75">Completed</p>
              <p className="text-2xl font-bold text-foreground">{completedCount}</p>
            </CardContent>
          </Card>
          <Card className="rounded-xl border border-border bg-card">
            <CardContent className="flex flex-col gap-1 px-(--card-spacing) py-(--card-spacing)">
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/75">Pending Response</p>
              <p className="text-2xl font-bold text-foreground">{pendingCount}</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs: Applications | Updates */}
        <Tabs value={mentorTab} onValueChange={setMentorTab}>
          <TabsList className="border border-border bg-muted/40">
            <TabsTrigger value="applications" className="cursor-pointer gap-1.5">
              <Users className="h-4 w-4" />
              Applications
            </TabsTrigger>
            <TabsTrigger value="updates" className="cursor-pointer gap-1.5">
              <MessageSquare className="h-4 w-4" />
              Updates
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Applications Tab */}
        {mentorTab === "applications" && (
          <>
            {!finalMentees || finalMentees.length === 0 ? (
              <Card className="rounded-xl border border-border bg-card">
                <CardContent className="flex flex-col items-center py-12 text-center">
                  <Users className="h-10 w-10 text-muted-foreground/60 mb-3" />
                  <p className="font-semibold text-foreground text-sm">No applications yet</p>
                  <p className="text-xs text-muted-foreground mt-1">Applications will appear here after the deadline passes.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="rounded-lg border border-border bg-card overflow-hidden">
                <table className="w-full border-collapse text-left text-xs text-foreground min-w-[600px]">
                  <thead>
                    <tr className="border-b border-border bg-muted/40 text-[10px] uppercase font-semibold text-muted-foreground tracking-wider">
                      <th className="p-3 pl-4">Student</th>
                      <th className="p-3 hidden md:table-cell">Roll</th>
                      <th className="p-3 hidden lg:table-cell">Branch</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 pr-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {finalMentees.map((app) => (
                      <tr key={app.applicationId} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                        <td className="p-3 pl-4">
                          <p className="font-semibold text-foreground">{app.fullName}</p>
                          <p className="text-xs text-muted-foreground">{app.email}</p>
                        </td>
                        <td className="p-3 text-muted-foreground hidden md:table-cell">{app.rollNumber}</td>
                        <td className="p-3 text-muted-foreground hidden lg:table-cell">{app.branch}</td>
                        <td className="p-3"><StatusBadge status={app.status} /></td>
                        <td className="p-3 pr-4">
                          <div className="flex flex-col gap-1.5 items-start">
                            <ApplicationActions
                              applicationId={app.applicationId}
                              status={app.status}
                              onOpenFeedback={() => setFeedbackAppId(app.applicationId)}
                            />
                            {(app.status === "CONFIRMED" || app.status === "COMPLETED") && (
                              <Button
                                variant="ghost"
                                size="xs"
                                onClick={() => setMentorTab("updates")}
                                className="cursor-pointer text-xs"
                              >
                                <MessageSquare className="h-3 w-3" />
                                Updates
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {feedbackAppId && (
              <FeedbackModal
                applicationId={feedbackAppId}
                isOpen={true}
                onClose={() => setFeedbackAppId(null)}
              />
            )}
          </>
        )}

        {/* Updates Tab */}
        {mentorTab === "updates" && (
          <div className="space-y-4">
            {(!finalMentees || finalMentees.length === 0) ? (
              <Card className="rounded-xl border border-border bg-card">
                <CardContent className="flex flex-col items-center py-12 text-center">
                  <MessageSquare className="h-10 w-10 text-muted-foreground/60 mb-3" />
                  <p className="font-semibold text-foreground text-sm">No mentees yet</p>
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="max-w-xs">
                  <Select
                    value={selectedAppId?.toString() ?? ""}
                    onValueChange={(v) => setSelectedAppId(Number(v))}
                  >
                    <SelectTrigger className="h-9 text-xs">
                      <SelectValue placeholder="Select a student..." />
                    </SelectTrigger>
                    <SelectContent>
                      {(finalMentees ?? [])
                        .filter((a) => a.status === "CONFIRMED" || a.status === "COMPLETED")
                        .map((app) => (
                          <SelectItem key={app.applicationId} value={app.applicationId.toString()}>
                            {app.fullName} — {app.rollNumber}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedAppId ? (
                  <Card className="rounded-xl border border-border bg-card">
                    <CardContent className="px-(--card-spacing) py-(--card-spacing)">
                      <UpdateFeed applicationId={selectedAppId} isMentor={true} initiallyOpen={true} />
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="rounded-xl border border-border bg-card">
                    <CardContent className="flex flex-col items-center py-12 text-center">
                      <Send className="h-10 w-10 text-muted-foreground/60 mb-3" />
                      <p className="text-sm text-muted-foreground">Select a student to view their updates</p>
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </div>
        )}
      </div>
    );
  }

  // ─── Admin View ──────────────────────────────────────────────
  if (isAdminUser) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <Link
          href="/alumni-mentorship"
          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Mentorships
        </Link>

        <div className="space-y-1">
          <h1 className="text-xl font-semibold tracking-tight text-foreground">{mentorship.title}</h1>
          <p className="text-xs text-muted-foreground">{mentorship.domain} &middot; {mentorship.duration}</p>
        </div>

        <div className="grid sm:grid-cols-4 gap-4">
          <Card className="rounded-xl border border-border bg-card">
            <CardContent className="flex items-center gap-3 px-(--card-spacing) py-(--card-spacing)">
              <Clock className="h-5 w-5 text-muted-foreground/60" />
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/75">Duration</p>
                <p className="text-sm font-semibold text-foreground">{mentorship.duration}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-xl border border-border bg-card">
            <CardContent className="flex items-center gap-3 px-(--card-spacing) py-(--card-spacing)">
              <MapPin className="h-5 w-5 text-muted-foreground/60" />
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/75">Mode</p>
                <p className="text-sm font-semibold text-foreground">{mentorship.mode}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-xl border border-border bg-card">
            <CardContent className="flex items-center gap-3 px-(--card-spacing) py-(--card-spacing)">
              <Award className="h-5 w-5 text-muted-foreground/60" />
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/75">Experience</p>
                <p className="text-sm font-semibold text-foreground">{mentorship.yearsOfExperience} yr{mentorship.yearsOfExperience !== 1 ? "s" : ""}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-xl border border-border bg-card">
            <CardContent className="flex items-center gap-3 px-(--card-spacing) py-(--card-spacing)">
              <Users className="h-5 w-5 text-muted-foreground/60" />
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/75">Slots</p>
                <p className="text-sm font-semibold text-foreground">{mentorship.maxMentees}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-foreground">Description</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">{mentorship.description}</p>
        </div>

        <Link href={`/alumni-mentorship/${mentorship.id}/applications`}>
          <Button className="cursor-pointer">
            <ExternalLink className="h-4 w-4" />
            View & Review Applications
          </Button>
        </Link>
      </div>
    );
  }

  // ─── Student View (with application) ─────────────────────────
  if (isStudentUser && applied && studentStatus) {
    const handleCancel = async () => {
      if (!window.confirm("Cancel your application?")) return;
      try {
        await cancelMutation.mutateAsync(mentorshipId);
      } catch {
        // handled
      }
    };

    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <Link
          href="/alumni-mentorship"
          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Mentorships
        </Link>

        <h1 className="text-xl font-semibold tracking-tight text-foreground">{mentorship.title}</h1>
        <p className="text-xs text-muted-foreground -mt-4">{mentorship.domain} &middot; {mentorship.duration}</p>

        {/* Status Card — prominent */}
        <Card className="rounded-xl border-border bg-card overflow-hidden">
          <div className="border-l-4 border-l-primary px-(--card-spacing) py-(--card-spacing) space-y-3">
            <StatusBadge status={studentStatus} />
            <p className="text-sm text-muted-foreground leading-relaxed">
              {studentStatus === "APPLIED" && "Your application has been submitted. You'll hear back after the deadline closes."}
              {studentStatus === "PROVISIONAL_SELECTED" && "You've been shortlisted! The mentor will make final selections after the deadline."}
              {studentStatus === "FINAL_SELECTED" && "Congratulations! You've been selected. Waiting for the mentor to confirm the match."}
              {studentStatus === "NOT_SELECTED" && "Thank you for your interest. You weren't selected this time — don't give up!"}
              {studentStatus === "CONFIRMED" && "Mentorship started! Your mentor will guide you through this journey. Keep in touch through updates."}
              {studentStatus === "COMPLETED" && "Mentorship completed! Share your feedback about the experience."}
              {studentStatus === "DECLINED_BY_MENTOR" && "The mentor was unable to proceed. ARC will reach out to you about alternatives."}
            </p>
            <div className="flex items-center gap-3 text-xs text-muted-foreground/75">
              {studentStatus === "APPLIED" && (
                <Button variant="destructive" size="sm" onClick={handleCancel} disabled={cancelMutation.isPending} className="cursor-pointer">
                  Cancel Application
                </Button>
              )}
              {studentStatus === "COMPLETED" && (
                <Button variant="secondary" size="sm" onClick={() => setFeedbackAppId(studentAppId ?? 0)} className="cursor-pointer">
                  Submit Feedback
                </Button>
              )}
              {studentStatus === "NOT_SELECTED" && (
                <Link href="/alumni-mentorship">
                  <Button variant="outline" size="sm" className="cursor-pointer">
                    Browse other mentorships
                  </Button>
                </Link>
              )}
              {studentStatus === "DECLINED_BY_MENTOR" && (
                <a href="mailto:arc@mec.ac.in">
                  <Button variant="outline" size="sm" className="cursor-pointer">
                    Contact ARC
                  </Button>
                </a>
              )}
            </div>
          </div>
        </Card>

        {/* Info Mini-Cards */}
        <div className="grid sm:grid-cols-4 gap-4">
          <Card className="rounded-xl border border-border bg-card">
            <CardContent className="flex items-center gap-3 px-(--card-spacing) py-(--card-spacing)">
              <Clock className="h-5 w-5 text-muted-foreground/60" />
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/75">Duration</p>
                <p className="text-sm font-semibold text-foreground">{mentorship.duration}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-xl border border-border bg-card">
            <CardContent className="flex items-center gap-3 px-(--card-spacing) py-(--card-spacing)">
              <MapPin className="h-5 w-5 text-muted-foreground/60" />
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/75">Mode</p>
                <p className="text-sm font-semibold text-foreground">{mentorship.mode}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-xl border border-border bg-card">
            <CardContent className="flex items-center gap-3 px-(--card-spacing) py-(--card-spacing)">
              <GraduationCap className="h-5 w-5 text-muted-foreground/60" />
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/75">Mentor Experience</p>
                <p className="text-sm font-semibold text-foreground">{mentorship.yearsOfExperience} yr{mentorship.yearsOfExperience !== 1 ? "s" : ""}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-xl border border-border bg-card">
            <CardContent className="flex items-center gap-3 px-(--card-spacing) py-(--card-spacing)">
              <Users className="h-5 w-5 text-muted-foreground/60" />
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/75">Slots</p>
                <p className="text-sm font-semibold text-foreground">{mentorship.maxMentees}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Description */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-foreground">About this Mentorship</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">{mentorship.description}</p>
        </div>

        <div className="flex flex-wrap gap-1">
          {mentorship.expertise.split(",").map((tag) => (
            <Badge key={tag.trim()} variant="outline" className="text-[10px] font-normal">
              {tag.trim()}
            </Badge>
          ))}
        </div>

        {/* Updates Feed */}
        {(studentStatus === "CONFIRMED" || studentStatus === "COMPLETED") && studentAppId && (
          <Card className="rounded-xl border border-border bg-card">
            <CardContent className="px-(--card-spacing) py-(--card-spacing)">
              <UpdateFeed applicationId={studentAppId} isMentor={false} initiallyOpen={true} />
            </CardContent>
          </Card>
        )}

        {feedbackAppId !== null && studentAppId && (
          <FeedbackModal
            applicationId={studentAppId}
            isOpen={true}
            onClose={() => setFeedbackAppId(null)}
          />
        )}
      </div>
    );
  }

  // ─── Default View (not applied or not student) ───────────────
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <Link
        href="/alumni-mentorship"
        className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Mentorships
      </Link>

      <div className="space-y-1">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">{mentorship.title}</h1>
        <p className="text-xs text-muted-foreground">{mentorship.domain} &middot; {mentorship.duration} &middot; {mentorship.mode}</p>
      </div>

        {/* Info Mini-Cards */}
        <div className="grid sm:grid-cols-4 gap-4">
          <Card className="rounded-xl border border-border bg-card">
            <CardContent className="flex items-center gap-3 px-(--card-spacing) py-(--card-spacing)">
              <Clock className="h-5 w-5 text-muted-foreground/60" />
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/75">Duration</p>
                <p className="text-sm font-semibold text-foreground">{mentorship.duration}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-xl border border-border bg-card">
            <CardContent className="flex items-center gap-3 px-(--card-spacing) py-(--card-spacing)">
              <MapPin className="h-5 w-5 text-muted-foreground/60" />
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/75">Mode</p>
                <p className="text-sm font-semibold text-foreground">{mentorship.mode}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-xl border border-border bg-card">
            <CardContent className="flex items-center gap-3 px-(--card-spacing) py-(--card-spacing)">
              <Award className="h-5 w-5 text-muted-foreground/60" />
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/75">Experience</p>
                <p className="text-sm font-semibold text-foreground">{mentorship.yearsOfExperience} yr{mentorship.yearsOfExperience !== 1 ? "s" : ""}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-xl border border-border bg-card">
            <CardContent className="flex items-center gap-3 px-(--card-spacing) py-(--card-spacing)">
              <Users className="h-5 w-5 text-muted-foreground/60" />
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/75">Slots</p>
                <p className="text-sm font-semibold text-foreground">{mentorship.maxMentees}</p>
              </div>
            </CardContent>
          </Card>
        </div>

      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-foreground">Description</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">{mentorship.description}</p>
      </div>

      <div className="flex items-start gap-2 text-xs text-muted-foreground">
        <BookOpen className="h-3.5 w-3.5 shrink-0 mt-0.5" />
        <div className="flex flex-wrap gap-1">
          {mentorship.expertise.split(",").map((tag) => (
            <Badge key={tag.trim()} variant="outline" className="text-[10px] font-normal">
              {tag.trim()}
            </Badge>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Calendar className="h-3.5 w-3.5 shrink-0" />
        <span>Deadline: {new Date(mentorship.applicationDeadline).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</span>
      </div>

      {isStudentUser && !applied && mentorship.applicationOpen && (
        <Link href={`/alumni-mentorship/${mentorship.id}/apply`}>
          <Button className="cursor-pointer">
            <CheckCircle2 className="h-4 w-4" />
            Apply Now
          </Button>
        </Link>
      )}

      {isStudentUser && !mentorship.applicationOpen && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Applications are closed for this mentorship.</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
