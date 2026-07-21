"use client";

import { notFound, useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { FaLinkedin } from "react-icons/fa";
import {
  ArrowLeft,
  MapPin,
  Briefcase,
  GraduationCap,
  Mail,
  ShieldCheck,
  Calendar,
  Globe,
  Award,
  Users,
  TrendingUp,
  ExternalLink,
  Clock,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { getInitials } from "@/lib/utils";
import { useAlumniProfileQuery } from "@/hooks/queries/alumni";

interface Skill {
  skillId: number;
  skillName: string;
  isStarter: boolean;
}

interface Event {
  eventId: number;
  title: string;
  description: string;
  eventDate: string;
  location: string | null;
  registrationLink: string | null;
}

interface Opportunity {
  opportunityId: number;
  title: string;
  description: string;
  type: string;
  company: string | null;
  location: string | null;
  postedAt: string;
}

interface AlumniProfile {
  id: number;
  name: string;
  email: string;
  profileImageUrl: string | null;
  batchYear: number | null;
  courseCode: string | null;
  courseName: string | null;
  branchCode: string | null;
  branchName: string | null;
  department: string | null;
  profession: string | null;
  linkedinUrl: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  countryCode: string | null;
  stateCode: string | null;
  fullLocation: string | null;
  latitude: number | null;
  longitude: number | null;
  skills: Skill[] | null;
  events: Event[] | null;
  opportunities: Opportunity[] | null;
  totalSkills: number;
  totalEvents: number;
  totalOpportunities: number;
}

export default function AlumniProfilePage() {
  const params = useParams();
  const id = Number(params.id);

  const { data: rawProfile, isLoading, error } = useAlumniProfileQuery(id);
  const alumni = rawProfile as AlumniProfile | null;

  if (isLoading) {
    return (
      <div className="w-full px-4 sm:px-6 pb-6 space-y-6">
        <div className="py-6">
          <Skeleton className="h-8 w-40 rounded-lg mb-6" />
          <Skeleton className="h-48 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error || !alumni) {
    notFound();
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="w-full px-4 sm:px-6 pb-6 space-y-6">
      {/* Sticky Top Bar */}
      <div className="sticky top-14 z-30 bg-background/95 backdrop-blur-md py-4 border-b border-border/40 -mx-4 sm:-mx-6 px-4 sm:px-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="xs" asChild className="cursor-pointer">
            <Link href="/alumni">
              <ArrowLeft className="h-3.5 w-3.5 mr-1" /> Back to Directory
            </Link>
          </Button>
          {alumni.linkedinUrl && (
            <Button size="xs" asChild className="cursor-pointer bg-[#0077b5] hover:bg-[#006097] text-white">
              <a href={alumni.linkedinUrl} target="_blank" rel="noopener noreferrer">
                <FaLinkedin className="h-3.5 w-3.5 mr-1" /> LinkedIn Profile
              </a>
            </Button>
          )}
        </div>
      </div>

      {/* Main Profile Header Card */}
      <Card className="p-6 bg-card border-border shadow-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="w-24 h-24 rounded-2xl overflow-hidden bg-muted border border-border shrink-0 flex items-center justify-center">
              {alumni.profileImageUrl ? (
                <Image
                  src={alumni.profileImageUrl}
                  alt={alumni.name}
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="font-bold text-2xl text-muted-foreground">
                  {getInitials(alumni.name)}
                </span>
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
                    <MapPin className="h-3.5 w-3.5 shrink-0" />
                    {alumni.fullLocation}
                  </span>
                )}
                {alumni.batchYear && (
                  <span className="flex items-center gap-1">
                    <GraduationCap className="h-3.5 w-3.5 shrink-0" />
                    Class of {alumni.batchYear}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-6 border-t md:border-t-0 md:border-l border-border pt-4 md:pt-0 md:pl-6 w-full md:w-auto">
            <div className="text-center">
              <div className="text-xl font-bold text-foreground">{alumni.totalSkills}</div>
              <div className="text-[10px] text-muted-foreground font-medium">Skills</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-foreground">{alumni.totalEvents}</div>
              <div className="text-[10px] text-muted-foreground font-medium">Events</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-foreground">{alumni.totalOpportunities}</div>
              <div className="text-[10px] text-muted-foreground font-medium">Postings</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Details Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column: Academics & Contact */}
        <div className="space-y-4">
          <Card className="p-4">
            <h3 className="font-semibold text-xs text-foreground mb-3 flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
              Academic Info
            </h3>
            <div className="space-y-2.5 text-xs">
              {alumni.branchName && (
                <div>
                  <span className="text-[10px] text-muted-foreground/75 block">Branch</span>
                  <span className="font-medium text-foreground">{alumni.branchName}</span>
                </div>
              )}
              {alumni.courseName && (
                <div>
                  <span className="text-[10px] text-muted-foreground/75 block">Department</span>
                  <span className="font-medium text-foreground">{alumni.courseName}</span>
                </div>
              )}
              {alumni.batchYear && (
                <div>
                  <span className="text-[10px] text-muted-foreground/75 block">Graduation Year</span>
                  <span className="font-medium text-foreground">{alumni.batchYear}</span>
                </div>
              )}
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="font-semibold text-xs text-foreground mb-3 flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              Contact Details
            </h3>
            <div className="space-y-2.5 text-xs text-muted-foreground">
              {alumni.email && (
                <div className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">{alumni.email}</span>
                </div>
              )}
              {alumni.fullLocation && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">{alumni.fullLocation}</span>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Right Column: Skills, Events, Opportunities */}
        <div className="lg:col-span-2 space-y-4">
          {/* Skills */}
          {alumni.skills && alumni.skills.length > 0 && (
            <Card className="p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-sm text-foreground flex items-center gap-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  Skills &amp; Expertise
                </h3>
                <Badge variant="secondary" className="text-[10px]">
                  {alumni.totalSkills} skills
                </Badge>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {alumni.skills.map((skill) => (
                  <Badge
                    key={skill.skillId}
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
            <Card className="p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-sm text-foreground flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  Associated Events
                </h3>
                <Badge variant="secondary" className="text-[10px]">
                  {alumni.totalEvents} events
                </Badge>
              </div>
              <div className="space-y-3">
                {alumni.events.map((event) => (
                  <div key={event.eventId} className="p-3 rounded-lg border border-border bg-card space-y-1.5">
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
                    <p className="text-xs text-muted-foreground line-clamp-2">{event.description}</p>
                    <div className="flex items-center gap-3 text-[10px] text-muted-foreground/80 pt-1">
                      <span>{formatDate(event.eventDate)}</span>
                      {event.location && <span>&middot; {event.location}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Opportunities */}
          {alumni.opportunities && alumni.opportunities.length > 0 && (
            <Card className="p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-sm text-foreground flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  Opportunity Postings
                </h3>
                <Badge variant="secondary" className="text-[10px]">
                  {alumni.totalOpportunities} posted
                </Badge>
              </div>
              <div className="space-y-3">
                {alumni.opportunities.map((opp) => (
                  <div key={opp.opportunityId} className="p-3 rounded-lg border border-border bg-card space-y-1.5">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-[9px]">
                        {opp.type}
                      </Badge>
                      {opp.company && (
                        <span className="text-[10px] text-muted-foreground font-medium">
                          {opp.company}
                        </span>
                      )}
                    </div>
                    <h4 className="font-semibold text-xs text-foreground">{opp.title}</h4>
                    <p className="text-xs text-muted-foreground line-clamp-2">{opp.description}</p>
                    <div className="flex items-center gap-3 text-[10px] text-muted-foreground/80 pt-1">
                      {opp.location && <span><MapPin className="h-2.5 w-2.5 inline mr-1" />{opp.location}</span>}
                      <span>Posted {formatDate(opp.postedAt)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Empty Profile Case */}
          {!alumni.skills?.length && !alumni.events?.length && !alumni.opportunities?.length && (
            <Card className="p-8 text-center">
              <CardContent className="p-0 flex flex-col items-center gap-2">
                <Users className="h-8 w-8 text-muted-foreground/40" />
                <p className="font-semibold text-sm text-foreground">Profile Overview</p>
                <p className="text-xs text-muted-foreground max-w-sm">
                  This alumni profile doesn&apos;t have added skills, events, or posted opportunities yet.
                </p>
                <Button variant="outline" size="sm" asChild className="mt-2 cursor-pointer">
                  <Link href="/alumni">Browse other profiles</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
