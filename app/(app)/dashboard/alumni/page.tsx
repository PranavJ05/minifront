"use client";
// app/dashboard/alumni/page.tsx
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Bell,
  Calendar,
  Loader2,
  ArrowRight,
  AlertCircle,
  Users,
  MapPin,
} from "lucide-react";
import DashboardSidebar from "@/components/layout/DashboardSidebar";
import PendingModal from "@/components/main-admin/PendingModal";
import SkillsOnboardingModal from "@/components/profile/SkillsOnboardingModal";
import { useAuth } from "@/contexts/auth-context";
import { useEventsQuery } from "@/hooks/queries/events";
import { useMyOpportunitiesQuery } from "@/hooks/queries/opportunities";
import { useAlumniSearchQuery } from "@/hooks/queries/alumni";
import { hasRole, isAlumni } from "@/lib/roleUtils";
import { BACKEND_URL } from "@/lib/config";
import {
  formatDay,
  formatEventDate,
  formatMonth,
  isUpcoming,
} from "@/lib/utils/dateUtils";

const formatPostedDate = (value: string) =>
  new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const resolveImageUrl = (value: string | null) => {
  if (!value) return null;
  return value.startsWith("http") ? value : `${BACKEND_URL}${value}`;
};

export default function AlumniDashboard() {
  const router = useRouter();
  const {
    user,
    token,
    isAuthenticated,
    isLoading: authLoading,
    updateUser,
  } = useAuth();
  const {
    data: events = [],
    isLoading: eventsLoading,
    error: eventsError,
  } = useEventsQuery();
  const {
    data: opportunities = [],
    isLoading: opportunitiesLoading,
    error: opportunitiesError,
  } = useMyOpportunitiesQuery();
  const {
    data: directoryData,
    isLoading: directoryLoading,
    error: directoryError,
  } = useAlumniSearchQuery();
  const [showOnboarding, setShowOnboarding] = useState(false);

  const directory = useMemo(() => {
    const data = Array.isArray(directoryData) ? directoryData : [];
    return data.map((item) => ({
      id: item.id,
      name: item.name || "Unknown",
      profession: item.profession ?? null,
      department: item.department ?? null,
      location: item.location ?? null,
      profileImageUrl: item.profileImageUrl ?? null,
    }));
  }, [directoryData]);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated || !user) {
      router.replace("/auth/login");
      return;
    }

    const userRole = user.roles || "";
    const isBlockedRole = hasRole(userRole, ["student", "faculty"]);
    const isAllowedRole = hasRole(userRole, ["alumni", "batch_admin", "admin"]);

    if (isBlockedRole || !isAllowedRole) {
      router.replace("/auth/login");
      return;
    }

    const hasCompleted = localStorage.getItem("skills_onboarding_completed");
    const hasSkipped = localStorage.getItem("skills_onboarding_skipped");

    if (isAlumni(userRole) && !user.alumniId) {
      fetch(`${BACKEND_URL}/api/profile/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.alumniId) {
            updateUser({ alumniId: data.alumniId, courseId: data.courseId });
            if (!hasCompleted && !hasSkipped) {
              setShowOnboarding(true);
            }
          }
        })
        .catch(() => {});
    } else if (isAlumni(userRole) && !hasCompleted && !hasSkipped) {
      setShowOnboarding(true);
    }
  }, [authLoading, isAuthenticated, user, token, router, updateUser]);

  const upcomingEvents = useMemo(
    () => events.filter((event) => isUpcoming(event.eventDate)).slice(0, 2),
    [events],
  );

  const opportunityPreview = useMemo(
    () => opportunities.slice(0, 3),
    [opportunities],
  );
  const directoryPreview = useMemo(() => directory.slice(0, 3), [directory]);

  if (!user)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-navy-800 border-t-transparent rounded-full animate-spin" />
      </div>
    );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar role="alumni" />

      <main className="flex-1 overflow-auto">
        <div className="p-6 max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-gray-500 text-sm font-sans">GOOD MORNING</p>
              <h1 className="font-serif text-2xl font-bold text-navy-900">
                {user.fullName}
              </h1>
            </div>
            <div className="flex items-center gap-1">
              <PendingModal />
              <button className="relative p-2 text-gray-400 hover:text-navy-800 transition-colors">
                <Bell className="h-6 w-6" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-gold-500 rounded-full" />
              </button>
            </div>
          </div>

          <section className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-navy-900 font-serif">
                Upcoming Events
              </h2>
              <Link
                href="/events"
                className="text-sm text-gold-600 font-medium hover:text-gold-700 flex items-center gap-1"
              >
                SEE ALL <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            {eventsLoading && (
              <div className="card p-8 flex items-center justify-center gap-3 text-gray-500">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span className="text-sm">Loading upcoming events...</span>
              </div>
            )}

            {!eventsLoading && eventsError && (
              <div className="card p-6 border border-red-200 bg-red-50 text-red-700 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-sm">Could not load events</p>
                  <p className="text-sm mt-1">{eventsError?.message}</p>
                </div>
              </div>
            )}

            {!eventsLoading && !eventsError && upcomingEvents.length === 0 && (
              <div className="card p-8 text-center">
                <p className="font-semibold text-navy-900">
                  No upcoming events
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  New events will appear here as soon as they are published.
                </p>
              </div>
            )}

            {!eventsLoading && !eventsError && upcomingEvents.length > 0 && (
              <div className="grid sm:grid-cols-2 gap-4">
                {upcomingEvents.map((event) => {
                  const coverImage = event.photoUrls?.[0] ?? null;
                  return (
                    <div key={event.id} className="card overflow-hidden">
                      <div className="relative h-36 bg-navy-100">
                        {coverImage ? (
                          <Image
                            src={coverImage}
                            alt={event.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-navy-700 to-navy-950" />
                        )}
                        <div className="absolute top-3 left-3 bg-navy-900/90 text-white px-3 py-2 rounded-lg text-center min-w-[56px]">
                          <span className="block text-[10px] text-gray-400 uppercase leading-none">
                            {formatMonth(event.eventDate)}
                          </span>
                          <span className="block text-base font-bold leading-tight">
                            {formatDay(event.eventDate)}
                          </span>
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-navy-900 text-sm mb-1 line-clamp-2">
                          {event.title}
                        </h3>
                        <p className="text-xs text-gray-500 flex items-center gap-1 mb-2">
                          <MapPin className="h-3 w-3" /> {event.location}
                        </p>
                        <p className="text-xs text-gray-400 mb-4">
                          {formatEventDate(event.eventDate)}
                        </p>
                        <Link
                          href="/events"
                          className="inline-flex items-center gap-1 text-sm text-gold-600 font-medium hover:text-gold-700"
                        >
                          View details <ArrowRight className="h-3 w-3" />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          <section className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-navy-900 font-serif">
                My Opportunities
              </h2>
              <Link
                href="/opportunities"
                className="text-sm text-gold-600 font-medium hover:text-gold-700 flex items-center gap-1"
              >
                VIEW ALL <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            {opportunitiesLoading && (
              <div className="card p-8 flex items-center justify-center gap-3 text-gray-500">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span className="text-sm">Loading opportunities...</span>
              </div>
            )}

            {!opportunitiesLoading && opportunitiesError && (
              <div className="card p-6 border border-red-200 bg-red-50 text-red-700 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-sm">
                    Could not load opportunities
                  </p>
                  <p className="text-sm mt-1">{opportunitiesError?.message}</p>
                </div>
              </div>
            )}

            {!opportunitiesLoading &&
              !opportunitiesError &&
              opportunityPreview.length === 0 && (
                <div className="card p-8 text-center">
                  <p className="font-semibold text-navy-900">
                    No opportunities yet
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Your recently posted opportunities will appear here.
                  </p>
                </div>
              )}

            {!opportunitiesLoading &&
              !opportunitiesError &&
              opportunityPreview.length > 0 && (
                <div className="grid md:grid-cols-3 gap-4">
                  {opportunityPreview.map((opportunity) => (
                    <div key={opportunity.id} className="card p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="badge bg-navy-50 text-navy-700">
                          {opportunity.type}
                        </span>
                      </div>
                      <h3 className="font-bold text-navy-900 mb-1 line-clamp-2">
                        {opportunity.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {opportunity.company}
                      </p>
                      <p className="text-sm text-gray-500 flex items-center gap-1 mt-2">
                        <MapPin className="h-3.5 w-3.5" />{" "}
                        {opportunity.location}
                      </p>
                      <p className="text-xs text-gray-400 mt-4">
                        Posted {formatPostedDate(opportunity.postedAt)}
                      </p>
                      <Link
                        href="/opportunities"
                        className="inline-flex items-center gap-1 text-sm text-gold-600 font-medium mt-4"
                      >
                        View all opportunities{" "}
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  ))}
                </div>
              )}
          </section>

          <section className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-navy-900 font-serif">
                Directory Snapshot
              </h2>
              <Link
                href="/alumni"
                className="text-sm text-gold-600 font-medium hover:text-gold-700 flex items-center gap-1"
              >
                VIEW ALL <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            {directoryLoading && (
              <div className="card p-8 flex items-center justify-center gap-3 text-gray-500">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span className="text-sm">Loading alumni directory...</span>
              </div>
            )}

            {!directoryLoading && directoryError && (
              <div className="card p-6 border border-red-200 bg-red-50 text-red-700 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-sm">
                    Could not load directory
                  </p>
                  <p className="text-sm mt-1">{directoryError?.message}</p>
                </div>
              </div>
            )}

            {!directoryLoading &&
              !directoryError &&
              directoryPreview.length === 0 && (
                <div className="card p-8 text-center">
                  <p className="font-semibold text-navy-900">No alumni found</p>
                  <p className="text-sm text-gray-500 mt-1">
                    The alumni directory preview is empty right now.
                  </p>
                </div>
              )}

            {!directoryLoading &&
              !directoryError &&
              directoryPreview.length > 0 && (
                <div className="grid md:grid-cols-3 gap-4">
                  {directoryPreview.map((alumni) => {
                    const avatar = resolveImageUrl(alumni.profileImageUrl);
                    return (
                      <div
                        key={alumni.id}
                        className="card p-5 flex items-start gap-3"
                      >
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-navy-100 flex items-center justify-center flex-shrink-0">
                          {avatar ? (
                            <img
                              src={avatar}
                              alt={alumni.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Users className="h-5 w-5 text-navy-500" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-navy-900 truncate">
                            {alumni.name}
                          </p>
                          <p className="text-sm text-gray-600 truncate">
                            {alumni.profession || "Professional"}
                          </p>
                          <p className="text-xs text-gray-400 mt-1 truncate">
                            {alumni.department || "Department not added"}
                          </p>
                          <p className="text-xs text-gray-400 mt-1 truncate">
                            {alumni.location || "Location not added"}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
          </section>
        </div>
      </main>

      {/* ✅ SKILLS ONBOARDING MODAL */}
      {showOnboarding && user?.alumniId && (
        <SkillsOnboardingModal
          isOpen={showOnboarding}
          onClose={() => setShowOnboarding(false)}
          alumniId={user.alumniId ?? undefined}
          courseId={user.courseId ?? undefined}
          onComplete={() => {
            // Backup save flag just in case they click outside or close via a non-standard route
            localStorage.setItem("skills_onboarding_completed", "true");
            setShowOnboarding(false);
          }}
        />
      )}
    </div>
  );
}
