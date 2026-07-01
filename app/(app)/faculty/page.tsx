"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaLinkedin } from "react-icons/fa";
import {
  GraduationCap,
  Mail,
  MapPin,
  Award,
  BookOpen,
  Building,
  Search,
  AlertCircle,
  Calendar,
  Briefcase,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getInitials } from "@/lib/utils";
import { useFacultyListQuery } from "@/hooks/queries/faculty";
import type { FacultyProfile as FacultyMember } from "@/hooks/queries/faculty";

type ParsedFacultyMember = Omit<FacultyMember, "qualifications" | "subjectsTaught"> & {
  qualifications: any[];
  subjectsTaught: string[];
};

export default function FacultyPage() {
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: faculty = [], isLoading, error } = useFacultyListQuery();

  const departments = useMemo(() => {
    const deptMap = new Map<string, string>();
    faculty.forEach((f) => {
      if (f.departmentCode && f.departmentName) {
        deptMap.set(f.departmentCode, f.departmentName);
      }
    });
    return Array.from(deptMap.entries()).map(([code, name]) => ({
      code,
      name,
    }));
  }, [faculty]);

  const parsedFaculty = useMemo<ParsedFacultyMember[]>(() => {
    let filtered = faculty;

    if (selectedDepartment && selectedDepartment !== "all") {
      filtered = filtered.filter((f) => f.departmentCode === selectedDepartment);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (f) =>
          f.fullName.toLowerCase().includes(query) ||
          f.designation.toLowerCase().includes(query) ||
          f.departmentName.toLowerCase().includes(query)
      );
    }

    return filtered.map((f) => ({
      ...f,
      qualifications: f.qualifications ? JSON.parse(f.qualifications) : [],
      subjectsTaught: f.subjectsTaught ? (JSON.parse(f.subjectsTaught as string) as string[]) : [],
    }));
  }, [faculty, selectedDepartment, searchQuery]);

  if (isLoading) {
    return (
      <div className="w-full px-4 sm:px-6 pb-6 space-y-6">
        <div className="sticky top-14 z-30 bg-background/95 backdrop-blur-md py-4 border-b border-border/40 -mx-4 sm:-mx-6 px-4 sm:px-6">
          <div className="space-y-1">
            <Skeleton className="h-5 w-32 rounded-md" />
            <Skeleton className="h-3 w-48 rounded-md" />
          </div>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-[320px] rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 pb-6 space-y-6">
      {/* Header */}
      <div className="sticky top-14 z-30 bg-background/95 backdrop-blur-md py-4 border-b border-border/40 -mx-4 sm:-mx-6 px-4 sm:px-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-xl font-semibold tracking-tight text-foreground">
              Our Faculty
            </h1>
            <p className="text-xs text-muted-foreground">
              Meet our distinguished faculty members
            </p>
          </div>
          <span className="text-xs text-muted-foreground">
            {parsedFaculty.length} of {faculty.length} members
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/60" />
            <Input
              placeholder="Search faculty..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 pl-8 text-xs bg-muted/30 border-border focus-visible:ring-1"
            />
          </div>

          <Select value={selectedDepartment} onValueChange={(value) => setSelectedDepartment(value ?? "")}>
            <SelectTrigger className="h-8 w-[180px] text-xs bg-muted/30 border-border">
              <SelectValue placeholder="All Departments" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {departments.map((dept) => (
                <SelectItem key={dept.code} value={dept.code}>
                  {dept.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Error */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      )}

      {/* Empty */}
      {!isLoading && !error && parsedFaculty.length === 0 && (
        <Card className="rounded-xl border border-border bg-card">
          <CardContent className="flex flex-col items-center py-16 text-center">
            <GraduationCap className="h-8 w-8 text-muted-foreground/60 mb-3" />
            <p className="font-semibold text-foreground text-sm">No faculty found</p>
            <p className="text-xs text-muted-foreground mt-1">
              {searchQuery || (selectedDepartment && selectedDepartment !== "all")
                ? "Try adjusting your search or filters"
                : "No faculty members available"}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Faculty Grid */}
      {!isLoading && parsedFaculty.length > 0 && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {parsedFaculty.map((member: ParsedFacultyMember) => (
            <div
              key={member.userId}
              className="bg-card text-card-foreground rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col p-4 gap-3"
            >
              {/* Profile + Info */}
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-muted shrink-0 border border-border">
                  {member.profileImageUrl ? (
                    <Image
                      src={member.profileImageUrl}
                      alt={member.fullName}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-primary font-bold text-sm">
                      {getInitials(member.fullName)}
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-sm leading-snug text-foreground line-clamp-1">
                    {member.fullName}
                  </h3>
                  <p className="text-xs text-primary mt-0.5">{member.designation}</p>
                </div>
              </div>

              {/* Meta */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Building className="h-3.5 w-3.5 shrink-0" />
                  <span>{member.departmentName}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Award className="h-3.5 w-3.5 shrink-0" />
                  <span>{member.totalExperienceYears} years experience</span>
                </div>
                {member.officeLocation && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5 shrink-0" />
                    <span>{member.officeLocation}</span>
                  </div>
                )}
              </div>

              {/* Subjects */}
              {member.subjectsTaught.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {member.subjectsTaught.slice(0, 3).map((subject, i) => (
                    <Badge key={i} variant="secondary" className="text-[10px] font-medium">
                      {subject}
                    </Badge>
                  ))}
                  {member.subjectsTaught.length > 3 && (
                    <span className="text-[10px] text-muted-foreground">
                      +{member.subjectsTaught.length - 3}
                    </span>
                  )}
                </div>
              )}

              {/* Qualifications */}
              {member.qualifications.length > 0 && (
                <div className="text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">
                    {member.qualifications[0].degree}
                  </span>{" "}
                  in {member.qualifications[0].field}
                  <br />
                  {member.qualifications[0].institution}
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-2 pt-3 border-t border-border mt-auto">
                <Link href={`/faculty/${member.userId}`} className="flex-1">
                  <Button className="w-full cursor-pointer" size="sm">
                    View Profile
                  </Button>
                </Link>
                {member.linkedinUrl && (
                  <a href={member.linkedinUrl} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="icon" className="h-8 w-8 cursor-pointer">
                      <FaLinkedin className="h-3.5 w-3.5" />
                    </Button>
                  </a>
                )}
                <a href={`mailto:${member.email}`}>
                  <Button variant="outline" size="icon" className="h-8 w-8 cursor-pointer">
                    <Mail className="h-3.5 w-3.5" />
                  </Button>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
