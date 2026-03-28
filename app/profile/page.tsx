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
  Trash2,
  UserCircle2,
  X,
} from "lucide-react";
import DashboardSidebar from "@/components/layout/DashboardSidebar";
import { UserRole } from "@/types";

const API_BASE = "http://localhost:8080";

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
    console.error("Failed to sync stored user name:", error);
  }
};

export default function ProfilePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
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

  useEffect(() => {
    const storedUser = localStorage.getItem("alumni_user");
    const token = localStorage.getItem("token");

    if (!storedUser || !token) {
      router.push("/auth/login");
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);
      const normalizedRole =
        parsedUser?.role === "batch_admin" ? "alumni" : parsedUser?.role;

      setSidebarUser({
        role: (normalizedRole || "alumni") as UserRole,
        name: parsedUser?.fullName || parsedUser?.name || "User",
        email: parsedUser?.email || "",
      });
    } catch {
      router.push("/auth/login");
      return;
    }

    const loadProfile = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`${API_BASE}/api/profile/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status === 401 || res.status === 403) {
          router.push("/auth/login");
          return;
        }

        if (!res.ok) {
          throw new Error("Failed to load profile");
        }

        const data: ProfileResponse = await res.json();
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
      } catch (err: any) {
        setError(err.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [router]);

  const updateFormValue = (field: keyof ProfileFormValues, value: string) => {
    setFormValues((current) => ({
      ...current,
      [field]: value,
    }));
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
    if (message) {
      setSuccessMessage(message);
    }
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
    } catch (err: any) {
      setError(err.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePhotoSelected = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    const token = localStorage.getItem("token");

    if (!file || !token || !profile) {
      return;
    }

    setIsUploadingPhoto(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(`${API_BASE}/api/profile/me/photo`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const body = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(body?.message || "Failed to upload profile photo");
      }

      applyProfile(
        {
          ...profile,
          profileImageUrl: body?.profileImageUrl ?? profile.profileImageUrl,
        },
        body?.message || "Profile photo updated successfully.",
      );
    } catch (err: any) {
      setError(err.message || "Failed to upload profile photo");
    } finally {
      setIsUploadingPhoto(false);
      if (event.target) {
        event.target.value = "";
      }
    }
  };

  const handleRemovePhoto = async () => {
    const token = localStorage.getItem("token");
    if (!token || !profile?.profileImageUrl) {
      return;
    }

    setIsRemovingPhoto(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const res = await fetch(`${API_BASE}/api/profile/me/photo`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const body = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(body?.message || "Failed to remove profile photo");
      }

      applyProfile(
        {
          ...profile,
          profileImageUrl: null,
        },
        body?.message || "Profile photo removed successfully.",
      );
    } catch (err: any) {
      setError(err.message || "Failed to remove profile photo");
    } finally {
      setIsRemovingPhoto(false);
    }
  };

  if (loading || !sidebarUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-navy-800" />
      </div>
    );
  }

  const profileImageSrc = resolveImageUrl(profile?.profileImageUrl || null);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar
        role={sidebarUser.role}
        userName={sidebarUser.name}
        userEmail={sidebarUser.email}
      />

      <main className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto p-6 space-y-6">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <p className="text-sm font-medium text-gold-600 uppercase tracking-wide">
                Profile
              </p>
              <h1 className="font-serif text-3xl font-bold text-navy-900 mt-1">
                My Profile
              </h1>
              <p className="text-gray-500 mt-2 max-w-2xl">
                Edit your public identity, update your contact details, and
                manage your profile photo.
              </p>
            </div>

            {profile && (
              <div className="flex items-center gap-3">
                {isEditing ? (
                  <button
                    onClick={() => {
                      setFormValues(toFormValues(profile));
                      setIsEditing(false);
                      setSuccessMessage(null);
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-white"
                  >
                    <X className="h-4 w-4" /> Cancel
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setIsEditing(true);
                      setSuccessMessage(null);
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-navy-900 text-white hover:bg-navy-800"
                  >
                    <Pencil className="h-4 w-4" /> Edit Profile
                  </button>
                )}
              </div>
            )}
          </div>

          {error && (
            <div className="card p-5 border border-red-200 bg-red-50 text-red-700 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Something went wrong</p>
                <p className="text-sm mt-1">{error}</p>
              </div>
            </div>
          )}

          {successMessage && (
            <div className="card p-4 border border-green-200 bg-green-50 text-green-700">
              <p className="font-medium text-sm">{successMessage}</p>
            </div>
          )}

          {profile && (
            <>
              <section className="grid xl:grid-cols-[1.2fr,0.8fr] gap-6">
                <div className="card p-6">
                  <div className="flex flex-col sm:flex-row items-start gap-6">
                    <div className="relative flex-shrink-0">
                      <div className="w-32 h-32 rounded-full overflow-hidden bg-navy-100 border-4 border-white shadow-lg flex items-center justify-center text-navy-700">
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

                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploadingPhoto}
                        className="absolute bottom-1 right-1 w-10 h-10 rounded-full bg-gold-500 text-navy-950 flex items-center justify-center shadow-lg hover:bg-gold-400 disabled:opacity-60 disabled:cursor-not-allowed"
                        aria-label="Update profile photo"
                        title="Update profile photo"
                      >
                        {isUploadingPhoto ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Camera className="h-4 w-4" />
                        )}
                      </button>

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
                          <h2 className="font-serif text-3xl font-bold text-navy-900">
                            {profile.name}
                          </h2>
                          <p className="text-gold-600 font-semibold mt-1">
                            {profile.profession || "Profession not added"}
                          </p>
                        </div>

                        {profile.profileImageUrl && (
                          <button
                            type="button"
                            onClick={handleRemovePhoto}
                            disabled={isRemovingPhoto}
                            className="inline-flex items-center gap-2 px-3 py-2 rounded-full border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-60"
                          >
                            {isRemovingPhoto ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                            Remove photo
                          </button>
                        )}
                      </div>

                      <p className="text-xs text-gray-400 mt-3">
                        Tap the camera button to upload a new photo, similar to
                        social profile updates.
                      </p>

                      <div className="mt-5 grid sm:grid-cols-2 gap-3 text-sm text-gray-600">
                        <p className="flex items-center gap-2 rounded-xl bg-gray-50 px-3 py-3">
                          <Mail className="h-4 w-4 text-navy-500" />
                          <span className="truncate">{profile.email}</span>
                        </p>
                        <p className="flex items-center gap-2 rounded-xl bg-gray-50 px-3 py-3">
                          <MapPin className="h-4 w-4 text-navy-500" />
                          <span>
                            {profile.location || "Location not added"}
                          </span>
                        </p>
                        <p className="flex items-center gap-2 rounded-xl bg-gray-50 px-3 py-3">
                          <GraduationCap className="h-4 w-4 text-navy-500" />
                          <span>
                            {profile.department || "Department not added"}
                          </span>
                        </p>
                        <p className="flex items-center gap-2 rounded-xl bg-gray-50 px-3 py-3">
                          <Mail className="h-4 w-4 text-navy-500" />
                          <span className="truncate">
                            {profile.batchYear || "Year not added"}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card p-6">
                  <h2 className="font-bold text-navy-900 mb-4">Quick Links</h2>
                  <div className="space-y-3 text-sm">
                    <Link
                      href="/events"
                      className="flex items-center justify-between rounded-xl border border-gray-200 px-4 py-3 text-navy-700 hover:bg-gray-50"
                    >
                      <span className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" /> My Events
                      </span>
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                    <Link
                      href="/opportunities"
                      className="flex items-center justify-between rounded-xl border border-gray-200 px-4 py-3 text-navy-700 hover:bg-gray-50"
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
                        className="flex items-center justify-between rounded-xl border border-gray-200 px-4 py-3 text-navy-700 hover:bg-gray-50"
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

              <section className="grid xl:grid-cols-[1fr,0.9fr] gap-6">
                <form
                  onSubmit={handleSaveProfile}
                  className="card p-6 space-y-5"
                >
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <div>
                      <h2 className="font-bold text-navy-900 text-lg">
                        Edit Details
                      </h2>
                      <p className="text-sm text-gray-500 mt-1">
                        Update the fields that appear on your profile.
                      </p>
                    </div>
                    {isEditing && (
                      <button
                        type="submit"
                        disabled={isSaving}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gold-500 text-navy-950 font-semibold hover:bg-gold-400 disabled:opacity-60"
                      >
                        {isSaving && (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        )}
                        Save Changes
                      </button>
                    )}
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <label className="text-sm font-medium text-navy-800">
                      Full Name
                      <input
                        type="text"
                        value={formValues.name}
                        onChange={(event) =>
                          updateFormValue("name", event.target.value)
                        }
                        disabled={!isEditing || isSaving}
                        className="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-3 bg-white disabled:bg-gray-50 disabled:text-gray-500"
                      />
                    </label>

                    <label className="text-sm font-medium text-navy-800">
                      Gmail
                      <input
                        type="email"
                        value={formValues.gmail}
                        onChange={(event) =>
                          updateFormValue("gmail", event.target.value)
                        }
                        disabled={!isEditing || isSaving}
                        className="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-3 bg-white disabled:bg-gray-50 disabled:text-gray-500"
                      />
                    </label>

                    <label className="text-sm font-medium text-navy-800">
                      Batch Year
                      <input
                        type="number"
                        value={formValues.batchYear}
                        onChange={(event) =>
                          updateFormValue("batchYear", event.target.value)
                        }
                        disabled={!isEditing || isSaving}
                        className="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-3 bg-white disabled:bg-gray-50 disabled:text-gray-500"
                      />
                    </label>

                    <label className="text-sm font-medium text-navy-800">
                      Department
                      <input
                        type="text"
                        value={formValues.department}
                        onChange={(event) =>
                          updateFormValue("department", event.target.value)
                        }
                        disabled={!isEditing || isSaving}
                        className="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-3 bg-white disabled:bg-gray-50 disabled:text-gray-500"
                      />
                    </label>

                    <label className="text-sm font-medium text-navy-800 sm:col-span-2">
                      Location
                      <input
                        type="text"
                        value={formValues.location}
                        onChange={(event) =>
                          updateFormValue("location", event.target.value)
                        }
                        disabled={!isEditing || isSaving}
                        className="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-3 bg-white disabled:bg-gray-50 disabled:text-gray-500"
                      />
                    </label>

                    <label className="text-sm font-medium text-navy-800 sm:col-span-2">
                      Profession
                      <input
                        type="text"
                        value={formValues.profession}
                        onChange={(event) =>
                          updateFormValue("profession", event.target.value)
                        }
                        disabled={!isEditing || isSaving}
                        className="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-3 bg-white disabled:bg-gray-50 disabled:text-gray-500"
                      />
                    </label>

                    <label className="text-sm font-medium text-navy-800 sm:col-span-2">
                      LinkedIn URL
                      <input
                        type="url"
                        value={formValues.linkedinUrl}
                        onChange={(event) =>
                          updateFormValue("linkedinUrl", event.target.value)
                        }
                        disabled={!isEditing || isSaving}
                        className="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-3 bg-white disabled:bg-gray-50 disabled:text-gray-500"
                      />
                    </label>
                  </div>
                </form>

                <div className="space-y-6">
                  <section className="card p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="font-bold text-navy-900">My Events</h2>
                      <Link
                        href="/events"
                        className="text-sm text-gold-600 font-medium"
                      >
                        View all
                      </Link>
                    </div>

                    {profile.events.length === 0 ? (
                      <p className="text-sm text-gray-500">
                        No event summaries available yet.
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {profile.events.map((eventItem) => (
                          <div
                            key={eventItem.id}
                            className="rounded-xl border border-gray-100 p-4"
                          >
                            <p className="font-semibold text-navy-900">
                              {eventItem.title}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                              {formatDateTime(eventItem.eventDate)}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                              {eventItem.location}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </section>

                  <section className="card p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="font-bold text-navy-900">
                        My Opportunities
                      </h2>
                      <Link
                        href="/opportunities"
                        className="text-sm text-gold-600 font-medium"
                      >
                        View all
                      </Link>
                    </div>

                    {profile.opportunities.length === 0 ? (
                      <p className="text-sm text-gray-500">
                        No opportunity summaries available yet.
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {profile.opportunities.map((opportunity) => (
                          <div
                            key={opportunity.id}
                            className="rounded-xl border border-gray-100 p-4"
                          >
                            <p className="font-semibold text-navy-900">
                              {opportunity.title}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                              {opportunity.company} • {opportunity.location}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
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
    </div>
  );
}
