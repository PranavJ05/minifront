"use client";
// app/dashboard/faculty/page.tsx
import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Users,
  Calendar,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Eye,
  UserPlus,
  GraduationCap,
  Briefcase,
  Loader2,
  ArrowRight,
  MapPin,
  Search,
} from "lucide-react";
import DashboardSidebar from "@/components/layout/DashboardSidebar";
import { hasRole } from "@/lib/roleUtils";
import { fetchAllEvents } from "@/lib/api/events";
import { Event } from "@/lib/types/events";
import { getToken } from "@/lib/auth";

const API_BASE = "http://localhost:8080";

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

const resolveImageUrl = (value: string | null) => {
  if (!value) return null;
  return value.startsWith("http") ? value : `${API_BASE}${value}`;
};

export default function FacultyDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  // Data states - using same endpoints as alumni/student dashboards
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

  // Auth check
  useEffect(() => {
    const token = localStorage.getItem("token");
    const stored = localStorage.getItem("alumni_user");
    if (!token || !stored) {
      router.replace("/auth/login");
      return;
    }
    const u = JSON.parse(stored);
    const userRole = u.roles || u.role || "";

    // ✅ Robust Role Check - only allow faculty role
    const isAllowedRole = hasRole(userRole, ["faculty"]);

    if (!isAllowedRole) {
      router.replace("/auth/login");
      return;
    }
    setUser(u);
  }, [router]);

  // Load events (same as alumni dashboard)
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

  // Load opportunities (same as alumni/student dashboard)
  useEffect(() => {
    const loadOpportunities = async () => {
      setOpportunitiesLoading(true);
      setOpportunitiesError(null);

      try {
        const res = await fetch(`${API_BASE}/opportunities/all`, {
          headers: {
            "Content-Type": "application/json",
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

  // Load alumni directory (same as alumni/student dashboard)
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

  // Format date helper
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const upcomingEvents = useMemo(
    () => events.filter((e) => new Date(e.eventDate) >= new Date()).slice(0, 5),
    [events],
  );

  const opportunityPreview = useMemo(
    () => opportunities.slice(0, 3),
    [opportunities],
  );

  const directoryPreview = useMemo(() => directory.slice(0, 3), [directory]);

  // Calculate stats from loaded data
  const statsData = useMemo(
    () => [
      {
        label: "Total Alumni",
        value: String(directory.length || 0),
        icon: GraduationCap,
        color: "text-blue-600",
        bg: "bg-blue-50",
      },
      {
        label: "Open Opportunities",
        value: String(opportunities.length || 0),
        icon: Briefcase,
        color: "text-green-600",
        bg: "bg-green-50",
      },
      {
        label: "Upcoming Events",
        value: String(upcomingEvents.length || 0),
        icon: Calendar,
        color: "text-purple-600",
        bg: "bg-purple-50",
      },
      {
        label: "Departments",
        value: String(
          new Set(directory.map((item) => item.department).filter(Boolean))
            .size,
        ),
        icon: UserPlus,
        color: "text-gold-600",
        bg: "bg-gold-50",
      },
    ],
    [directory, opportunities, upcomingEvents],
  );

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-navy-800 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar
        role="faculty"
        userName={user.fullName}
        userEmail={user.email}
      />

      <main className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-serif text-2xl font-bold text-navy-900">
              Faculty Dashboard
            </h1>
            <p className="text-gray-500">
              Platform overview and community insights
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {statsData.map(({ label, value, icon: Icon, color, bg }) => (
              <div key={label} className="card p-5">
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center`}
                  >
                    <Icon className={`h-5 w-5 ${color}`} />
                  </div>
                </div>
                <div className="text-2xl font-bold text-navy-900 font-serif">
                  {value}
                </div>
                <div className="text-xs text-gray-500 mt-1">{label}</div>
              </div>
            ))}
          </div>

          {/* Search Alumni */}
          <div className="card p-5 mb-6 bg-navy-950">
            <h2 className="text-white font-bold mb-3">Find Alumni Fast</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, company, or field..."
                className="w-full pl-10 pr-4 py-3 bg-navy-800 border border-navy-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gold-500"
              />
            </div>
            <Link
              href="/alumni"
              className="inline-flex items-center gap-2 mt-3 text-gold-400 text-sm hover:text-gold-300"
            >
              Browse full directory <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Upcoming Events */}
            <div className="card p-5">
              <h2 className="font-bold text-navy-900 font-serif mb-5 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-gold-500" />
                Upcoming Events
              </h2>

              {eventsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                </div>
              ) : eventsError ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
                  {eventsError}
                </div>
              ) : upcomingEvents.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No upcoming events</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {upcomingEvents.map((event) => (
                    <div key={event.id} className="flex gap-3">
                      <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0 bg-gold-500" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-700">
                          {event.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDate(event.eventDate)}</span>
                        </div>
                        {event.location && (
                          <div className="flex items-center gap-1 mt-0.5 text-xs text-gray-500">
                            <MapPin className="h-3 w-3" />
                            <span>{event.location}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Opportunities */}
            <div className="lg:col-span-2 card p-5">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold text-navy-900 font-serif flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-gold-500" />
                  Current Opportunities
                </h2>
                <Link
                  href="/opportunities"
                  className="text-xs text-gold-600 font-medium"
                >
                  View All
                </Link>
              </div>

              {opportunitiesLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                </div>
              ) : opportunitiesError ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
                  {opportunitiesError}
                </div>
              ) : opportunityPreview.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No opportunities available</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-3 gap-4">
                  {opportunityPreview.map((opp) => (
                    <div
                      key={opp.id}
                      className="border border-gray-200 rounded-xl p-4 hover:border-navy-300 hover:shadow-md transition-all"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="badge bg-navy-50 text-navy-700">
                          {opp.type}
                        </span>
                      </div>
                      <h4 className="font-semibold text-navy-900 mb-1 line-clamp-2">
                        {opp.title}
                      </h4>
                      <p className="text-sm text-gray-600 mb-2">
                        {opp.company}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <MapPin className="h-3 w-3" />
                        <span>{opp.location}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Alumni Directory Preview */}
          <div className="card p-5 mt-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-navy-900 font-serif">
                Alumni Directory Snapshot
              </h2>
              <Link
                href="/alumni"
                className="text-xs text-gold-600 font-medium"
              >
                View All
              </Link>
            </div>

            {directoryLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
              </div>
            ) : directoryError ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
                {directoryError}
              </div>
            ) : directoryPreview.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No alumni found</p>
              </div>
            ) : (
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
          </div>
        </div>
      </main>
    </div>
  );
}
