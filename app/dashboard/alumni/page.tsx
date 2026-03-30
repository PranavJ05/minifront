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
import PendingModal from "@/components/admin/PendingModal";
import SkillsOnboardingWrapper from "@/components/profile/SkillsOnboardingWrapper";
import { fetchAllEvents } from "@/lib/api/events";
import { Event } from "@/lib/types/events";
import { getToken } from "@/lib/auth";
import { hasRole } from "@/lib/roleUtils";
import {
  formatDay,
  formatEventDate,
  formatMonth,
  isUpcoming,
} from "@/lib/utils/dateUtils";

interface OpportunityPreview {
  id: number;
  title: string;
  company: string;
  location: string;
  type: string;
  postedAt: string;
}

interface AlumniPreview {
  id: number;
  name: string;
  profession: string | null;
  department: string | null;
  location: string | null;
  profileImageUrl: string | null;
}

const API_BASE = "http://localhost:8080";

const formatPostedDate = (value: string) =>
  new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const resolveImageUrl = (value: string | null) => {
  if (!value) return null;
  return value.startsWith("http") ? value : `${API_BASE}${value}`;
};

export default function AlumniDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [eventsError, setEventsError] = useState<string | null>(null);
  const [opportunities, setOpportunities] = useState<OpportunityPreview[]>([]);
  const [opportunitiesLoading, setOpportunitiesLoading] = useState(true);
  const [opportunitiesError, setOpportunitiesError] = useState<string | null>(
    null,
  );
  const [directory, setDirectory] = useState<AlumniPreview[]>([]);
  const [directoryLoading, setDirectoryLoading] = useState(true);
  const [directoryError, setDirectoryError] = useState<string | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const stored = localStorage.getItem("alumni_user");
    const storedRole = localStorage.getItem("role")?.toLowerCase() || "";

    if (!token || !stored) {
      router.replace("/auth/login");
      return;
    }

    const u = JSON.parse(stored);
    const userRole = u.roles || u.role || "";

    // Check if user has BLOCKED roles (student or faculty)
    const isBlockedRole = hasRole(userRole, ["student", "faculty"]);

    // Check if user has ALLOWED roles (alumni, batch_admin, admin)
    const isAllowedRole = hasRole(userRole, ["alumni", "batch_admin", "admin"]);

    console.log("[Dashboard] User roles:", userRole);
    console.log(
      "[Dashboard] isBlockedRole:",
      isBlockedRole,
      "isAllowedRole:",
      isAllowedRole,
    );

    if (isBlockedRole || !isAllowedRole) {
      router.replace("/auth/login");
      return;
    }

    setUser(u);

    // Check if we should show onboarding
    const hasCompleted = localStorage.getItem("skills_onboarding_completed");
    const hasSkipped = localStorage.getItem("skills_onboarding_skipped");

    console.log("[Dashboard] User data:", u);
    console.log("[Dashboard] Onboarding status:", {
      hasCompleted,
      hasSkipped,
      alumniId: u?.alumniId,
      courseId: u?.courseId,
    });

    // Show onboarding if user is alumni and hasn't completed/skipped
    if (u?.alumniId && !hasCompleted && !hasSkipped) {
      console.log("[Dashboard] Showing onboarding");
      setShowOnboarding(true);
    } else {
      console.log("[Dashboard] Not showing onboarding");
    }
  }, [router]);

  useEffect(() => {
    const loadEvents = async () => {
      const token = getToken();
      if (!token) {
        setEventsLoading(false);
        setEventsError("You need to sign in again to load events.");
        return;
      }

      setEventsLoading(true);
      setEventsError(null);

      try {
        const data = await fetchAllEvents(token);
        setEvents(data);
      } catch (err: any) {
        setEventsError(err.message || "Failed to load upcoming events.");
      } finally {
        setEventsLoading(false);
      }
    };

    loadEvents();
  }, []);

  useEffect(() => {
    const loadOpportunities = async () => {
      const token = getToken();
      if (!token) {
        setOpportunitiesLoading(false);
        setOpportunitiesError(
          "You need to sign in again to load opportunities.",
        );
        return;
      }

      setOpportunitiesLoading(true);
      setOpportunitiesError(null);

      try {
        const res = await fetch(`${API_BASE}/opportunities/mine`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch opportunities: ${res.status}`);
        }

        const data: OpportunityPreview[] = await res.json();
        setOpportunities(data);
      } catch (err: any) {
        setOpportunitiesError(err.message || "Failed to load opportunities.");
      } finally {
        setOpportunitiesLoading(false);
      }
    };

    loadOpportunities();
  }, []);

  useEffect(() => {
    const loadDirectory = async () => {
      setDirectoryLoading(true);
      setDirectoryError(null);

      try {
        const res = await fetch(`${API_BASE}/api/alumni/search`);
        if (!res.ok) {
          throw new Error(`Failed to fetch alumni: ${res.status}`);
        }

        const data = await res.json();
        const normalized: AlumniPreview[] = (
          Array.isArray(data) ? data : []
        ).map((item: any) => ({
          id: item.id,
          name: item.name || "Unknown",
          profession: item.profession || null,
          department: item.department || null,
          location: item.location || item.placeOfResidence || null,
          profileImageUrl: item.profileImageUrl || null,
        }));

        setDirectory(normalized);
      } catch (err: any) {
        setDirectoryError(err.message || "Failed to load alumni directory.");
      } finally {
        setDirectoryLoading(false);
      }
    };

    loadDirectory();
  }, []);

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
      <DashboardSidebar
        role="alumni"
        userName={user.fullName}
        userEmail={user.email}
      />

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
                  <p className="text-sm mt-1">{eventsError}</p>
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
                  <p className="text-sm mt-1">{opportunitiesError}</p>
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
                  <p className="text-sm mt-1">{directoryError}</p>
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

      {/* Skills Onboarding for new users */}
      {user?.alumniId && showOnboarding && (
        <SkillsOnboardingWrapper
          alumniId={user.alumniId}
          courseId={user.courseId}
          onComplete={() => setShowOnboarding(false)}
        />
      )}
    </div>
  );
}
