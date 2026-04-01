"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  ExternalLink,
  GraduationCap,
  Loader2,
  Mail,
  MapPin,
  Pencil,
  Save,
  X,
  Linkedin,
  Award,
  CheckCircle,
  AlertCircle,
  BookOpen,
  Clock,
  Building2,
  Briefcase,
  UserCircle,
  Link as LinkIcon,
  Library,
} from "lucide-react";
import DashboardSidebar from "@/components/layout/DashboardSidebar";
import { getInitials } from "@/lib/utils";

const API_BASE = "http://localhost:8080";

interface Qualification {
  degree: string;
  field: string;
  institution: string;
  year: number;
}

interface FacultyProfile {
  userId: number;
  name: string;
  email: string;
  profileImageUrl: string | null;
  fullName: string;
  designation: string;
  departmentCode: string;
  departmentName: string;
  officeLocation: string | null;
  qualifications: string; // JSON string
  subjectsTaught: string; // JSON string
  linkedinUrl: string | null;
  googleScholarUrl: string | null;
  totalExperienceYears: number;
  joinDate: string;
  bio: string | null;
}

interface FormValues {
  fullName: string;
  designation: string;
  officeLocation: string;
  linkedinUrl: string;
  googleScholarUrl: string;
  bio: string;
}

export default function FacultyProfilePage() {
  const router = useRouter();

  const [profile, setProfile] = useState<FacultyProfile | null>(null);
  const [sidebarUser, setSidebarUser] = useState<{
    role: string;
    name: string;
    email: string;
  } | null>(null);
  const [formValues, setFormValues] = useState<FormValues>({
    fullName: "",
    designation: "",
    officeLocation: "",
    linkedinUrl: "",
    googleScholarUrl: "",
    bio: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Parsed data
  const [qualifications, setQualifications] = useState<Qualification[]>([]);
  const [subjectsTaught, setSubjectsTaught] = useState<string[]>([]);

  // Load profile on mount
  useEffect(() => {
    loadProfile();
  }, []);

  // Sync sidebar user
  useEffect(() => {
    if (profile) {
      setSidebarUser({
        role: "faculty",
        name: profile.fullName,
        email: profile.email,
      });
    }
  }, [profile]);

  // Parse JSON fields when profile loads
  useEffect(() => {
    if (profile) {
      try {
        if (profile.qualifications) {
          setQualifications(JSON.parse(profile.qualifications));
        }
        if (profile.subjectsTaught) {
          setSubjectsTaught(JSON.parse(profile.subjectsTaught));
        }
      } catch (err) {
        console.error("Failed to parse JSON fields:", err);
      }
    }
  }, [profile]);

  // Populate form when profile loads
  useEffect(() => {
    if (profile && !isEditing) {
      setFormValues({
        fullName: profile.fullName || "",
        designation: profile.designation || "",
        officeLocation: profile.officeLocation || "",
        linkedinUrl: profile.linkedinUrl || "",
        googleScholarUrl: profile.googleScholarUrl || "",
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

      const res = await fetch(`${API_BASE}/api/faculty/profile`, {
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

      const data: FacultyProfile = await res.json();
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
        designation: formValues.designation,
        officeLocation: formValues.officeLocation,
        linkedinUrl: formValues.linkedinUrl || undefined,
        googleScholarUrl: formValues.googleScholarUrl || undefined,
        bio: formValues.bio || undefined,
      };

      const res = await fetch(`${API_BASE}/api/faculty/profile`, {
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

      const updatedProfile: FacultyProfile = await res.json();
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

      // Auto-hide success message
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to save profile");
    } finally {
      setIsSaving(false);
    }
  }

  const profileImageSrc = profile?.profileImageUrl;

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
      <div className="min-h-screen bg-[#f8f9fa] flex">
        <DashboardSidebar role="faculty" userName="" userEmail="" />
        <main className="flex-1 overflow-auto p-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
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
          role="faculty"
          userName={sidebarUser.name}
          userEmail={sidebarUser.email}
        />
      )}

      <main className="flex-1 overflow-auto p-12">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-serif text-3xl font-bold text-navy-950">
              Faculty Profile
            </h1>
            <p className="text-gray-500 mt-1">
              Manage your academic profile and professional details.
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
                      designation: profile?.designation || "",
                      officeLocation: profile?.officeLocation || "",
                      linkedinUrl: profile?.linkedinUrl || "",
                      googleScholarUrl: profile?.googleScholarUrl || "",
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
              {/* Faculty Badge */}
              <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-gold-500/20 backdrop-blur-md border border-gold-500/30 px-3 py-1.5 rounded-full shadow-sm">
                <Library className="h-4 w-4 text-gold-400" />
                <span className="text-gold-100 text-xs font-bold tracking-wide uppercase">
                  Faculty Member
                </span>
              </div>
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
                          profile?.fullName || profile?.name || "Faculty",
                        )}
                      </span>
                    )}
                  </div>
                </div>

                {/* Name & Title */}
                <div className="flex-1 pb-2 -pt-4 w-full">
                  {isEditing ? (
                    <div className="space-y-3 w-full max-w-lg">
                      <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">
                          Full Name
                        </label>
                        <div className="relative mt-1">
                          <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input
                            type="text"
                            value={formValues.fullName}
                            onChange={(e) =>
                              updateFormValue("fullName", e.target.value)
                            }
                            className={`${inputClass} pl-10 text-lg font-bold`}
                            placeholder="Dr. Jane Doe"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">
                          Designation
                        </label>
                        <div className="relative mt-1">
                          <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <input
                            type="text"
                            value={formValues.designation}
                            onChange={(e) =>
                              updateFormValue("designation", e.target.value)
                            }
                            className={`${inputClass} pl-9`}
                            placeholder="Associate Professor"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="-mt-12 ">
                      <h2 className="text-2xl  font-bold text-white py-4 items-center  ">
                        {profile?.fullName}
                      </h2>
                      <p className="text-lg text-gray-600 font-medium">
                        {profile?.designation}
                      </p>
                    </div>
                  )}
                </div>

                {/* Experience Badge */}
                {!isEditing && profile?.totalExperienceYears ? (
                  <div className="hidden sm:flex flex-col items-center justify-center bg-navy-50 border border-navy-100 rounded-2xl px-5 py-3 shadow-sm">
                    <span className="text-2xl font-bold text-navy-900">
                      {profile.totalExperienceYears}
                    </span>
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Years Exp.
                    </span>
                  </div>
                ) : null}
              </div>

              {/* Secondary Details Row */}
              <div className="flex flex-wrap items-center gap-y-3 gap-x-6 text-sm text-gray-600 mt-4">
                <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="text-navy-800 font-medium">
                    {profile?.email}
                  </span>
                </div>

                {profile?.departmentName && (
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-gray-400" />
                    <span>{profile.departmentName}</span>
                  </div>
                )}

                {profile?.joinDate && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span>
                      Joined {new Date(profile.joinDate).getFullYear()}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Bio Section */}
            <div className="px-6 sm:px-10 py-6 border-t border-gray-100 bg-gray-50/30">
              <h3 className="text-sm font-bold text-navy-900 uppercase tracking-wider mb-3">
                About / Biography
              </h3>
              {isEditing ? (
                <textarea
                  value={formValues.bio}
                  onChange={(e) => updateFormValue("bio", e.target.value)}
                  rows={4}
                  className={`${inputClass} resize-y min-h-[100px] leading-relaxed`}
                  placeholder="Write a professional biography..."
                />
              ) : (
                <p className="text-gray-600 leading-relaxed max-w-4xl whitespace-pre-wrap">
                  {profile?.bio || (
                    <span className="italic text-gray-400">
                      No biography added yet. Click edit to add one.
                    </span>
                  )}
                </p>
              )}
            </div>
          </div>

          {/* 2. TWO COLUMN DETAILS GRID */}
          <div className="grid lg:grid-cols-12 gap-6">
            {/* Left Column - Contact, Office & Social */}
            <div className="lg:col-span-5 space-y-6">
              {/* Office & Contact */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
                <h3 className="font-serif text-xl font-bold text-navy-950 flex items-center gap-2 mb-6">
                  <MapPin className="h-5 w-5 text-gold-500" />
                  Office & Contact
                </h3>

                <div className="space-y-5">
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                      Office Location
                    </p>
                    {isEditing ? (
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type="text"
                          value={formValues.officeLocation}
                          onChange={(e) =>
                            updateFormValue("officeLocation", e.target.value)
                          }
                          className={`${inputClass} pl-9`}
                          placeholder="e.g. Main Block, Room 302"
                        />
                      </div>
                    ) : (
                      <p className="font-medium text-navy-900">
                        {profile?.officeLocation || (
                          <span className="text-gray-400 italic font-normal">
                            Not specified
                          </span>
                        )}
                      </p>
                    )}
                  </div>

                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                      Official Email
                    </p>
                    <p className="font-medium text-navy-900">
                      {profile?.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Web Presence */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
                <h3 className="font-serif text-xl font-bold text-navy-950 flex items-center gap-2 mb-6">
                  <LinkIcon className="h-5 w-5 text-gold-500" />
                  Web Presence
                </h3>

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
                          <span className="text-sm font-medium text-gray-700 group-hover:text-blue-700 truncate max-w-[180px]">
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

                  {/* Google Scholar */}
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                      Google Scholar
                    </p>
                    {isEditing ? (
                      <div className="relative">
                        <Award className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type="url"
                          value={formValues.googleScholarUrl}
                          onChange={(e) =>
                            updateFormValue("googleScholarUrl", e.target.value)
                          }
                          className={`${inputClass} pl-9`}
                          placeholder="https://scholar.google.com/..."
                        />
                      </div>
                    ) : profile?.googleScholarUrl ? (
                      <a
                        href={profile.googleScholarUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center justify-between p-3 rounded-xl border border-gray-100 bg-gray-50 hover:bg-gold-50 hover:border-gold-100 transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-white rounded-lg shadow-sm text-gold-600">
                            <Award className="h-4 w-4" />
                          </div>
                          <span className="text-sm font-medium text-gray-700 group-hover:text-gold-700 truncate max-w-[180px]">
                            View Publications
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

            {/* Right Column - Academics & Subjects */}
            <div className="lg:col-span-7 space-y-6">
              {/* Qualifications */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 h-full">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="font-serif text-xl font-bold text-navy-950 flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-gold-500" />
                    Academic Qualifications
                  </h3>
                </div>

                {qualifications.length === 0 ? (
                  <div className="text-center py-10">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                      <GraduationCap className="h-8 w-8 text-gray-300" />
                    </div>
                    <p className="text-gray-500 font-medium">
                      No qualifications on record.
                    </p>
                  </div>
                ) : (
                  <div className="relative border-l-2 border-gold-200 ml-3 space-y-8 pb-4">
                    {qualifications.map((qual, index) => (
                      <div key={index} className="relative pl-6">
                        {/* Timeline dot */}
                        <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-white border-2 border-gold-400 shadow-sm" />

                        <div className="bg-gray-50 border border-gray-100 rounded-xl p-5 hover:shadow-md hover:border-gold-200 transition-all">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                            <h4 className="font-bold text-navy-900 text-lg leading-tight">
                              {qual.degree}
                            </h4>
                            <span className="inline-flex items-center justify-center px-3 py-1 bg-white border border-gray-200 text-gray-600 text-xs font-bold rounded-lg shadow-sm whitespace-nowrap">
                              {qual.year}
                            </span>
                          </div>
                          <p className="text-gold-600 font-semibold mb-2">
                            {qual.field}
                          </p>
                          <p className="text-gray-500 text-sm flex items-center gap-1.5">
                            <Building2 className="h-4 w-4" />
                            {qual.institution}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Subjects Taught (Appended to bottom of Academics card) */}
                <div className="mt-10 pt-8 border-t border-gray-100">
                  <h3 className="font-serif text-lg font-bold text-navy-950 flex items-center gap-2 mb-5">
                    <BookOpen className="h-5 w-5 text-gold-500" />
                    Subjects Taught
                  </h3>

                  {subjectsTaught.length === 0 ? (
                    <p className="text-gray-500 text-sm italic">
                      No subjects listed.
                    </p>
                  ) : (
                    <div className="flex flex-wrap gap-2.5">
                      {subjectsTaught.map((subject, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium bg-navy-50 text-navy-800 border border-navy-100 hover:bg-navy-100 transition-colors"
                        >
                          {subject}
                        </span>
                      ))}
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
