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
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/contexts/auth-context";
import { isAlumni, isStudent, isFaculty } from "@/lib/roleUtils";
import {
  useMentorshipsQuery,
  useMyMentorshipsQuery,
  useMyApplicationsQuery,
} from "@/hooks/queries/mentorships";
import { StatusBadge } from "@/components/mentorship/StatusBadge";
import {
  DOMAINS,
  type Mentorship,
  type MentorshipMode,
} from "@/lib/types/mentorship";
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
  ArrowUpDown,
  LayoutGrid,
  List,
  SlidersHorizontal,
  X,
  Laptop,
  Award,
} from "lucide-react";

type MentorshipPhase = "open" | "closing-soon" | "under-review" | "active" | "closed";

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

const daysUntil = (value: string) =>
  Math.ceil((new Date(value).getTime() - Date.now()) / (1000 * 60 * 60 * 24));

const normalizeMode = (mode: string) =>
  mode.charAt(0) + mode.slice(1).toLowerCase();

function getPhase(m: Mentorship): MentorshipPhase {
  if (m.finalListVisibleToMentor) return "active";
  const days = daysUntil(m.applicationDeadline);
  if (!m.applicationOpen) return "under-review";
  if (days <= 0) return "closed";
  if (days <= 3) return "closing-soon";
  return "open";
}

const phaseOrder: Record<MentorshipPhase, number> = {
  open: 0,
  "closing-soon": 0,
  "under-review": 1,
  active: 2,
  closed: 3,
};

const phaseLabel: Record<MentorshipPhase, string> = {
  open: "Open",
  "closing-soon": "Closing Soon",
  "under-review": "Under Review",
  active: "Active",
  closed: "Closed",
};

const phaseVariant: Record<MentorshipPhase, "default" | "secondary" | "destructive" | "outline"> = {
  open: "secondary",
  "closing-soon": "destructive",
  "under-review": "outline",
  active: "default",
  closed: "outline",
};

export default function MentorshipPage() {
  const { user } = useAuth();
  const roles = user?.roles ?? "";
  const alumni = isAlumni(roles);
  const student = isStudent(roles);
  const faculty = isFaculty(roles);

  const [tab, setTab] = useState("browse");
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"card" | "table">("card");
  const [filters, setFilters] = useState({
    domains: [] as string[],
    modes: [] as MentorshipMode[],
    sort: "status" as "status" | "deadline-newest" | "deadline-oldest" | "alpha",
  });
  const [filterOpen, setFilterOpen] = useState(false);

  const { data: mentorships, isLoading, isError, error } = useMentorshipsQuery();
  const { data: myMentorships } = useMyMentorshipsQuery();
  const { data: myApplications } = useMyApplicationsQuery({ enabled: student });

  const appliedIds = useMemo(
    () => new Set((myApplications ?? []).map((a) => a.mentorshipId)),
    [myApplications],
  );

  const activeFilterCount =
    filters.domains.length + filters.modes.length;

  const filtered = useMemo(() => {
    if (!mentorships) return [];
    return mentorships
      .filter((m) => {
        if (search) {
          const q = search.toLowerCase();
          if (
            !m.title.toLowerCase().includes(q) &&
            !m.domain.toLowerCase().includes(q)
          )
            return false;
        }
        if (filters.domains.length > 0 && !filters.domains.includes(m.domain))
          return false;
        if (filters.modes.length > 0 && !filters.modes.includes(m.mode))
          return false;
        return true;
      })
      .sort((a, b) => {
        if (filters.sort === "alpha") return a.title.localeCompare(b.title);
        if (filters.sort === "deadline-newest")
          return new Date(b.applicationDeadline).getTime() - new Date(a.applicationDeadline).getTime();
        if (filters.sort === "deadline-oldest")
          return new Date(a.applicationDeadline).getTime() - new Date(b.applicationDeadline).getTime();
        const pa = phaseOrder[getPhase(a)];
        const pb = phaseOrder[getPhase(b)];
        if (pa !== pb) return pa - pb;
        return a.title.localeCompare(b.title);
      });
  }, [mentorships, search, filters]);

  const description = faculty
    ? "Explore mentorship opportunities available to students across the network. Review listings, track participation, and support the bridge between academia and industry."
    : student
      ? "Find the perfect mentor to guide your career path. Browse mentorship opportunities from experienced alumni across diverse domains, apply to the ones that match your interests, and track your applications — all in one place."
      : alumni
        ? "Share your expertise and shape the next generation of professionals. Create mentorship listings to guide students in your field, browse opportunities your peers are offering, and track your ongoing mentorships — all from one place."
        : "Connect with mentors and mentees across the alumni community.";

  const resetFilters = () => {
    setFilters({ domains: [], modes: [], sort: "status" });
    setFilterOpen(false);
  };

  const toggleDomainFilter = (d: string) => {
    setFilters((prev) => ({
      ...prev,
      domains: prev.domains.includes(d)
        ? prev.domains.filter((x) => x !== d)
        : [...prev.domains, d],
    }));
  };

  const toggleModeFilter = (m: MentorshipMode) => {
    setFilters((prev) => ({
      ...prev,
      modes: prev.modes.includes(m)
        ? prev.modes.filter((x) => x !== m)
        : [...prev.modes, m],
    }));
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Centered Header */}
      <div className="max-w-2xl mx-auto text-center space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Alumni Mentorship
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-prose mx-auto">
          {description}
        </p>
      </div>

      {/* Centered Tabs */}
      <div className="flex justify-center">
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="h-9 p-0.5 border border-border bg-muted/40">
            <TabsTrigger value="browse" className="h-8 text-xs px-4 cursor-pointer font-medium">
              Browse
            </TabsTrigger>
            {!faculty && (
              <TabsTrigger value="mine" className="h-8 text-xs px-4 cursor-pointer font-medium">
                My Mentorship
              </TabsTrigger>
            )}
          </TabsList>
        </Tabs>
      </div>

      {/* Toolbar (Browse tab only) */}
      {tab === "browse" && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-center gap-3 max-w-4xl mx-auto flex-wrap">
          {/* Search */}
          <div className="relative flex-1 min-w-0 max-w-[260px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title or domain..."
              className="h-9 pl-9 text-xs"
            />
          </div>

          {/* Filters Popover */}
          <Popover open={filterOpen} onOpenChange={setFilterOpen}>
            <PopoverTrigger
              render={
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 text-xs gap-1.5 cursor-pointer relative"
                >
                  <SlidersHorizontal className="h-3.5 w-3.5" />
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="bg-primary text-primary-foreground text-[10px] font-semibold rounded-full w-4 h-4 flex items-center justify-center">
                      {activeFilterCount}
                    </span>
                  )}
                </Button>
              }
            />
            <PopoverContent align="end" className="w-72 p-4 space-y-4">
              {/* Domain */}
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-foreground">Domain</Label>
                <div className="relative mb-1">
                  <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground/60" />
                  <Input
                    placeholder="Search domains..."
                    className="h-7 pl-7 text-xs bg-muted/30"
                    onChange={(e) => {
                      const q = e.target.value.toLowerCase();
                      document.querySelectorAll<HTMLLabelElement>("[data-domain-filter]").forEach((el) => {
                        el.style.display = el.textContent?.toLowerCase().includes(q) ? "" : "none";
                      });
                    }}
                  />
                </div>
                <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1">
                  {DOMAINS.map((d) => (
                    <label
                      key={d}
                      data-domain-filter
                      className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                    >
                      <Checkbox
                        checked={filters.domains.includes(d)}
                        onCheckedChange={() => toggleDomainFilter(d)}
                        className="h-3.5 w-3.5"
                      />
                      {d}
                    </label>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Mode */}
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-foreground">Mode</Label>
                <div className="flex gap-2">
                  {(["ONLINE", "OFFLINE", "HYBRID"] as MentorshipMode[]).map((m) => (
                    <Button
                      key={m}
                      variant={filters.modes.includes(m) ? "secondary" : "outline"}
                      size="sm"
                      onClick={() => toggleModeFilter(m)}
                      className="h-7 text-xs px-2.5 cursor-pointer flex-1"
                    >
                      {normalizeMode(m)}
                    </Button>
                  ))}
                </div>
              </div>

              <Separator />

              <Button
                variant="ghost"
                size="sm"
                onClick={resetFilters}
                className="w-full h-7 text-xs cursor-pointer"
              >
                Reset filters
              </Button>
            </PopoverContent>
          </Popover>

          {/* Sort Select (standalone) */}
          <Select
            value={filters.sort}
            onValueChange={(v) =>
              setFilters((prev) => ({
                ...prev,
                sort: v as typeof filters.sort,
              }))
            }
          >
            <SelectTrigger className="h-9 text-xs w-[150px]">
              <ArrowUpDown className="h-3.5 w-3.5 mr-1.5 shrink-0 text-muted-foreground/60" />
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="status" className="text-xs">
                Default (by phase)
              </SelectItem>
              <SelectItem value="alpha" className="text-xs">
                Alphabetical
              </SelectItem>
              <SelectItem value="deadline-newest" className="text-xs">
                Deadline (newest)
              </SelectItem>
              <SelectItem value="deadline-oldest" className="text-xs">
                Deadline (oldest)
              </SelectItem>
            </SelectContent>
          </Select>

          {/* View Switcher */}
          <div className="flex items-center border border-border rounded-lg p-0.5 h-9 bg-muted/40">
            <Button
              variant={viewMode === "card" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => setViewMode("card")}
              className="h-7 w-7 p-0 cursor-pointer"
              title="Grid View"
            >
              <LayoutGrid className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant={viewMode === "table" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => setViewMode("table")}
              className="h-7 w-7 p-0 cursor-pointer"
              title="Table View"
            >
              <List className="h-3.5 w-3.5" />
            </Button>
          </div>

          {/* Create Button (alumni only) */}
          {alumni && (
            <Link href="/alumni-mentorship/create">
              <Button className="h-9 text-xs gap-1.5 cursor-pointer">
                <Plus className="h-4 w-4" />
                Create
              </Button>
            </Link>
          )}
        </div>
      )}

      {/* Active filter chips */}
      {tab === "browse" && activeFilterCount > 0 && (
        <div className="flex flex-wrap items-center justify-center gap-1.5">
          {filters.domains.map((d) => (
            <Badge
              key={d}
              variant="secondary"
              className="text-[10px] font-normal gap-1 pl-2 pr-1.5 py-0.5 cursor-pointer"
              onClick={() => toggleDomainFilter(d)}
            >
              {d}
              <X className="h-2.5 w-2.5" />
            </Badge>
          ))}
          {filters.modes.map((m) => (
            <Badge
              key={m}
              variant="secondary"
              className="text-[10px] font-normal gap-1 pl-2 pr-1.5 py-0.5 cursor-pointer"
              onClick={() => toggleModeFilter(m)}
            >
              {normalizeMode(m)}
              <X className="h-2.5 w-2.5" />
            </Badge>
          ))}
        </div>
      )}

      {/* Browse Tab Content */}
      {tab === "browse" && (
        <>
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-[260px] rounded-2xl" />
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
            <Card className="rounded-xl border border-border bg-card">
              <CardContent className="flex flex-col items-center py-16 text-center">
                <Briefcase className="h-8 w-8 text-muted-foreground/60 mb-3" />
                <p className="font-semibold text-foreground text-sm">
                  No mentorships found
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Try adjusting your search or filters.
                </p>
              </CardContent>
            </Card>
          ) : viewMode === "card" ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((m) => (
                <MentorshipCard
                  key={m.id}
                  mentorship={m}
                  applied={appliedIds.has(m.id)}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-border bg-card overflow-hidden">
              <table className="w-full border-collapse text-left text-xs text-foreground min-w-[500px]">
                <thead>
                  <tr className="border-b border-border bg-muted/40 text-[10px] uppercase font-semibold text-muted-foreground tracking-wider">
                    <th className="p-3 pl-4">Title</th>
                    <th className="p-3">Domain</th>
                    <th className="p-3">Deadline</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 pr-4">Mode</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((m) => {
                    const phase = getPhase(m);
                    return (
                      <tr
                        key={m.id}
                        className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors"
                      >
                        <td className="p-3 pl-4">
                          <Link
                            href={`/alumni-mentorship/${m.id}`}
                            className="font-semibold text-foreground hover:text-primary transition-colors line-clamp-1"
                          >
                            {m.title}
                          </Link>
                        </td>
                        <td className="p-3 text-muted-foreground">{m.domain}</td>
                        <td className="p-3 text-muted-foreground">
                          {formatDate(m.applicationDeadline)}
                        </td>
                        <td className="p-3">
                          <PhaseBadge phase={phase} />
                        </td>
                        <td className="p-3 pr-4 text-muted-foreground">
                          {normalizeMode(m.mode)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* My Mentorship Tab */}
      {tab === "mine" && !faculty && (
        <div className="space-y-6 max-w-4xl mx-auto">
          {/* Alumni: Created by You */}
          {alumni && (
            <section>
              <h2 className="text-sm font-semibold text-foreground mb-4">Created by You</h2>
              {!myMentorships || myMentorships.length === 0 ? (
                <Card className="rounded-xl border border-border bg-card">
                  <CardContent className="flex flex-col items-center py-16 text-center">
                    <Users className="h-8 w-8 text-muted-foreground/60 mb-3" />
                    <p className="font-semibold text-foreground text-sm">
                      Nothing created yet
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Post a mentorship to start mentoring students.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {myMentorships.map((m) => (
                    <MyMentorshipCard key={m.id} mentorship={m} />
                  ))}
                </div>
              )}
            </section>
          )}

          {/* Student: My Applications */}
          {student && (
            <section>
              <h2 className="text-sm font-semibold text-foreground mb-4">My Applications</h2>
              {!myApplications || myApplications.length === 0 ? (
                <Card className="rounded-xl border border-border bg-card">
                  <CardContent className="flex flex-col items-center py-16 text-center">
                    <Clock className="h-8 w-8 text-muted-foreground/60 mb-3" />
                    <p className="font-semibold text-foreground text-sm">
                      No applications yet
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Browse open mentorships and apply to get started.
                    </p>
                  </CardContent>
                </Card>
              ) : (
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
                      {myApplications.map((app) => (
                        <tr
                          key={app.applicationId}
                          className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors"
                        >
                          <td className="p-3 pl-4 font-semibold text-foreground">
                            <span className="line-clamp-1">
                              {app.mentorshipTitle}
                            </span>
                          </td>
                          <td className="p-3 text-muted-foreground">
                            {app.mentorName}
                          </td>
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
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="cursor-pointer text-xs"
                                >
                                  Browse more
                                </Button>
                              </Link>
                            ) : (
                              <Link
                                href={`/alumni-mentorship/${app.mentorshipId}`}
                              >
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="cursor-pointer text-xs"
                                >
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
              )}
            </section>
          )}
        </div>
      )}
    </div>
  );
}

function PhaseBadge({ phase }: { phase: MentorshipPhase }) {
  return (
    <Badge variant={phaseVariant[phase]} className="text-[10px] font-semibold">
      {phaseLabel[phase]}
    </Badge>
  );
}

function MentorshipCard({
  mentorship,
  applied,
}: {
  mentorship: Mentorship;
  applied: boolean;
}) {
  const phase = getPhase(mentorship);
  return (
    <Link
      href={`/alumni-mentorship/${mentorship.id}`}
      className="bg-card text-card-foreground rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col p-4 gap-3 group"
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-1.5 min-w-0 flex-1">
          {applied && (
            <CheckCircle2 className="h-4 w-4 shrink-0 text-primary mt-0.5" />
          )}
          <h3 className="font-semibold text-sm leading-snug text-foreground line-clamp-1 min-w-0">
            {mentorship.title}
          </h3>
        </div>
        <PhaseBadge phase={phase} />
      </div>

      {/* Domain */}
      <Badge variant="secondary" className="w-fit text-[11px] font-normal">
        {mentorship.domain}
      </Badge>

      {/* Meta grid */}
      <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Laptop className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">{normalizeMode(mentorship.mode)}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Clock className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">{mentorship.duration}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Users className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">
            {mentorship.maxMentees} {mentorship.maxMentees === 1 ? "mentee" : "mentees"}
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Award className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">{mentorship.yearsOfExperience}+ yrs exp</span>
        </div>
      </div>

      {/* Footer: deadline + CTA */}
      <div className="flex items-center justify-between gap-2 pt-3 border-t border-border mt-auto">
        <span className="text-[10px] text-muted-foreground/60 flex items-center gap-1">
          <CalendarClock className="h-3 w-3" />
          Deadline: {formatDate(mentorship.applicationDeadline)}
        </span>
        <span className="text-xs font-medium text-foreground/60 group-hover:text-primary transition-colors flex items-center gap-1 shrink-0">
          {applied ? "View Application" : "View Details"}
          <ArrowRight className="h-3 w-3" />
        </span>
      </div>
    </Link>
  );
}

function MyMentorshipCard({ mentorship }: { mentorship: Mentorship }) {
  return (
    <Card className="rounded-2xl border border-border bg-card shadow-sm flex flex-col">
      <CardContent className="flex flex-col gap-4 px-(--card-spacing) py-(--card-spacing) flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-sm leading-snug text-foreground line-clamp-1">
            {mentorship.title}
          </h3>
          <Badge
            variant={mentorship.applicationOpen ? "secondary" : "outline"}
            className="shrink-0 text-[10px]"
          >
            {mentorship.applicationOpen ? "Active" : "Closed"}
          </Badge>
        </div>

        <p className="text-xs text-muted-foreground">
          {mentorship.domain} &middot; {normalizeMode(mentorship.mode)} &middot;{" "}
          {mentorship.duration}
        </p>

        {mentorship.description && (
          <p className="text-sm text-muted-foreground/80 leading-relaxed line-clamp-2 flex-1">
            {mentorship.description}
          </p>
        )}

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
          <Button
            variant="secondary"
            size="sm"
            className="w-full cursor-pointer text-xs"
          >
            Manage
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
