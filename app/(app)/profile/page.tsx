"use client";

import { ChangeEvent, useRef, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  Award,
  Briefcase,
  Building2,
  BookOpen,
  Calendar,
  Camera,
  CheckCircle2,
  Clock,
  ExternalLink,
  GraduationCap,
  Loader2,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Sparkles,
  Trash2,
  UserCircle2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  useMyProfileQuery,
  useUpdateProfileMutation,
} from "@/hooks/queries/profile";
import type { MyProfileResponse } from "@/lib/types/profile";
import { api } from "@/lib/fetcher";
import { cn } from "@/lib/utils";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

const resolveImageUrl = (url: string | null) => {
  if (!url) return null;
  return url.startsWith("http") ? url : `${BACKEND_URL}${url}`;
};

const formatDateTime = (value: string) =>
  new Date(value).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const ROLE_LABEL: Record<string, string> = {
  ALUMNI: "Alumni",
  STUDENT: "Student",
  FACULTY: "Faculty",
};

type SidebarTabKey = "skills" | "events" | "opportunities";

export default function ProfilePage() {
  const { data: profile, isLoading, isError, error: queryError } = useMyProfileQuery();
  const updateProfile = useUpdateProfileMutation();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [removingPhoto, setRemovingPhoto] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [sidebarTab, setSidebarTab] = useState<SidebarTabKey>("events");

  // Form state — unified across roles
  const [form, setForm] = useState({
    name: "",
    phone: "",
    bio: "",
    // alumni
    profession: "",
    location: "",
    linkedinUrl: "",
    gmail: "",
    // student
    fullName: "",
    currentSemester: "",
    cgpa: "",
    githubUrl: "",
    portfolioUrl: "",
    // faculty
    designation: "",
    officeLocation: "",
    googleScholarUrl: "",
  });

  const isSaving = updateProfile.isPending;

  // Initialize form when profile loads
  const initForm = (p: MyProfileResponse) => {
    const a = p.alumniProfile;
    const s = p.studentProfile;
    const f = p.facultyProfile;
    setForm({
      name: p.name || "",
      phone: p.phone || "",
      bio: a?.bio || s?.bio || f?.bio || "",
      profession: a?.profession || "",
      location: a?.location || "",
      linkedinUrl: a?.linkedinUrl || s?.linkedinUrl || f?.linkedinUrl || "",
      gmail: "",
      fullName: s?.fullName || f?.fullName || "",
      currentSemester: s?.currentSemester?.toString() || "",
      cgpa: s?.cgpa?.toString() || "",
      githubUrl: s?.githubUrl || "",
      portfolioUrl: s?.portfolioUrl || "",
      designation: f?.designation || "",
      officeLocation: f?.officeLocation || "",
      googleScholarUrl: f?.googleScholarUrl || "",
    });
  };

  // Call initForm on first load only when not editing
  const [initialized, setInitialized] = useState(false);
  if (profile && !initialized && !isEditing) {
    initForm(profile);
    setInitialized(true);
  }

  const handleSave = async () => {
    const payload: Record<string, unknown> = {};
    const role = profile?.primaryRole;

    payload.name = form.name.trim();

    if (form.phone.trim()) payload.phone = form.phone.trim();

    if (role === "ALUMNI") {
      if (form.bio.trim()) payload.bio = form.bio.trim();
      if (form.profession.trim()) payload.profession = form.profession.trim();
      if (form.location.trim()) payload.location = form.location.trim();
      if (form.linkedinUrl.trim()) payload.linkedinUrl = form.linkedinUrl.trim();
    }

    if (role === "STUDENT") {
      payload.fullName = form.fullName.trim();
      if (form.bio.trim()) payload.bio = form.bio.trim();
      if (form.currentSemester) payload.currentSemester = parseInt(form.currentSemester);
      if (form.cgpa) payload.cgpa = parseFloat(form.cgpa);
      if (form.linkedinUrl.trim()) payload.linkedinUrl = form.linkedinUrl.trim();
      if (form.githubUrl.trim()) payload.githubUrl = form.githubUrl.trim();
      if (form.portfolioUrl.trim()) payload.portfolioUrl = form.portfolioUrl.trim();
    }

    if (role === "FACULTY") {
      payload.fullName = form.fullName.trim();
      if (form.bio.trim()) payload.bio = form.bio.trim();
      if (form.designation.trim()) payload.designation = form.designation.trim();
      if (form.officeLocation.trim()) payload.officeLocation = form.officeLocation.trim();
      if (form.linkedinUrl.trim()) payload.linkedinUrl = form.linkedinUrl.trim();
      if (form.googleScholarUrl.trim()) payload.googleScholarUrl = form.googleScholarUrl.trim();
    }

    try {
      await updateProfile.mutateAsync(payload);
      setIsEditing(false);
      setSuccessMessage("Profile updated successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch {
      // error is handled by the mutation
    }
  };

  const handlePhotoSelected = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingPhoto(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      await api("/api/profile/me/photo", { method: "PUT", body: formData });
      window.location.reload();
    } catch {
      // handled
    } finally {
      setUploadingPhoto(false);
      if (e.target) e.target.value = "";
    }
  };

  const handleRemovePhoto = async () => {
    setRemovingPhoto(true);
    try {
      await api("/api/profile/me/photo", { method: "DELETE" });
      window.location.reload();
    } catch {
      // handled
    } finally {
      setRemovingPhoto(false);
    }
  };

  // ── Loading state ────────────────────────────────────────────────

  if (isLoading) {
    return (
      <div className="w-full px-6 pb-6 space-y-6">
        <Skeleton className="h-14 rounded-xl" />
        <Skeleton className="h-44 rounded-2xl" />
        <div className="grid xl:grid-cols-[1.6fr,1fr] gap-6">
          <Skeleton className="h-80 rounded-2xl" />
          <Skeleton className="h-80 rounded-2xl" />
        </div>
      </div>
    );
  }

  // ── Error state ──────────────────────────────────────────────────

  if (isError || !profile) {
    return (
      <div className="w-full px-6 pb-6 space-y-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {queryError instanceof Error ? queryError.message : "Failed to load profile"}
          </AlertDescription>
        </Alert>
        <Button variant="outline" onClick={() => window.location.reload()} className="cursor-pointer">
          Try Again
        </Button>
      </div>
    );
  }

  const role = profile.primaryRole;
  const alumniData = profile.alumniProfile;
  const studentData = profile.studentProfile;
  const facultyData = profile.facultyProfile;
  const profileImageSrc = resolveImageUrl(profile.profileImageUrl);

  const contactMeta: { icon: typeof Mail; label: string; value: string | null }[] = [
    { icon: Mail, label: "Email", value: profile.email },
    { icon: Phone, label: "Phone", value: profile.phone },
    {
      icon: role === "FACULTY" ? Building2 : MapPin,
      label: role === "FACULTY" ? "Office" : "Location",
      value: (role === "FACULTY" ? facultyData?.officeLocation : alumniData?.location) || null,
    },
    {
      icon: GraduationCap,
      label: "Batch",
      value: (alumniData?.batchYear || studentData?.batchYear || facultyData?.joinDate)?.toString() || null,
    },
  ];

  const hasSkillsTab = role === "ALUMNI" && (profile.skills?.length ?? 0) > 0;
  const sidebarTabs: { key: SidebarTabKey; label: string; icon: typeof Calendar }[] = [
    ...(hasSkillsTab ? [{ key: "skills" as SidebarTabKey, label: "Skills", icon: Sparkles }] : []),
    { key: "events", label: "Events", icon: Calendar },
    { key: "opportunities", label: "Opportunities", icon: Briefcase },
  ];
  const activeTab = sidebarTabs.some((t) => t.key === sidebarTab) ? sidebarTab : sidebarTabs[0].key;

  return (
    <div className="w-full px-6 pb-6 space-y-6">
      {/* Sticky header */}
      <div className="sticky top-14 z-30 bg-background/95 backdrop-blur-md py-4 border-b border-border/40 -mx-6 px-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/75">
              Profile
            </p>
            <h1 className="text-xl font-semibold tracking-tight text-foreground">My Profile</h1>
          </div>
          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    if (profile) initForm(profile);
                  }}
                  disabled={isSaving}
                  className="cursor-pointer"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={isSaving} className="cursor-pointer">
                  {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
                  Save Changes
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)} className="cursor-pointer">
                <Pencil className="h-4 w-4" />
                Edit Profile
              </Button>
            )}
          </div>
        </div>
      </div>

      {successMessage && (
        <Alert className="bg-green-500/10 border-green-500/20 text-green-600">
          <CheckCircle2 className="h-4 w-4" />
          <AlertTitle className="text-sm font-medium">{successMessage}</AlertTitle>
        </Alert>
      )}

      {/* Hero card */}
      <Card>
        <CardContent className="p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-6">
            {/* Avatar */}
            <div className="relative shrink-0 mx-auto sm:mx-0">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-muted ring-2 ring-border flex items-center justify-center">
                {profileImageSrc ? (
                  <img src={profileImageSrc} alt={profile.name} className="w-full h-full object-cover" />
                ) : (
                  <UserCircle2 className="h-12 w-12 text-muted-foreground/40" />
                )}
              </div>
              {!isEditing && (
                <>
                  <Button
                    variant="default"
                    size="icon"
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingPhoto}
                    className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full shadow-md cursor-pointer"
                    aria-label="Update profile photo"
                  >
                    {uploadingPhoto ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Camera className="h-3.5 w-3.5" />
                    )}
                  </Button>
                  {profileImageSrc && (
                    <Button
                      variant="secondary"
                      size="icon"
                      type="button"
                      onClick={handleRemovePhoto}
                      disabled={removingPhoto}
                      className="absolute -top-1 -right-1 w-6 h-6 rounded-full shadow-md cursor-pointer"
                      aria-label="Remove profile photo"
                    >
                      {removingPhoto ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <Trash2 className="h-3 w-3" />
                      )}
                    </Button>
                  )}
                </>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                onChange={handlePhotoSelected}
              />
            </div>

            {/* Identity + meta */}
            <div className="flex-1 min-w-0 space-y-4">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1 min-w-[220px]">
                  {isEditing ? (
                    <div className="space-y-2 max-w-sm">
                      <Label htmlFor="edit-name">Full Name</Label>
                      <Input
                        id="edit-name"
                        value={form.name}
                        onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                      />
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-xl font-semibold tracking-tight text-foreground">
                        {profile.name}
                      </h2>
                      <Badge variant="secondary" className="text-[10px]">
                        {ROLE_LABEL[role] ?? role}
                      </Badge>
                    </div>
                  )}
                  {!isEditing && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {role === "ALUMNI" && (alumniData?.profession || "No profession listed")}
                      {role === "STUDENT" &&
                        `${studentData?.branchName || "Student"}${
                          studentData?.currentSemester ? ` · Semester ${studentData.currentSemester}` : ""
                        }`}
                      {role === "FACULTY" && (facultyData?.designation || "No designation listed")}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href="/events"
                    className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Calendar className="h-3.5 w-3.5" />
                    Events
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                  <Link
                    href="/opportunities"
                    className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Briefcase className="h-3.5 w-3.5" />
                    Opportunities
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                </div>
              </div>

              {/* Compact meta grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {contactMeta.map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-center gap-2.5">
                    <div className="p-1.5 bg-muted rounded-lg text-foreground shrink-0">
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/75">
                        {label}
                      </span>
                      <span className="text-xs font-medium text-foreground truncate">
                        {value || "—"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bio */}
              {isEditing ? (
                <div className="space-y-2 pt-1">
                  <Label htmlFor="edit-bio">Bio</Label>
                  <Textarea
                    id="edit-bio"
                    rows={3}
                    value={form.bio}
                    onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
                    placeholder="Tell us about yourself..."
                  />
                </div>
              ) : (
                (alumniData?.bio || studentData?.bio || facultyData?.bio) && (
                  <p className="text-xs text-muted-foreground leading-relaxed pt-3 border-t border-border">
                    {alumniData?.bio || studentData?.bio || facultyData?.bio}
                  </p>
                )
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main content */}
      <div className="grid xl:grid-cols-[1.6fr,1fr] gap-6 items-start">
        {/* Role-specific details */}
        <Card>
          <CardContent className="p-5 sm:p-6 space-y-5">
            <div>
              <h3 className="font-semibold text-sm text-foreground">
                {role === "ALUMNI" && "Professional Details"}
                {role === "STUDENT" && "Academic & Social Details"}
                {role === "FACULTY" && "Academic & Professional Details"}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                {role === "ALUMNI" && "Information visible to other alumni."}
                {role === "STUDENT" && "Your academic record and online presence."}
                {role === "FACULTY" && "Your faculty profile information."}
              </p>
            </div>

            {/* ALUMNI */}
            {role === "ALUMNI" && (
              <>
                {isEditing ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="profession">Profession</Label>
                      <Input
                        id="profession"
                        value={form.profession}
                        onChange={(e) => setForm((f) => ({ ...f, profession: e.target.value }))}
                        placeholder="Software Engineer"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="alumni-location">Location</Label>
                      <Input
                        id="alumni-location"
                        value={form.location}
                        onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                        placeholder="Bangalore, India"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="alumni-phone">Phone</Label>
                      <Input
                        id="alumni-phone"
                        type="tel"
                        value={form.phone}
                        onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                        placeholder="+91 98765 43210"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-3">
                      <Label htmlFor="alumni-linkedin">LinkedIn URL</Label>
                      <Input
                        id="alumni-linkedin"
                        type="url"
                        value={form.linkedinUrl}
                        onChange={(e) => setForm((f) => ({ ...f, linkedinUrl: e.target.value }))}
                        placeholder="https://linkedin.com/in/yourname"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {alumniData?.profession && (
                      <Badge variant="secondary" className="text-xs">
                        <Briefcase className="h-3 w-3 mr-1" />
                        {alumniData.profession}
                      </Badge>
                    )}
                    {alumniData?.location && (
                      <Badge variant="secondary" className="text-xs">
                        <MapPin className="h-3 w-3 mr-1" />
                        {alumniData.location}
                      </Badge>
                    )}
                    {alumniData?.batchYear && (
                      <Badge variant="secondary" className="text-xs">
                        <GraduationCap className="h-3 w-3 mr-1" />
                        Batch of {alumniData.batchYear}
                      </Badge>
                    )}
                    {alumniData?.linkedinUrl && (
                      <a href={alumniData.linkedinUrl} target="_blank" rel="noopener noreferrer">
                        <Badge variant="outline" className="text-xs hover:bg-muted cursor-pointer">
                          <ExternalLink className="h-3 w-3 mr-1" />
                          LinkedIn
                        </Badge>
                      </a>
                    )}
                    {!alumniData?.profession && !alumniData?.location && !alumniData?.linkedinUrl && (
                      <p className="text-xs text-muted-foreground">No professional details added yet.</p>
                    )}
                  </div>
                )}
              </>
            )}

            {/* STUDENT */}
            {role === "STUDENT" && (
              <>
                {!isEditing && (
                  <div className="flex flex-wrap gap-2">
                    {studentData?.rollNumber && (
                      <Badge variant="secondary" className="text-xs">
                        <GraduationCap className="h-3 w-3 mr-1" />
                        {studentData.rollNumber}
                      </Badge>
                    )}
                    {studentData?.branchName && (
                      <Badge variant="secondary" className="text-xs">{studentData.branchName}</Badge>
                    )}
                    {studentData?.courseName && (
                      <Badge variant="secondary" className="text-xs">{studentData.courseName}</Badge>
                    )}
                    {studentData?.batchYear && (
                      <Badge variant="secondary" className="text-xs">Batch of {studentData.batchYear}</Badge>
                    )}
                    {studentData?.currentSemester && (
                      <Badge variant="secondary" className="text-xs">Sem {studentData.currentSemester}</Badge>
                    )}
                    {studentData?.cgpa && (
                      <Badge variant="secondary" className="text-xs">CGPA: {studentData.cgpa.toFixed(2)}</Badge>
                    )}
                    {studentData?.verified && (
                      <Badge variant="default" className="text-xs">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>
                )}

                {isEditing && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2 md:col-span-3">
                      <Label htmlFor="student-fullname">Full Name</Label>
                      <Input
                        id="student-fullname"
                        value={form.fullName}
                        onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="semester">Current Semester</Label>
                      <Input
                        id="semester"
                        type="number"
                        min={1}
                        max={8}
                        value={form.currentSemester}
                        onChange={(e) => setForm((f) => ({ ...f, currentSemester: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cgpa">CGPA</Label>
                      <Input
                        id="cgpa"
                        type="number"
                        min={0}
                        max={10}
                        step={0.01}
                        value={form.cgpa}
                        onChange={(e) => setForm((f) => ({ ...f, cgpa: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="student-linkedin">LinkedIn URL</Label>
                      <Input
                        id="student-linkedin"
                        type="url"
                        value={form.linkedinUrl}
                        onChange={(e) => setForm((f) => ({ ...f, linkedinUrl: e.target.value }))}
                        placeholder="https://linkedin.com/in/yourname"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="github">GitHub URL</Label>
                      <Input
                        id="github"
                        type="url"
                        value={form.githubUrl}
                        onChange={(e) => setForm((f) => ({ ...f, githubUrl: e.target.value }))}
                        placeholder="https://github.com/yourname"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="portfolio">Portfolio URL</Label>
                      <Input
                        id="portfolio"
                        type="url"
                        value={form.portfolioUrl}
                        onChange={(e) => setForm((f) => ({ ...f, portfolioUrl: e.target.value }))}
                        placeholder="https://yourportfolio.dev"
                      />
                    </div>
                  </div>
                )}

                {!isEditing && (
                  <div className="flex flex-wrap gap-2 pt-3 border-t border-border">
                    {studentData?.linkedinUrl && (
                      <a href={studentData.linkedinUrl} target="_blank" rel="noopener noreferrer">
                        <Badge variant="outline" className="text-xs hover:bg-muted cursor-pointer">
                          <ExternalLink className="h-3 w-3 mr-1" />
                          LinkedIn
                        </Badge>
                      </a>
                    )}
                    {studentData?.githubUrl && (
                      <a href={studentData.githubUrl} target="_blank" rel="noopener noreferrer">
                        <Badge variant="outline" className="text-xs hover:bg-muted cursor-pointer">
                          <ExternalLink className="h-3 w-3 mr-1" />
                          GitHub
                        </Badge>
                      </a>
                    )}
                    {studentData?.portfolioUrl && (
                      <a href={studentData.portfolioUrl} target="_blank" rel="noopener noreferrer">
                        <Badge variant="outline" className="text-xs hover:bg-muted cursor-pointer">
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Portfolio
                        </Badge>
                      </a>
                    )}
                    {!studentData?.linkedinUrl && !studentData?.githubUrl && !studentData?.portfolioUrl && (
                      <p className="text-xs text-muted-foreground">No links added yet.</p>
                    )}
                  </div>
                )}
              </>
            )}

            {/* FACULTY */}
            {role === "FACULTY" && (
              <>
                {!isEditing && (
                  <div className="flex flex-wrap gap-2">
                    {facultyData?.designation && (
                      <Badge variant="secondary" className="text-xs">
                        <Briefcase className="h-3 w-3 mr-1" />
                        {facultyData.designation}
                      </Badge>
                    )}
                    {facultyData?.departmentName && (
                      <Badge variant="secondary" className="text-xs">
                        <Building2 className="h-3 w-3 mr-1" />
                        {facultyData.departmentName}
                      </Badge>
                    )}
                    {facultyData?.officeLocation && (
                      <Badge variant="secondary" className="text-xs">
                        <MapPin className="h-3 w-3 mr-1" />
                        {facultyData.officeLocation}
                      </Badge>
                    )}
                    {facultyData?.totalExperienceYears != null && (
                      <Badge variant="secondary" className="text-xs">
                        <Clock className="h-3 w-3 mr-1" />
                        {facultyData.totalExperienceYears} yrs exp
                      </Badge>
                    )}
                    {facultyData?.linkedinUrl && (
                      <a href={facultyData.linkedinUrl} target="_blank" rel="noopener noreferrer">
                        <Badge variant="outline" className="text-xs hover:bg-muted cursor-pointer">
                          <ExternalLink className="h-3 w-3 mr-1" />
                          LinkedIn
                        </Badge>
                      </a>
                    )}
                    {facultyData?.googleScholarUrl && (
                      <a href={facultyData.googleScholarUrl} target="_blank" rel="noopener noreferrer">
                        <Badge variant="outline" className="text-xs hover:bg-muted cursor-pointer">
                          <Award className="h-3 w-3 mr-1" />
                          Google Scholar
                        </Badge>
                      </a>
                    )}
                  </div>
                )}

                {isEditing && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2 md:col-span-3">
                      <Label htmlFor="faculty-fullname">Full Name</Label>
                      <Input
                        id="faculty-fullname"
                        value={form.fullName}
                        onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="designation">Designation</Label>
                      <Input
                        id="designation"
                        value={form.designation}
                        onChange={(e) => setForm((f) => ({ ...f, designation: e.target.value }))}
                        placeholder="Associate Professor"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="office-location">Office Location</Label>
                      <Input
                        id="office-location"
                        value={form.officeLocation}
                        onChange={(e) => setForm((f) => ({ ...f, officeLocation: e.target.value }))}
                        placeholder="Main Block, Room 204"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="faculty-linkedin">LinkedIn URL</Label>
                      <Input
                        id="faculty-linkedin"
                        type="url"
                        value={form.linkedinUrl}
                        onChange={(e) => setForm((f) => ({ ...f, linkedinUrl: e.target.value }))}
                        placeholder="https://linkedin.com/in/yourname"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="google-scholar">Google Scholar URL</Label>
                      <Input
                        id="google-scholar"
                        type="url"
                        value={form.googleScholarUrl}
                        onChange={(e) => setForm((f) => ({ ...f, googleScholarUrl: e.target.value }))}
                        placeholder="https://scholar.google.com/..."
                      />
                    </div>
                  </div>
                )}

                {/* Qualifications + Subjects, side by side to use width efficiently */}
                {!isEditing && (facultyData?.qualifications || facultyData?.subjectsTaught) && (
                  <div className="grid sm:grid-cols-2 gap-5 pt-3 border-t border-border">
                    {facultyData?.qualifications &&
                      (() => {
                        try {
                          const quals = JSON.parse(facultyData.qualifications) as {
                            degree: string;
                            field: string;
                            institution: string;
                            year: number;
                          }[];
                          if (quals.length === 0) return null;
                          return (
                            <div className="space-y-2">
                              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/75">
                                <GraduationCap className="h-3 w-3 inline mr-1" />
                                Qualifications
                              </p>
                              <div className="space-y-2">
                                {quals.map((q, i) => (
                                  <div key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary/40 mt-1.5 shrink-0" />
                                    <div>
                                      <span className="font-medium text-foreground">{q.degree}</span>
                                      {" — "}
                                      {q.field}
                                      <span className="text-muted-foreground/60"> at {q.institution} ({q.year})</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        } catch {
                          return null;
                        }
                      })()}

                    {facultyData?.subjectsTaught &&
                      (() => {
                        try {
                          const subjects = JSON.parse(facultyData.subjectsTaught) as string[];
                          if (subjects.length === 0) return null;
                          return (
                            <div className="space-y-2">
                              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/75">
                                <BookOpen className="h-3 w-3 inline mr-1" />
                                Subjects Taught
                              </p>
                              <div className="flex flex-wrap gap-1.5">
                                {subjects.map((s, i) => (
                                  <Badge key={i} variant="secondary" className="text-[10px]">
                                    {s}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          );
                        } catch {
                          return null;
                        }
                      })()}
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Sidebar — tabbed to avoid stacked empty cards */}
        <Card>
          <CardContent className="p-5 sm:p-6 space-y-4">
            <Tabs value={activeTab} onValueChange={(v) => setSidebarTab(v as SidebarTabKey)}>
              <TabsList
                className={cn(
                  "h-8 p-0.5 bg-muted w-full grid",
                  sidebarTabs.length === 3 ? "grid-cols-3" : "grid-cols-2"
                )}
              >
                {sidebarTabs.map(({ key, label, icon: Icon }) => (
                  <TabsTrigger key={key} value={key} className="h-7 text-xs cursor-pointer">
                    <Icon className="h-3.5 w-3.5 mr-1" />
                    {label}
                  </TabsTrigger>
                ))}
              </TabsList>

              {hasSkillsTab && (
                <TabsContent value="skills" className="mt-4 space-y-3">
                  <div className="flex flex-wrap gap-1.5">
                    {profile.skills!.map((skill) => (
                      <Badge key={skill.skillId} variant="secondary" className="text-[10px]">
                        {skill.skillName}
                      </Badge>
                    ))}
                  </div>
                </TabsContent>
              )}

              <TabsContent value="events" className="mt-4 space-y-3">
                <div className="flex items-center justify-end">
                  <Link
                    href="/events"
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    View all
                  </Link>
                </div>
                {profile.events.length === 0 ? (
                  <div className="flex flex-col items-center py-8 text-center">
                    <Calendar className="h-6 w-6 text-muted-foreground/60 mb-2" />
                    <p className="text-xs text-muted-foreground">No event summaries yet.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {profile.events.map((eventItem) => (
                      <div key={eventItem.id} className="rounded-lg border border-border p-3 space-y-1">
                        <p className="text-xs font-medium text-foreground">{eventItem.title}</p>
                        <p className="text-[10px] text-muted-foreground">
                          {formatDateTime(eventItem.eventDate)}
                        </p>
                        <p className="text-[10px] text-muted-foreground">{eventItem.location}</p>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="opportunities" className="mt-4 space-y-3">
                <div className="flex items-center justify-end">
                  <Link
                    href="/opportunities"
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    View all
                  </Link>
                </div>
                {profile.opportunities.length === 0 ? (
                  <div className="flex flex-col items-center py-8 text-center">
                    <Briefcase className="h-6 w-6 text-muted-foreground/60 mb-2" />
                    <p className="text-xs text-muted-foreground">No opportunity summaries yet.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {profile.opportunities.map((opp) => (
                      <div key={opp.id} className="rounded-lg border border-border p-3 space-y-1">
                        <p className="text-xs font-medium text-foreground">{opp.title}</p>
                        <p className="text-[10px] text-muted-foreground">
                          {opp.company} &middot; {opp.location}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          {opp.type} &middot; Posted {formatDate(opp.postedAt)}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
