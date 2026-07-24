"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { FaLinkedin } from "react-icons/fa";
import {
  ArrowLeft,
  GraduationCap,
  Mail,
  MapPin,
  Award,
  BookOpen,
  Building,
  Loader2,
  AlertCircle,
  ExternalLink,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { getInitials } from "@/lib/utils";
import { useFacultyProfileQuery } from "@/hooks/queries/faculty";
import type { FacultyProfile } from "@/hooks/queries/faculty";

interface Qualification {
  degree: string;
  field: string;
  institution: string;
  year: number;
}

export default function FacultyProfilePage() {
  const params = useParams();
  const facultyId = params.id as string;

  const {
    data: profile,
    isLoading,
    error,
  } = useFacultyProfileQuery(Number(facultyId));

  const qualifications = useMemo<Qualification[]>(() => {
    if (!profile?.qualifications) return [];
    try {
      return JSON.parse(profile.qualifications);
    } catch {
      return [];
    }
  }, [profile?.qualifications]);

  const subjectsTaught = useMemo<string[]>(() => {
    if (!profile?.subjectsTaught) return [];
    try {
      return JSON.parse(profile.subjectsTaught);
    } catch {
      return [];
    }
  }, [profile?.subjectsTaught]);

  const profileImageSrc = profile?.profileImageUrl;

  if (isLoading) {
    return (
      <div className="w-full px-4 sm:px-6 pb-6 space-y-6">
        <div className="py-6">
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3 text-center">
        <AlertCircle className="h-10 w-10 text-destructive" />
        <p className="text-sm font-semibold text-foreground">Profile Not Found</p>
        <p className="text-xs text-muted-foreground max-w-sm">
          {error?.message || "The faculty profile you're looking for doesn't exist."}
        </p>
        <Button variant="outline" size="sm" asChild className="cursor-pointer">
          <Link href="/network/faculty">
            <ArrowLeft className="h-4 w-4" />
            Back to Faculty
          </Link>
        </Button>
      </div>
    );
  }

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "";
    try {
      return new Date(dateStr).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Link href="/network/faculty" className="hover:text-foreground transition-colors">
          Faculty Directory
        </Link>
        <span>/</span>
        <span className="text-foreground font-semibold">{profile.fullName}</span>
      </div>

      {/* Profile Header */}
      <Card className="p-6 sm:p-8 space-y-6">
        <div className="flex flex-col md:flex-row items-start gap-6">
          {/* Avatar */}
          <div className="w-28 h-28 rounded-2xl overflow-hidden border-4 border-border bg-muted shrink-0">
            {profileImageSrc ? (
              <img
                src={profileImageSrc}
                alt={profile.fullName || profile.name || "Faculty Member"}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-foreground font-bold text-4xl">
                {getInitials(profile.fullName)}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 space-y-3">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                {profile.fullName}
              </h1>
              <p className="text-sm font-medium text-muted-foreground mt-0.5">
                {profile.designation}
              </p>
            </div>

            <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
              {profile.departmentName && (
                <span className="flex items-center gap-1.5">
                  <Building className="h-3.5 w-3.5 shrink-0 text-primary" />
                  {profile.departmentName}
                </span>
              )}
              {profile.officeLocation && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 shrink-0 text-primary" />
                  {profile.officeLocation}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Award className="h-3.5 w-3.5 shrink-0 text-primary" />
                {profile.totalExperienceYears} years experience
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2 pt-1">
              {profile.linkedinUrl && (
                <Button size="sm" asChild className="cursor-pointer">
                  <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer">
                    <FaLinkedin className="h-4 w-4" />
                    LinkedIn
                  </a>
                </Button>
              )}
              {profile.googleScholarUrl && (
                <Button size="sm" variant="secondary" asChild className="cursor-pointer">
                  <a href={profile.googleScholarUrl} target="_blank" rel="noopener noreferrer">
                    <Award className="h-4 w-4" />
                    Google Scholar
                  </a>
                </Button>
              )}
              <Button size="sm" variant="outline" asChild className="cursor-pointer">
                <a href={`mailto:${profile.email}`}>
                  <Mail className="h-4 w-4" />
                  Email
                </a>
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Detail Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-1 space-y-6">
          {/* Contact Information */}
          <Card className="p-5 space-y-4">
            <h3 className="font-semibold text-sm text-foreground flex items-center gap-2">
              <Mail className="h-4 w-4 text-primary" />
              Contact Information
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Email</p>
                <a
                  href={`mailto:${profile.email}`}
                  className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                >
                  {profile.email}
                </a>
              </div>
              {profile.officeLocation && (
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Office</p>
                  <p className="text-sm text-foreground flex items-center gap-1.5 mt-0.5">
                    <MapPin className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0" />
                    {profile.officeLocation}
                  </p>
                </div>
              )}
              {profile.joinDate && (
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Joined</p>
                  <p className="text-sm text-foreground flex items-center gap-1.5 mt-0.5">
                    <Clock className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0" />
                    {formatDate(profile.joinDate)}
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* Quick Stats */}
          <Card className="p-5 space-y-3">
            <h3 className="font-semibold text-sm text-foreground">Quick Stats</h3>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Experience</span>
                <span className="font-semibold text-foreground">{profile.totalExperienceYears} years</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Subjects</span>
                <span className="font-semibold text-foreground">{subjectsTaught.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Qualifications</span>
                <span className="font-semibold text-foreground">{qualifications.length}</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Bio */}
          {profile.bio && (
            <Card className="p-5 space-y-3">
              <h3 className="font-semibold text-sm text-foreground">About</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{profile.bio}</p>
            </Card>
          )}

          {/* Qualifications */}
          <Card className="p-5 space-y-4">
            <h3 className="font-semibold text-sm text-foreground flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-primary" />
              Qualifications
            </h3>
            {qualifications.length === 0 ? (
              <p className="text-sm text-muted-foreground">No qualifications added yet.</p>
            ) : (
              <div className="space-y-4">
                {qualifications.map((qual, index) => (
                  <div key={index} className="border-l-2 border-border pl-4 space-y-0.5">
                    <div className="flex items-center gap-2">
                      <Award className="h-3.5 w-3.5 text-primary shrink-0" />
                      <h4 className="font-semibold text-sm text-foreground">{qual.degree}</h4>
                    </div>
                    <p className="text-xs text-muted-foreground">{qual.field}</p>
                    <p className="text-xs text-muted-foreground/70">{qual.institution} &middot; {qual.year}</p>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Subjects Taught */}
          <Card className="p-5 space-y-3">
            <h3 className="font-semibold text-sm text-foreground flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-primary" />
              Subjects Taught
            </h3>
            {subjectsTaught.length === 0 ? (
              <p className="text-sm text-muted-foreground">No subjects added yet.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {subjectsTaught.map((subject, index) => (
                  <Badge key={index} variant="secondary" className="text-xs font-normal">
                    {subject}
                  </Badge>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
