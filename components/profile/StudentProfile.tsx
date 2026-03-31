"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  ExternalLink,
  GraduationCap,
  Loader2,
  Pencil,
  Save,
  X,
  Linkedin,
  Github,
  Globe,
  CheckCircle,
  AlertCircle,
  Book,
  Award,
  CalendarDays,
  UserCircle,
  Mail,
  FileText,
} from "lucide-react";
import DashboardSidebar from "@/components/layout/DashboardSidebar";
import { getInitials } from "@/lib/utils";

const API_BASE = "http://localhost:8080";

interface StudentProfile {
  userId: number;
  name: string;
  email: string;
  profileImageUrl: string | null;
  studentId: number | null;
  rollNumber: string;
  fullName: string;
  batchYear: number | null;
  courseCode: string | null;
  courseName: string | null;
  branchCode: string | null;
  branchName: string | null;
  currentSemester: number | null;
  cgpa: number | null;
  linkedinUrl: string | null;
  githubUrl: string | null;
  portfolioUrl: string | null;
  profileUrl: string | null;
  bio: string | null;
  verified: boolean;
}

interface FormValues {
  fullName: string;
  currentSemester: string;
  cgpa: string;
  linkedinUrl: string;
  githubUrl: string;
  portfolioUrl: string;
  bio: string;
}

export default function StudentProfilePage() {
  const router = useRouter();

  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [sidebarUser, setSidebarUser] = useState<{
    role: string;
    name: string;
    email: string;
  } | null>(null);
  const [formValues, setFormValues] = useState<FormValues>({
    fullName: "",
    currentSemester: "",
    cgpa: "",
    linkedinUrl: "",
    githubUrl: "",
    portfolioUrl: "",
    bio: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Load profile on mount
  useEffect(() => {
    loadProfile();
  }, []);

  // Sync sidebar user
  useEffect(() => {
    if (profile) {
      setSidebarUser({
        role: "student",
        name: profile.fullName || profile.name || "",
        email: profile.email,
      });
    }
  }, [profile]);

  // Populate form when profile loads
  useEffect(() => {
    if (profile && !isEditing) {
      setFormValues({
        fullName: profile.fullName || "",
        currentSemester: profile.currentSemester?.toString() || "",
        cgpa: profile.cgpa?.toString() || "",
        linkedinUrl: profile.linkedinUrl || "",
        githubUrl: profile.githubUrl || "",
        portfolioUrl: profile.portfolioUrl || "",
        bio: profile.bio || "",
      });
    }
  }, [profile, isEditing]);

  async function loadProfile() {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/auth/login");
        return;
      }

      const res = await fetch(`${API_BASE}/students/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        if (res.status === 401) {
          router.push("/auth/login");
          return;
        }
        throw new Error(`Failed to load profile: ${res.status}`);
      }

      const data: StudentProfile = await res.json();
      setProfile(data);
    } catch (err: any) {
      setError(err.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  }

  const updateFormValue = (field: keyof FormValues, value: string) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
  };

  async function handleSaveProfile() {
    setIsSaving(true);
    setSuccessMessage(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Not authenticated");

      const payload = {
        fullName: formValues.fullName,
        currentSemester: formValues.currentSemester
          ? parseInt(formValues.currentSemester)
          : undefined,
        cgpa: formValues.cgpa ? parseFloat(formValues.cgpa) : undefined,
        linkedinUrl: formValues.linkedinUrl || undefined,
        githubUrl: formValues.githubUrl || undefined,
        portfolioUrl: formValues.portfolioUrl || undefined,
        bio: formValues.bio || undefined,
      };

      const res = await fetch(`${API_BASE}/students/profile`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to update profile");
      }

      const updatedProfile: StudentProfile = await res.json();
      setProfile(updatedProfile);
      setIsEditing(false);
      setSuccessMessage("Profile updated successfully!");

      // Update sidebar user
      setSidebarUser((prev) =>
        prev ? { ...prev, name: updatedProfile.fullName } : null,
      );

      // Update stored user data
      const stored = localStorage.getItem("alumni_user");
      if (stored) {
        const parsed = JSON.parse(stored);
        parsed.fullName = updatedProfile.fullName;
        localStorage.setItem("alumni_user", JSON.stringify(parsed));
      }

      // Auto-hide success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to save profile");
    } finally {
      setIsSaving(false);
    }
  }

  const profileImageSrc = profile?.profileImageUrl || profile?.profileUrl;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center flex flex-col items-center">
          <Loader2 className="h-10 w-10 animate-spin text-gold-500 mb-4" />
          <p className="text-navy-900 font-medium tracking-wide">
            Loading your profile...
          </p>
        </div>
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <DashboardSidebar role="student" userName="" userEmail="" />
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="text-center max-w-md bg-white p-8 rounded-2xl shadow-sm border border-red-100">
            <AlertCircle className="h-14 w-14 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-navy-900 mb-2">
              Oops! Something went wrong
            </h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={loadProfile}
              className="btn-primary w-full justify-center"
            >
              Try Again
            </button>
          </div>
        </main>
      </div>
    );
  }

  // Common input styling for edit mode
  const inputClass =
    "w-full bg-gray-50 border border-gray-200 text-navy-900 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:bg-white transition-all";

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex">
      {sidebarUser && (
        <DashboardSidebar
          role="student"
          userName={sidebarUser.name}
          userEmail={sidebarUser.email}
        />
      )}

      <main className="flex-1 overflow-auto p-12">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-serif text-3xl font-bold text-navy-950">
              Student Profile
            </h1>
            <p className="text-gray-500 mt-1">
              Manage your academic and professional identity.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-navy-900 font-medium rounded-xl hover:bg-gray-50 hover:border-gray-300 shadow-sm transition-all"
              >
                <Pencil className="h-4 w-4 text-gray-500" />
                Edit Profile
              </button>
            ) : (
              <>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    // Reset form
                    setFormValues({
                      fullName: profile?.fullName || "",
                      currentSemester:
                        profile?.currentSemester?.toString() || "",
                      cgpa: profile?.cgpa?.toString() || "",
                      linkedinUrl: profile?.linkedinUrl || "",
                      githubUrl: profile?.githubUrl || "",
                      portfolioUrl: profile?.portfolioUrl || "",
                      bio: profile?.bio || "",
                    });
                  }}
                  className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-gray-600 font-medium rounded-xl hover:bg-gray-50 transition-all"
                >
                  <X className="h-4 w-4" /> Cancel
                </button>
                <button
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-6 py-2.5 bg-navy-900 text-white font-medium rounded-xl hover:bg-navy-800 shadow-md shadow-navy-900/20 disabled:opacity-70 transition-all"
                >
                  {isSaving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 text-gold-400" />
                  )}
                  {isSaving ? "Saving..." : "Save Profile"}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Notifications */}
        {successMessage && (
          <div className="bg-green-50/80 border border-green-200 text-green-800 px-4 py-3 rounded-xl mb-6 flex items-center gap-3 shadow-sm backdrop-blur-sm animate-in fade-in slide-in-from-top-4">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <p className="font-medium">{successMessage}</p>
          </div>
        )}
        {error && (
          <div className="bg-red-50/80 border border-red-200 text-red-800 px-4 py-3 rounded-xl mb-6 flex items-center gap-3 shadow-sm backdrop-blur-sm">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <p className="font-medium">{error}</p>
          </div>
        )}

        <div className="flex flex-col gap-6">
          {/* 1. HERO / MAIN PROFILE CARD */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Cover Banner */}
            <div className="h-32 sm:h-48 bg-gradient-to-r from-navy-950 via-navy-900 to-navy-800 relative">
              <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
              {profile?.verified && (
                <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-full shadow-sm">
                  <CheckCircle className="h-4 w-4 text-gold-400" />
                  <span className="text-white text-xs font-semibold tracking-wide uppercase">
                    Verified
                  </span>
                </div>
              )}
            </div>

            {/* Avatar & Basic Info */}
            <div className="px-6 sm:px-10 pb-8 relative">
              <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-start sm:items-end -mt-16 sm:-mt-20 mb-4">
                {/* Avatar */}
                <div className="w-32 h-32 rounded-2xl bg-white p-1.5 shadow-md flex-shrink-0 relative z-10">
                  <div className="w-full h-full rounded-xl overflow-hidden bg-gray-100 border border-gray-100 flex items-center justify-center">
                    {profileImageSrc ? (
                      <Image
                        src={profileImageSrc}
                        alt={profile?.fullName || "Profile"}
                        width={128}
                        height={128}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-navy-300 font-serif font-bold text-4xl">
                        {getInitials(
                          profile?.fullName || profile?.name || "Student",
                        )}
                      </span>
                    )}
                  </div>
                </div>

                {/* Name & Title */}
                <div className="flex-1 pb-2 w-full">
                  {isEditing ? (
                    <div className="space-y-1.5 w-full max-w-md">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">
                        Full Name
                      </label>
                      <div className="relative">
                        <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="text"
                          value={formValues.fullName}
                          onChange={(e) =>
                            updateFormValue("fullName", e.target.value)
                          }
                          className={`${inputClass} pl-10 text-lg font-bold`}
                          placeholder="Your Full Name"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="pt-12">
                      <h2 className="text-2xl sm:text-3xl font-bold text-navy-950  items-center md:pt-12 gap-2">
                        {profile?.fullName}
                        {profile?.verified && (
                          <CheckCircle
                            className="h-5 w-5 text-gold-500"
                            fill="currentColor"
                            stroke="white"
                          />
                        )}
                      </h2>
                      <p className="text-lg text-gray-600 font-medium mt-1">
                        Student at Model Engineering College
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Secondary Details row */}
              <div className="flex flex-wrap items-center gap-y-3 gap-x-6 text-sm text-gray-600 mt-2">
                <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                  <FileText className="h-4 w-4 text-gray-400" />
                  <span className="font-mono text-navy-800 font-medium">
                    {profile?.rollNumber}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span>{profile?.email}</span>
                </div>
                {profile?.branchName && (
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-gray-400" />
                    <span>{profile.branchName}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Bio Section attached to main card */}
            <div className="px-6 sm:px-10 py-6 border-t border-gray-100 bg-gray-50/30">
              <h3 className="text-sm font-bold text-navy-900 uppercase tracking-wider mb-3">
                About Me
              </h3>
              {isEditing ? (
                <textarea
                  value={formValues.bio}
                  onChange={(e) => updateFormValue("bio", e.target.value)}
                  rows={4}
                  className={`${inputClass} resize-y min-h-[100px] leading-relaxed`}
                  placeholder="Write a short professional bio highlighting your goals, interests, and background..."
                />
              ) : (
                <p className="text-gray-600 leading-relaxed max-w-4xl whitespace-pre-wrap">
                  {profile?.bio || (
                    <span className="italic text-gray-400">
                      No bio added yet. Click edit to add one.
                    </span>
                  )}
                </p>
              )}
            </div>
          </div>

          {/* 2. DETAILS GRID */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Academic Information Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-serif text-xl font-bold text-navy-950 flex items-center gap-2">
                  <Book className="h-5 w-5 text-gold-500" />
                  Academics
                </h3>
              </div>

              <div className="space-y-6">
                {/* Read Only Fields */}
                <div className="grid grid-cols-2 gap-4 pb-6 border-b border-gray-100">
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                      Course
                    </p>
                    <p className="font-medium text-navy-900">
                      {profile?.courseName || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                      Batch
                    </p>
                    <p className="font-medium text-navy-900 flex items-center gap-1.5">
                      <CalendarDays className="h-4 w-4 text-gray-400" />
                      Class of {profile?.batchYear || "N/A"}
                    </p>
                  </div>
                </div>

                {/* Editable Fields */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                      Semester
                    </p>
                    {isEditing ? (
                      <input
                        type="number"
                        value={formValues.currentSemester}
                        onChange={(e) =>
                          updateFormValue("currentSemester", e.target.value)
                        }
                        className={inputClass}
                        min="1"
                        max="8"
                        placeholder="1-8"
                      />
                    ) : (
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-navy-50 text-navy-900 font-bold flex items-center justify-center">
                          {profile?.currentSemester || "-"}
                        </div>
                        <span className="text-sm text-gray-500 font-medium">
                          Sem
                        </span>
                      </div>
                    )}
                  </div>

                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                      CGPA
                    </p>
                    {isEditing ? (
                      <input
                        type="number"
                        value={formValues.cgpa}
                        onChange={(e) =>
                          updateFormValue("cgpa", e.target.value)
                        }
                        className={inputClass}
                        min="0"
                        max="10"
                        step="0.01"
                        placeholder="e.g. 8.5"
                      />
                    ) : (
                      <div className="flex items-center gap-2">
                        <div className="w-auto px-3 h-8 rounded-lg bg-gold-50 text-gold-700 font-bold flex items-center justify-center">
                          {profile?.cgpa?.toFixed(2) || "-"}
                        </div>
                        <Award className="h-4 w-4 text-gold-400" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Social & Links Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-serif text-xl font-bold text-navy-950 flex items-center gap-2">
                  <Globe className="h-5 w-5 text-gold-500" />
                  Web Presence
                </h3>
              </div>

              <div className="space-y-5">
                {/* LinkedIn */}
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                    LinkedIn Profile
                  </p>
                  {isEditing ? (
                    <div className="relative">
                      <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="url"
                        value={formValues.linkedinUrl}
                        onChange={(e) =>
                          updateFormValue("linkedinUrl", e.target.value)
                        }
                        className={`${inputClass} pl-9`}
                        placeholder="https://linkedin.com/in/yourname"
                      />
                    </div>
                  ) : profile?.linkedinUrl ? (
                    <a
                      href={profile.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between p-3 rounded-xl border border-gray-100 bg-gray-50 hover:bg-blue-50 hover:border-blue-100 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white rounded-lg shadow-sm text-[#0077b5]">
                          <Linkedin className="h-4 w-4" />
                        </div>
                        <span className="text-sm font-medium text-gray-700 group-hover:text-blue-700 truncate max-w-[200px]">
                          {profile.linkedinUrl.replace(
                            "https://www.linkedin.com/in/",
                            "",
                          )}
                        </span>
                      </div>
                      <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-blue-500" />
                    </a>
                  ) : (
                    <div className="text-sm text-gray-400 italic p-3 border border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                      Not connected
                    </div>
                  )}
                </div>

                {/* GitHub */}
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                    GitHub Profile
                  </p>
                  {isEditing ? (
                    <div className="relative">
                      <Github className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="url"
                        value={formValues.githubUrl}
                        onChange={(e) =>
                          updateFormValue("githubUrl", e.target.value)
                        }
                        className={`${inputClass} pl-9`}
                        placeholder="https://github.com/yourname"
                      />
                    </div>
                  ) : profile?.githubUrl ? (
                    <a
                      href={profile.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between p-3 rounded-xl border border-gray-100 bg-gray-50 hover:bg-gray-100 hover:border-gray-300 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white rounded-lg shadow-sm text-gray-900">
                          <Github className="h-4 w-4" />
                        </div>
                        <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 truncate max-w-[200px]">
                          {profile.githubUrl.replace("https://github.com/", "")}
                        </span>
                      </div>
                      <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
                    </a>
                  ) : (
                    <div className="text-sm text-gray-400 italic p-3 border border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                      Not connected
                    </div>
                  )}
                </div>

                {/* Portfolio */}
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Personal Portfolio
                  </p>
                  {isEditing ? (
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="url"
                        value={formValues.portfolioUrl}
                        onChange={(e) =>
                          updateFormValue("portfolioUrl", e.target.value)
                        }
                        className={`${inputClass} pl-9`}
                        placeholder="https://yourportfolio.com"
                      />
                    </div>
                  ) : profile?.portfolioUrl ? (
                    <a
                      href={profile.portfolioUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between p-3 rounded-xl border border-gray-100 bg-gray-50 hover:bg-gold-50 hover:border-gold-100 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white rounded-lg shadow-sm text-gold-600">
                          <Globe className="h-4 w-4" />
                        </div>
                        <span className="text-sm font-medium text-gray-700 group-hover:text-gold-700 truncate max-w-[200px]">
                          {new URL(profile.portfolioUrl).hostname}
                        </span>
                      </div>
                      <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-gold-600" />
                    </a>
                  ) : (
                    <div className="text-sm text-gray-400 italic p-3 border border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                      Not connected
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
