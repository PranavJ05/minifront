"use client";

import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  AlertCircle,
  Briefcase,
  Calendar,
  Camera,
  ExternalLink,
  GraduationCap,
  Loader2,
  Mail,
  MapPin,
  Pencil,
  Plus,
  RefreshCw,
  Trash2,
  UserCircle2,
  X,
} from "lucide-react";
import SkillsSection from "@/components/profile/SkillsSection";
import AddSkillModal from "@/components/profile/AddSkillModal";
import StudentProfile from "@/components/profile/StudentProfile";
import FacultyProfile from "@/components/profile/FacultyProfile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { getAlumniSkillsSummary, getCourses } from "@/lib/api";
import { UserRole, AlumniSkillSummary } from "@/types";
import { hasRole, isStudent, isFaculty } from "@/lib/roleUtils";

const API_BASE = "http://localhost:8080";
const LOG = (...args: unknown[]) => console.log("[ProfilePage]", ...args);
const ERR = (...args: unknown[]) => console.error("[ProfilePage]", ...args);

// ─── Types ────────────────────────────────────────────────────────────────────

type SidebarUser = {
  role: UserRole;
  name: string;
  email: string;
};

interface ProfileEventSummary {
  id: number;
  title: string;
  eventDate: string;
  location: string;
}

interface ProfileOpportunitySummary {
  id: number;
  title: string;
  company: string;
  location: string;
  type: string;
  postedAt: string;
}

interface ProfileResponse {
  userId: number;
  alumniId: number | null;
  name: string;
  email: string;
  profileImageUrl: string | null;
  batchYear: number | null;
  department: string | null;
  location: string | null;
  profession: string | null;
  gmail: string | null;
  linkedinUrl: string | null;
  courseId: number | null;
  courseCode: string | null;
  events: ProfileEventSummary[];
  opportunities: ProfileOpportunitySummary[];
}

interface ProfileFormValues {
  name: string;
  gmail: string;
  batchYear: string;
  department: string;
  location: string;
  profession: string;
  linkedinUrl: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

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

const toFormValues = (profile: ProfileResponse): ProfileFormValues => ({
  name: profile.name || "",
  gmail: profile.gmail || "",
  batchYear: profile.batchYear ? String(profile.batchYear) : "",
  department: profile.department || "",
  location: profile.location || "",
  profession: profile.profession || "",
  linkedinUrl: profile.linkedinUrl || "",
});

const resolveImageUrl = (value: string | null) => {
  if (!value) return null;
  return value.startsWith("http") ? value : `${API_BASE}${value}`;
};

const syncStoredUserName = (name: string) => {
  const stored = localStorage.getItem("alumni_user");
  if (!stored) return;

  try {
    const parsed = JSON.parse(stored);
    parsed.fullName = name;
    parsed.name = name;
    localStorage.setItem("alumni_user", JSON.stringify(parsed));
    window.dispatchEvent(new Event("storage"));
  } catch (error) {
    ERR("Failed to sync stored user name:", error);
  }
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function ProfilePage() {
  const router = useRouter();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [roleChecked, setRoleChecked] = useState(false);

  // Check role on mount and render appropriate component
  useEffect(() => {
    const storedUser = localStorage.getItem("alumni_user");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        const roles = parsed?.roles || parsed?.role || "";
        setUserRole(roles);
      } catch {
        setUserRole(null);
      }
    }
    setRoleChecked(true);
  }, []);

  // If user is a student, render StudentProfile component
  if (roleChecked && isStudent(userRole)) {
    return <StudentProfile />;
  }

  // If user is faculty, render FacultyProfile component
  if (roleChecked && isFaculty(userRole)) {
    return <FacultyProfile />;
  }

  // Otherwise, render the alumni profile (existing code)
  return <AlumniProfileContent />;
}

// Alumni Profile Content (extracted from original component)
function AlumniProfileContent() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // General Profile State
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [sidebarUser, setSidebarUser] = useState<SidebarUser | null>(null);
  const [formValues, setFormValues] = useState<ProfileFormValues>({
    name: "",
    gmail: "",
    batchYear: "",
    department: "",
    location: "",
    profession: "",
    linkedinUrl: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [isRemovingPhoto, setIsRemovingPhoto] = useState(false);

  // Skills Specific State
  const [resolvedCourseId, setResolvedCourseId] = useState<number | null>(null);
  const [skillsData, setSkillsData] = useState<AlumniSkillSummary | null>(null);
  const [skillsLoading, setSkillsLoading] = useState(false);
  const [courseResolving, setCourseResolving] = useState(false);
  const [skillsError, setSkillsError] = useState<string | null>(null);
  const [isAddSkillModalOpen, setIsAddSkillModalOpen] = useState(false);

  // ── Load profile & auth on mount ──────────────────────────────────────────

  useEffect(() => {
    LOG("Mounting and checking auth...");
    const storedUser = localStorage.getItem("alumni_user");
    const token = localStorage.getItem("token");

    if (!storedUser || !token) {
      LOG("Missing auth, redirecting to login");
      router.push("/auth/login");
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);
      // Get all roles or single role
      const userRoles = parsedUser?.roles || parsedUser?.role || "";

      // Check if user has alumni access (alumni OR batch_admin)
      const hasAlumniAccess = hasRole(userRoles, ["alumni", "batch_admin"]);

      // Normalize role for display (batch_admin -> alumni)
      const primaryRole = hasAlumniAccess ? "alumni" : userRoles[0] || "alumni";

      LOG("Parsed user roles:", userRoles, "Primary role:", primaryRole);

      setSidebarUser({
        role: (primaryRole || "alumni") as UserRole,
        name: parsedUser?.fullName || parsedUser?.name || "User",
        email: parsedUser?.email || "",
      });
    } catch (err) {
      ERR("Failed to parse stored user:", err);
      router.push("/auth/login");
      return;
    }

    loadProfile(token);
  }, [router]);

  // ── Resolve courseId after profile loads ──────────────────────────────────

  useEffect(() => {
    if (!profile) return;

    if (profile.courseId) {
      LOG("courseId present in profile:", profile.courseId);
      setResolvedCourseId(profile.courseId);
      return;
    }

    LOG("courseId missing in profile, attempting resolution via /api/courses");
    resolveCourseId(profile);
  }, [profile]);

  // ── Load skills after courseId is resolved ────────────────────────────────

  useEffect(() => {
    if (profile?.alumniId && resolvedCourseId) {
      LOG("Both alumniId and courseId ready — loading skills");
      loadSkills(profile.alumniId);
    }
  }, [resolvedCourseId]);

  // ─── API Functions ─────────────────────────────────────────────────────────

  async function loadProfile(token: string) {
    LOG("loadProfile() called");
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/api/profile/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 401 || res.status === 403) {
        LOG("Auth failed on profile fetch, redirecting");
        router.push("/auth/login");
        return;
      }

      if (!res.ok) {
        const text = await res.text().catch(() => "Unknown error");
        throw new Error(`Failed to load profile (${res.status}): ${text}`);
      }

      const data: ProfileResponse = await res.json();
      LOG("Profile loaded successfully:", {
        alumniId: data.alumniId,
        courseId: data.courseId,
        courseCode: data.courseCode,
      });

      setProfile(data);
      setFormValues(toFormValues(data));
      syncStoredUserName(data.name);
      setSidebarUser((current) =>
        current
          ? {
              ...current,
              name: data.name || current.name,
              email: data.email || current.email,
            }
          : current,
      );
    } catch (err: unknown) {
      ERR("Profile load error:", err);
      setError(err instanceof Error ? err.message : "Failed to load profile");
    } finally {
      setLoading(false);
    }
  }

  async function resolveCourseId(prof: ProfileResponse) {
    LOG("resolveCourseId() called — courseCode:", prof.courseCode);
    setCourseResolving(true);

    try {
      const courses = await getCourses();

      if (prof.courseCode) {
        const match = courses.find(
          (c) => c.code.toLowerCase() === prof.courseCode!.toLowerCase(),
        );
        if (match) {
          LOG("Resolved courseId via courseCode match:", match.id);
          setResolvedCourseId(match.id);
          return;
        }
      }

      if (prof.department) {
        const match = courses.find(
          (c) =>
            c.name.toLowerCase().includes(prof.department!.toLowerCase()) ||
            c.department?.name
              .toLowerCase()
              .includes(prof.department!.toLowerCase()),
        );
        if (match) {
          LOG("Resolved courseId via department match:", match.id);
          setResolvedCourseId(match.id);
          return;
        }
      }

      setSkillsError(
        "Your course could not be determined. Skills cannot be loaded. Please contact support.",
      );
    } catch (err: unknown) {
      ERR("resolveCourseId error:", err);
      setSkillsError("Failed to resolve course information: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      setCourseResolving(false);
    }
  }

  async function loadSkills(alumniId: number) {
    LOG("loadSkills() called for alumniId:", alumniId);
    setSkillsLoading(true);
    setSkillsError(null);

    try {
      const data = await getAlumniSkillsSummary(alumniId);
      LOG("Skills loaded:", data.skills.length, "skills found.");
      setSkillsData(data);
    } catch (err: unknown) {
      ERR("loadSkills error:", err);
      setSkillsError(err instanceof Error ? err.message : "Failed to load skills");
    } finally {
      setSkillsLoading(false);
    }
  }

  function handleSkillsRefresh() {
    if (profile?.alumniId) {
      LOG("Manual skills refresh triggered");
      loadSkills(profile.alumniId);
    }
  }

  // ── Form Actions ──────────────────────────────────────────────────────────

  const updateFormValue = (field: keyof ProfileFormValues, value: string) => {
    setFormValues((current) => ({ ...current, [field]: value }));
  };

  const applyProfile = (nextProfile: ProfileResponse, message?: string) => {
    setProfile(nextProfile);
    setFormValues(toFormValues(nextProfile));
    syncStoredUserName(nextProfile.name);
    setSidebarUser((current) =>
      current
        ? {
            ...current,
            name: nextProfile.name || current.name,
            email: nextProfile.email || current.email,
          }
        : current,
    );
    if (message) setSuccessMessage(message);
  };

  const handleSaveProfile = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const token = localStorage.getItem("token");
    if (!token || !profile) {
      router.push("/auth/login");
      return;
    }

    setIsSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const payload = {
        name: formValues.name.trim(),
        gmail: formValues.gmail.trim() || null,
        batchYear: formValues.batchYear ? Number(formValues.batchYear) : null,
        department: formValues.department.trim() || null,
        location: formValues.location.trim() || null,
        profession: formValues.profession.trim() || null,
        linkedinUrl: formValues.linkedinUrl.trim() || null,
      };

      const res = await fetch(`${API_BASE}/api/profile/me`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorBody = await res.json().catch(() => null);
        throw new Error(errorBody?.message || "Failed to update profile");
      }

      const data: ProfileResponse = await res.json();
      applyProfile(data, "Profile updated successfully.");
      setIsEditing(false);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePhotoSelected = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    const token = localStorage.getItem("token");

    if (!file || !token || !profile) return;

    setIsUploadingPhoto(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(`${API_BASE}/api/profile/me/photo`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const body = await res.json().catch(() => null);
      if (!res.ok)
        throw new Error(body?.message || "Failed to upload profile photo");

      applyProfile(
        {
          ...profile,
          profileImageUrl: body?.profileImageUrl ?? profile.profileImageUrl,
        },
        body?.message || "Profile photo updated successfully.",
      );
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to upload profile photo");
    } finally {
      setIsUploadingPhoto(false);
      if (event.target) event.target.value = "";
    }
  };

  const handleRemovePhoto = async () => {
    const token = localStorage.getItem("token");
    if (!token || !profile?.profileImageUrl) return;

    setIsRemovingPhoto(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const res = await fetch(`${API_BASE}/api/profile/me/photo`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const body = await res.json().catch(() => null);
      if (!res.ok)
        throw new Error(body?.message || "Failed to remove profile photo");

      applyProfile(
        { ...profile, profileImageUrl: null },
        body?.message || "Profile photo removed successfully.",
      );
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to remove profile photo");
    } finally {
      setIsRemovingPhoto(false);
    }
  };

  // ── Render ──────────────────────────────────────────────────────────────────

  if (loading || !sidebarUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const profileImageSrc = resolveImageUrl(profile?.profileImageUrl || null);
  const canUseSkills = !!(profile?.alumniId && resolvedCourseId);
  const existingSkillIds = skillsData?.skills.map((s) => s.skillId) ?? [];

  return (
    <main className="flex-1 overflow-auto">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="text-sm font-medium text-primary uppercase tracking-wide">
              Profile
            </p>
            <h1 className="font-serif text-3xl font-bold text-foreground mt-1">
              My Profile
            </h1>
            <p className="text-muted-foreground mt-2 max-w-2xl">
              Edit your public identity, update your contact details, and
              manage your profile photo and skills.
            </p>
          </div>

          {profile && (
            <div className="flex items-center gap-3">
              {isEditing ? (
                <Button
                  variant="outline"
                  onClick={() => {
                    setFormValues(toFormValues(profile));
                    setIsEditing(false);
                    setSuccessMessage(null);
                  }}
                  className="cursor-pointer"
                >
                  <X className="h-4 w-4" /> Cancel
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    setIsEditing(true);
                    setSuccessMessage(null);
                  }}
                  className="cursor-pointer"
                >
                  <Pencil className="h-4 w-4" /> Edit Profile
                </Button>
              )}
            </div>
          )}
        </div>

        {/* System Messages */}
        {error && (
          <Alert variant="destructive" className="bg-destructive/10 border-destructive/20 text-destructive">
            <AlertCircle className="h-5 w-5" />
            <div>
              <AlertTitle>Something went wrong</AlertTitle>
              <AlertDescription className="mt-1">{error}</AlertDescription>
            </div>
          </Alert>
        )}

        {successMessage && (
          <Alert className="bg-green-500/10 border-green-500/20 text-green-600">
            <AlertTitle className="text-sm font-medium">{successMessage}</AlertTitle>
          </Alert>
        )}

        {profile && (
          <>
            {/* Profile Card & Quick Links */}
            <section className="grid xl:grid-cols-[1.2fr,0.8fr] gap-6">
              <div className="bg-card text-card-foreground rounded-2xl border border-border shadow-sm p-6">
                <div className="flex flex-col sm:flex-row items-start gap-6">
                  <div className="relative flex-shrink-0">
                    <div className="w-32 h-32 rounded-full overflow-hidden bg-muted border-4 border-white shadow-lg flex items-center justify-center text-primary">
                      {profileImageSrc ? (
                        <img
                          src={profileImageSrc}
                          alt={profile.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <UserCircle2 className="h-20 w-20" />
                      )}
                    </div>

                    <Button
                      variant="default"
                      size="icon"
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploadingPhoto}
                      className="absolute bottom-1 right-1 w-10 h-10 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/80 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                      aria-label="Update profile photo"
                    >
                      {isUploadingPhoto ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Camera className="h-4 w-4" />
                      )}
                    </Button>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      className="hidden"
                      onChange={handlePhotoSelected}
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div>
                        <h2 className="font-serif text-3xl font-bold text-foreground">
                          {profile.name}
                        </h2>
                        <p className="text-primary font-semibold mt-1">
                          {profile.profession || "Profession not added"}
                        </p>
                      </div>

                      {profile.profileImageUrl && (
                        <Button
                          variant="destructive"
                          size="sm"
                          type="button"
                          onClick={handleRemovePhoto}
                          disabled={isRemovingPhoto}
                          className="cursor-pointer"
                        >
                          {isRemovingPhoto ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                          Remove photo
                        </Button>
                      )}
                    </div>

                    <div className="mt-5 grid sm:grid-cols-2 gap-3 text-sm text-muted-foreground">
                      <p className="flex items-center gap-2 rounded-xl bg-muted/50 px-3 py-3">
                        <Mail className="h-4 w-4 text-primary" />
                        <span className="truncate">{profile.email}</span>
                      </p>
                      <p className="flex items-center gap-2 rounded-xl bg-muted/50 px-3 py-3">
                        <MapPin className="h-4 w-4 text-primary" />
                        <span>
                          {profile.location || "Location not added"}
                        </span>
                      </p>
                      <p className="flex items-center gap-2 rounded-xl bg-muted/50 px-3 py-3">
                        <GraduationCap className="h-4 w-4 text-primary" />
                        <span>
                          {profile.department || "Department not added"}
                        </span>
                      </p>
                      <p className="flex items-center gap-2 rounded-xl bg-muted/50 px-3 py-3">
                        <Mail className="h-4 w-4 text-primary" />
                        <span className="truncate">
                          {profile.batchYear || "Year not added"}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-card text-card-foreground rounded-2xl border border-border shadow-sm p-6">
                <h2 className="font-bold text-foreground mb-4">Quick Links</h2>
                <div className="space-y-3 text-sm">
                  <Link
                    href="/events"
                    className="flex items-center justify-between rounded-xl border border-border px-4 py-3 text-primary hover:bg-muted"
                  >
                    <span className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" /> My Events
                    </span>
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/opportunities"
                    className="flex items-center justify-between rounded-xl border border-border px-4 py-3 text-primary hover:bg-muted"
                  >
                    <span className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4" /> My Opportunities
                    </span>
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                  {profile.linkedinUrl && (
                    <a
                      href={profile.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between rounded-xl border border-border px-4 py-3 text-primary hover:bg-muted"
                    >
                      <span className="flex items-center gap-2">
                        <ExternalLink className="h-4 w-4" /> LinkedIn
                      </span>
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </div>
            </section>

            {/* Edit Details Form & Skills & History */}
            <section className="grid xl:grid-cols-[1fr,0.9fr] gap-6">
              {/* Edit details form */}
              <form
                onSubmit={handleSaveProfile}
                className="bg-card text-card-foreground rounded-2xl border border-border shadow-sm p-6 h-fit space-y-5"
              >
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div>
                    <h2 className="font-bold text-foreground text-lg">
                      Edit Details
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      Update the fields that appear on your profile.
                    </p>
                  </div>
                  {isEditing && (
                    <Button
                      type="submit"
                      disabled={isSaving}
                      className="cursor-pointer"
                    >
                      {isSaving && (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      )}
                      Save Changes
                    </Button>
                  )}
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <label className="text-sm font-medium text-foreground">
                    Full Name
                    <Input
                      type="text"
                      value={formValues.name}
                      onChange={(e) =>
                        updateFormValue("name", e.target.value)
                      }
                      disabled={!isEditing || isSaving}
                      className="mt-1.5"
                    />
                  </label>

                  <label className="text-sm font-medium text-foreground">
                    Personal Email (Optional)
                    <Input
                      type="email"
                      value={formValues.gmail}
                      onChange={(e) =>
                        updateFormValue("gmail", e.target.value)
                      }
                      disabled={!isEditing || isSaving}
                      className="mt-1.5"
                    />
                  </label>

                  <label className="text-sm font-medium text-foreground">
                    Batch Year
                    <Input
                      type="number"
                      value={formValues.batchYear}
                      onChange={(e) =>
                        updateFormValue("batchYear", e.target.value)
                      }
                      disabled={!isEditing || isSaving}
                      className="mt-1.5"
                    />
                  </label>

                  <label className="text-sm font-medium text-foreground">
                    Department
                    <Input
                      type="text"
                      value={formValues.department}
                      onChange={(e) =>
                        updateFormValue("department", e.target.value)
                      }
                      disabled={!isEditing || isSaving}
                      className="mt-1.5"
                    />
                  </label>

                  <label className="text-sm font-medium text-foreground sm:col-span-2">
                    Location
                    <Input
                      type="text"
                      value={formValues.location}
                      onChange={(e) =>
                        updateFormValue("location", e.target.value)
                      }
                      disabled={!isEditing || isSaving}
                      className="mt-1.5"
                    />
                  </label>

                  <label className="text-sm font-medium text-foreground sm:col-span-2">
                    Profession
                    <Input
                      type="text"
                      value={formValues.profession}
                      onChange={(e) =>
                        updateFormValue("profession", e.target.value)
                      }
                      disabled={!isEditing || isSaving}
                      className="mt-1.5"
                    />
                  </label>

                  <label className="text-sm font-medium text-foreground sm:col-span-2">
                    LinkedIn URL
                    <Input
                      type="url"
                      value={formValues.linkedinUrl}
                      onChange={(e) =>
                        updateFormValue("linkedinUrl", e.target.value)
                      }
                      disabled={!isEditing || isSaving}
                      className="mt-1.5"
                    />
                  </label>
                </div>
              </form>

              <div className="space-y-6">
                {/* Robust Skills Section */}
                <div className="bg-card text-card-foreground rounded-2xl border border-border shadow-sm p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="font-serif text-xl font-bold text-foreground">
                      Skills & Expertise
                    </h2>
                  </div>

                  {/* Diagnostics panel: No Alumni Record */}
                  {!profile.alumniId && (
                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-yellow-600">
                            Alumni profile not linked
                          </p>
                          <p className="text-sm text-yellow-600 mt-1">
                            Your account is not linked to an alumni record.
                            Skills cannot be managed.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Diagnostics panel: Resolving Course */}
                  {profile.alumniId &&
                    !resolvedCourseId &&
                    courseResolving && (
                      <div className="bg-muted/50 rounded-xl border border-border/50 p-4 flex items-center gap-3">
                        <Loader2 className="h-5 w-5 animate-spin text-primary" />
                        <p className="text-sm text-muted-foreground">
                          Resolving course information…
                        </p>
                      </div>
                    )}

                  {/* Diagnostics panel: Course Missing */}
                  {profile.alumniId &&
                    !resolvedCourseId &&
                    !courseResolving &&
                    !skillsError && (
                      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
                        <div className="flex items-start gap-3">
                          <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-semibold text-yellow-600">
                              Course not found in profile
                            </p>
                            <p className="text-sm text-yellow-600 mt-1">
                              Your course could not be mapped. Skills cannot
                              be added until your department is updated.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                  {/* Skills Component Integration */}
                  <SkillsSection
                    alumniId={profile.alumniId}
                    resolvedCourseId={resolvedCourseId}
                    skillsData={skillsData}
                    isLoading={skillsLoading}
                    isResolving={courseResolving}
                    error={skillsError}
                    canEdit={canUseSkills}
                    onAddSkillClick={() => setIsAddSkillModalOpen(true)}
                    onSkillRemoved={handleSkillsRefresh}
                    onRetry={handleSkillsRefresh}
                  />
                </div>

                {/* My Events */}
                <section className="bg-card text-card-foreground rounded-2xl border border-border shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-bold text-foreground">My Events</h2>
                    <Link
                      href="/events"
                      className="text-sm text-primary font-medium"
                    >
                      View all
                    </Link>
                  </div>
                  {profile.events.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No event summaries available yet.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {profile.events.map((eventItem) => (
                        <div
                          key={eventItem.id}
                          className="rounded-xl border border-border p-4"
                        >
                          <p className="font-semibold text-foreground">
                            {eventItem.title}
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {formatDateTime(eventItem.eventDate)}
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {eventItem.location}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </section>

                {/* My Opportunities */}
                <section className="bg-card text-card-foreground rounded-2xl border border-border shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-bold text-foreground">
                      My Opportunities
                    </h2>
                    <Link
                      href="/opportunities"
                      className="text-sm text-primary font-medium"
                    >
                      View all
                    </Link>
                  </div>
                  {profile.opportunities.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No opportunity summaries available yet.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {profile.opportunities.map((opportunity) => (
                        <div
                          key={opportunity.id}
                          className="rounded-xl border border-border p-4"
                        >
                          <p className="font-semibold text-foreground">
                            {opportunity.title}
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {opportunity.company} • {opportunity.location}
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {opportunity.type} • Posted{" "}
                            {formatDate(opportunity.postedAt)}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}
