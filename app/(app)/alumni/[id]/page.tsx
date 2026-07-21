"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import {
  GraduationCap,
  MapPin,
  Briefcase,
  Mail,
  ExternalLink,
  ShieldCheck,
  Award,
  Globe,
  Calendar,
  Clock,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { getInitials } from "@/lib/utils";
import { useAlumniProfileQuery } from "@/hooks/queries/alumni";

interface Skill {
  skillId: number;
  skillName: string;
  isStarter: boolean;
}

interface EventItem {
  id?: number;
  eventId?: number;
  title: string;
  description?: string;
  eventDate: string;
  location?: string | null;
  registrationLink?: string | null;
}

interface OpportunityItem {
  id?: number;
  opportunityId?: number;
  title: string;
  description?: string;
  type: string;
  company?: string | null;
  location?: string | null;
  postedAt: string;
}

interface AlumniProfile {
  id: number;
  name: string;
  email?: string | null;
  profileImageUrl?: string | null;
  batchYear?: number | null;
  courseCode?: string | null;
  courseName?: string | null;
  branchCode?: string | null;
  branchName?: string | null;
  department?: string | null;
  profession?: string | null;
  linkedinUrl?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  countryCode?: string | null;
  stateCode?: string | null;
  fullLocation?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  skills?: Skill[] | null;
  events?: EventItem[] | null;
  opportunities?: OpportunityItem[] | null;
  totalSkills?: number;
  totalEvents?: number;
  totalOpportunities?: number;
}

export default function AlumniProfilePage() {
  const params = useParams();
  const id = Number(params.id);

  const { data: rawProfile, isLoading, error } = useAlumniProfileQuery(id);
  const alumni = rawProfile as unknown as AlumniProfile | null;

  if (isLoading) {
    return (
      <div className="w-full px-4 sm:px-6 pb-6 space-y-6">
        <div className="py-6">
          <Skeleton className="h-32 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error || !alumni) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3">
        <p className="text-sm font-semibold text-foreground">Alumni Profile Not Found</p>
        <p className="text-xs text-muted-foreground">The profile you requested does not exist or is private.</p>
        <Button variant="outline" size="xs" asChild className="cursor-pointer">
          <Link href="/network/alumni">Back to Alumni Directory</Link>
        </Button>
      </div>
    );
  }

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "";
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Back Link */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Link href="/network/alumni" className="hover:text-foreground transition-colors">
          Alumni Directory
        </Link>
        <span>/</span>
        <span className="text-foreground font-semibold">{alumni.name}</span>
      </div>

      {/* Main Profile Header */}
      <Card className="p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold text-2xl border border-primary/20 shrink-0">
              {alumni.profileImageUrl ? (
                <img
                  src={alumni.profileImageUrl}
                  alt={alumni.name}
                  className="h-full w-full rounded-2xl object-cover"
                />
              ) : (
                getInitials(alumni.name)
              )}
            </div>

            <div className="space-y-1.5 min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                  {alumni.name}
                </h1>
                <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" title="Verified Alumni" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">
                {alumni.profession || "Graduate Member"}
              </p>
              <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground/80 pt-1">
                {alumni.fullLocation && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 shrink-0 text-primary" />
                    {alumni.fullLocation}
                  </span>
                )}
                {alumni.batchYear && (
                  <span className="flex items-center gap-1">
                    <GraduationCap className="h-3.5 w-3.5 shrink-0 text-primary" />
                    Class of {alumni.batchYear}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-stretch sm:self-center">
            {alumni.email && (
              <Button size="xs" variant="outline" asChild className="flex-1 sm:flex-none cursor-pointer">
                <a href={`mailto:${alumni.email}`}>
                  <Mail className="h-3.5 w-3.5 mr-1.5" /> Email
                </a>
              </Button>
            )}
            {alumni.linkedinUrl && (
              <Button size="xs" asChild className="flex-1 sm:flex-none cursor-pointer">
                <a href={alumni.linkedinUrl} target="_blank" rel="noreferrer">
                  LinkedIn <ExternalLink className="h-3.5 w-3.5 ml-1.5" />
                </a>
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Detail Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {/* Skills */}
          {alumni.skills && alumni.skills.length > 0 && (
            <Card className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm text-foreground flex items-center gap-2">
                  <Award className="h-4 w-4 text-primary" /> Skills &amp; Expertise
                </h3>
                <Badge variant="secondary" className="text-[10px]">
                  {alumni.totalSkills || alumni.skills.length} skills
                </Badge>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {alumni.skills.map((skill: Skill) => (
                  <Badge
                    key={skill.skillId || skill.skillName}
                    variant={skill.isStarter ? "default" : "outline"}
                    className="text-xs font-normal"
                  >
                    {skill.isStarter && <Award className="h-3 w-3 mr-1" />}
                    {skill.skillName}
                  </Badge>
                ))}
              </div>
            </Card>
          )}

          {/* Events */}
          {alumni.events && alumni.events.length > 0 && (
            <Card className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm text-foreground flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" /> Associated Events
                </h3>
                <Badge variant="secondary" className="text-[10px]">
                  {alumni.totalEvents || alumni.events.length} events
                </Badge>
              </div>
              <div className="space-y-3">
                {alumni.events.map((event: EventItem) => (
                  <div key={event.id || event.eventId || event.title} className="p-3 rounded-lg border border-border bg-card space-y-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-semibold text-xs text-foreground">{event.title}</h4>
                      {event.registrationLink && (
                        <Button size="xs" variant="outline" asChild className="cursor-pointer shrink-0">
                          <a href={event.registrationLink} target="_blank" rel="noopener noreferrer">
                            Register <ExternalLink className="h-3 w-3 ml-1" />
                          </a>
                        </Button>
                      )}
                    </div>
                    {event.description && <p className="text-xs text-muted-foreground line-clamp-2">{event.description}</p>}
                    <div className="flex items-center gap-3 text-[10px] text-muted-foreground/80 pt-1">
                      <span>{formatDate(event.eventDate)}</span>
                      {event.location && <span>&middot; {event.location}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <Card className="p-5 space-y-3">
            <h3 className="font-semibold text-sm text-foreground flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-primary" /> Academic Info
            </h3>
            <div className="space-y-2 text-xs">
              <div>
                <p className="text-[11px] text-muted-foreground">Course / Branch</p>
                <p className="font-semibold text-foreground">{alumni.courseName || alumni.department || "Engineering"}</p>
              </div>
              {alumni.batchYear && (
                <div>
                  <p className="text-[11px] text-muted-foreground">Graduation Batch</p>
                  <p className="font-semibold text-foreground">Class of {alumni.batchYear}</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
