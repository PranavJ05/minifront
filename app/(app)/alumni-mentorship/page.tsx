"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/contexts/auth-context";
import { isAlumni, isStudent } from "@/lib/roleUtils";
import {
  useMentorshipsQuery,
  useMyMentorshipsQuery,
  useMyApplicationsQuery,
} from "@/hooks/queries/mentorships";
import { StatusBadge } from "@/components/mentorship/StatusBadge";
import { DOMAINS, type Mentorship, type MyApplication } from "@/lib/types/mentorship";
import {
  Plus,
  Search,
  Briefcase,
  AlertCircle,
  Users,
  Clock,
  CalendarClock,
  CheckCircle2,
  ArrowRight,
  Award,
} from "lucide-react";

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

const daysUntil = (value: string) =>
  Math.ceil((new Date(value).getTime() - Date.now()) / (1000 * 60 * 60 * 24));

export default function MentorshipPage() {
  const { user } = useAuth();
  const roles = user?.roles ?? "";
  const alumni = isAlumni(roles);
  const student = isStudent(roles);

  const [tab, setTab] = useState("browse");
  const [mineView, setMineView] = useState<"created" | "applications">(alumni ? "created" : "applications");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");

  const { data: mentorships, isLoading, isError, error } = useMentorshipsQuery();
  const { data: myMentorships } = useMyMentorshipsQuery();
  const { data: myApplications } = useMyApplicationsQuery({ enabled: student });

  const appliedIds = useMemo(
    () => new Set((myApplications ?? []).map((a) => a.mentorshipId)),
    [myApplications]
  );

  const filtered = useMemo(() => {
    if (!mentorships) return [];
    return mentorships.filter((m) => {
      const matchSearch =
        m.title.toLowerCase().includes(search.toLowerCase()) ||
        m.domain.toLowerCase().includes(search.toLowerCase());
      const matchDomain = filter === "ALL" || m.domain === filter;
      return matchSearch && matchDomain;
    });
  }, [mentorships, search, filter]);

  return (
    <div className="w-full px-4 sm:px-6 pb-6 space-y-6">
      {/* Sticky Header */}
      <div className="sticky top-14 z-30 bg-background/95 backdrop-blur-md py-4 border-b border-border/40 -mx-4 sm:-mx-6 px-4 sm:px-6 space-y-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="space-y-1">
            <h1 className="text-xl font-semibold tracking-tight text-foreground">Alumni Mentorship</h1>
            <p className="text-xs text-muted-foreground">Learn directly from experienced alumni.</p>
          </div>
          {alumni && (
            <Link href="/alumni-mentorship/create">
              <Button className="cursor-pointer">
                <Plus className="h-4 w-4" />
                Create Mentorship
              </Button>
            </Link>
          )}
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList className="h-8 p-0.5 border border-border bg-muted/40">
              <TabsTrigger value="browse" className="h-7 text-xs px-3 cursor-pointer">
                Browse
              </TabsTrigger>
              <TabsTrigger value="mine" className="h-7 text-xs px-3 cursor-pointer">
                My Mentorships
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {tab === "browse" && (
            <div className="flex gap-3 items-center">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/60" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by title or domain..."
                  className="h-8 pl-8 text-xs bg-muted/30 border-border w-[200px] md:w-[240px] focus-visible:ring-1"
                />
              </div>
              <Select value={filter} onValueChange={(v) => v && setFilter(v)}>
                <SelectTrigger className="h-8 w-[150px] text-xs">
                  <SelectValue placeholder="All Domains" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Domains</SelectItem>
                  {DOMAINS.map((d) => (
                    <SelectItem key={d} value={d}>{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </div>

      {/* Browse Tab */}
      {tab === "browse" && (
        <>
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-[220px] rounded-2xl" />
              ))}
            </div>
          ) : isError ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {error instanceof Error ? error.message : "Failed to load mentorships."}
              </AlertDescription>
            </Alert>
          ) : filtered.length === 0 ? (
            <EmptyState
              icon={Briefcase}
              title="No mentorships found"
              subtitle="Try adjusting your search or filters."
            />
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((m) => (
                <MentorshipCard key={m.id} mentorship={m} applied={appliedIds.has(m.id)} />
              ))}
            </div>
          )}
        </>
      )}

      {/* My Mentorships Tab */}
      {tab === "mine" && (
        <div className="space-y-4">
          {alumni && (
            <Tabs value={mineView} onValueChange={(v) => setMineView(v as typeof mineView)}>
              <TabsList className="h-8 p-0.5 border border-border bg-muted/40">
                <TabsTrigger value="created" className="h-7 text-xs px-3 cursor-pointer gap-1.5">
                  <Users className="h-3.5 w-3.5" />
                  Created by You
                </TabsTrigger>
                <TabsTrigger value="applications" className="h-7 text-xs px-3 cursor-pointer gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  My Applications
                </TabsTrigger>
              </TabsList>
            </Tabs>
          )}

          {(!alumni || mineView === "created") && alumni && (
            <section>
              {!myMentorships || myMentorships.length === 0 ? (
                <EmptyState
                  icon={Users}
                  title="Nothing created yet"
                  subtitle="Post a mentorship to start mentoring students."
                />
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {myMentorships.map((m) => (
                    <MyMentorshipCard key={m.id} mentorship={m} />
                  ))}
                </div>
              )}
            </section>
          )}

          {(!alumni || mineView === "applications") && (
            <section>
              {!myApplications || myApplications.length === 0 ? (
                <EmptyState
                  icon={Clock}
                  title="No applications yet"
                  subtitle="Browse open mentorships and apply to get started."
                />
              ) : (
                <ApplicationsTable applications={myApplications} />
              )}
            </section>
          )}
        </div>
      )}
    </div>
  );
}

function EmptyState({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: typeof Briefcase;
  title: string;
  subtitle: string;
}) {
  return (
    <Card className="rounded-xl border border-border bg-card">
      <CardContent className="flex flex-col items-center py-16 text-center">
        <Icon className="h-8 w-8 text-muted-foreground/60 mb-3" />
        <p className="font-semibold text-foreground text-sm">{title}</p>
        <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
      </CardContent>
    </Card>
  );
}

function DeadlineBadge({ mentorship }: { mentorship: Mentorship }) {
  if (!mentorship.applicationOpen) {
    return (
      <Badge variant="outline" className="text-[10px] font-semibold">
        Closed
      </Badge>
    );
  }
  const days = daysUntil(mentorship.applicationDeadline);
  if (days <= 3) {
    return (
      <Badge variant="destructive" className="text-[10px] font-semibold">
        {days <= 0 ? "Closes today" : `${days}d left`}
      </Badge>
    );
  }
  return (
    <Badge variant="secondary" className="text-[10px] font-semibold">
      {days}d left
    </Badge>
  );
}

function MentorshipCard({ mentorship, applied }: { mentorship: Mentorship; applied: boolean }) {
  return (
    <div className="bg-card text-card-foreground rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col overflow-hidden">
      <div className="px-4 pt-4 pb-2 flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          {applied && (
            <CheckCircle2 className="h-4 w-4 shrink-0 text-primary mt-0.5" />
          )}
          <h3 className="font-semibold text-sm leading-snug text-foreground line-clamp-2 min-w-0">
            {mentorship.title}
          </h3>
        </div>
        {applied ? (
          <StatusBadge status="APPLIED" />
        ) : (
          <DeadlineBadge mentorship={mentorship} />
        )}
      </div>

      <div className="px-4 pb-3">
        <p className="text-xs text-muted-foreground">
          {mentorship.domain} &middot; {mentorship.mode} &middot; {mentorship.duration}
        </p>
      </div>

      <div className="flex flex-col gap-2 px-4 pb-3 flex-1">
        <div className="flex flex-wrap gap-1">
          {mentorship.expertise.split(",").map((tag) => (
            <Badge key={tag.trim()} variant="outline" className="text-[10px] font-normal">
              {tag.trim()}
            </Badge>
          ))}
        </div>

        <div className="flex items-center gap-3 text-[10px] text-muted-foreground/70">
          <span className="flex items-center gap-1">
            <Award className="h-3 w-3" />
            {mentorship.yearsOfExperience} yr{mentorship.yearsOfExperience !== 1 ? "s" : ""} exp
          </span>
          <span className="flex items-center gap-1">
            <CalendarClock className="h-3 w-3" />
            {formatDate(mentorship.applicationDeadline)}
          </span>
        </div>
      </div>

      <div className="px-4 pb-4 pt-2 border-t border-border mt-auto">
        <Link href={`/alumni-mentorship/${mentorship.id}`}>
          <Button variant="secondary" size="sm" className="w-full cursor-pointer text-xs">
            {applied ? "View Application" : "View Details"}
            <ArrowRight className="h-3 w-3" />
          </Button>
        </Link>
      </div>
    </div>
  );
}

function MyMentorshipCard({ mentorship }: { mentorship: Mentorship }) {
  return (
    <Card className="rounded-2xl border border-border bg-card shadow-sm flex flex-col">
      <CardContent className="flex flex-col gap-3 px-(--card-spacing) py-(--card-spacing) flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-sm leading-snug text-foreground line-clamp-1">
            {mentorship.title}
          </h3>
          <Badge variant={mentorship.applicationOpen ? "secondary" : "outline"} className="shrink-0">
            {mentorship.applicationOpen ? "Active" : "Closed"}
          </Badge>
        </div>

        <p className="text-xs text-muted-foreground">
          {mentorship.domain} &middot; {mentorship.mode} &middot; {mentorship.duration}
        </p>

        <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
          <CalendarClock className="h-3 w-3 shrink-0" />
          <span>Deadline: {formatDate(mentorship.applicationDeadline)}</span>
        </div>

        {mentorship.finalListVisibleToMentor && (
          <span className="inline-flex items-center gap-1 text-[10px] font-medium text-primary w-fit">
            <CheckCircle2 className="h-3 w-3" />
            Final list published
          </span>
        )}

        <Link href={`/alumni-mentorship/${mentorship.id}`} className="mt-auto">
          <Button variant="secondary" size="sm" className="w-full cursor-pointer text-xs">
            Manage
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

function ApplicationsTable({ applications }: { applications: MyApplication[] }) {
  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <table className="w-full border-collapse text-left text-xs text-foreground min-w-[640px]">
        <thead>
          <tr className="border-b border-border bg-muted/40 text-[10px] uppercase font-semibold text-muted-foreground tracking-wider">
            <th className="p-3 pl-4">Mentorship</th>
            <th className="p-3">Mentor</th>
            <th className="p-3">Status</th>
            <th className="p-3">Timeline</th>
            <th className="p-3 pr-4 text-right">Action</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((app) => (
            <tr key={app.applicationId} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
              <td className="p-3 pl-4 font-semibold text-foreground">
                <span className="line-clamp-1">{app.mentorshipTitle}</span>
              </td>
              <td className="p-3 text-muted-foreground">{app.mentorName}</td>
              <td className="p-3">
                <StatusBadge status={app.status} />
              </td>
              <td className="p-3 text-muted-foreground">
                <div className="flex flex-col gap-0.5">
                  <span>Applied {formatDate(app.appliedAt)}</span>
                  {app.confirmedAt && (
                    <span className="text-[10px] text-muted-foreground/75">
                      Started {formatDate(app.confirmedAt)}
                    </span>
                  )}
                  {app.completedAt && (
                    <span className="text-[10px] text-muted-foreground/75">
                      Completed {formatDate(app.completedAt)}
                    </span>
                  )}
                </div>
              </td>
              <td className="p-3 pr-4 text-right">
                {app.status === "NOT_SELECTED" || app.status === "DROPPED_OUT" ? (
                  <Link href="/alumni-mentorship">
                    <Button variant="outline" size="sm" className="cursor-pointer text-xs">
                      Browse more
                    </Button>
                  </Link>
                ) : (
                  <Link href={`/alumni-mentorship/${app.mentorshipId}`}>
                    <Button variant="outline" size="sm" className="cursor-pointer text-xs">
                      View
                    </Button>
                  </Link>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
