"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Users,
  Briefcase,
  Calendar,
  ArrowRight,
  Search,
  MapPin,
  Loader2,
  AlertCircle,
} from "lucide-react";
import DashboardSidebar from "@/components/layout/DashboardSidebar";
import { hasRole } from "@/lib/roleUtils";

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

const resolveImageUrl = (value: string | null) => {
  if (!value) return null;
  return value.startsWith("http") ? value : `${API_BASE}${value}`;
};

export default function StudentDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [opportunities, setOpportunities] = useState<OpportunityPreview[]>([]);
  const [loadingOpportunities, setLoadingOpportunities] = useState(true);
  const [opportunityError, setOpportunityError] = useState<string | null>(null);
  const [directory, setDirectory] = useState<AlumniPreview[]>([]);
  const [directoryLoading, setDirectoryLoading] = useState(true);
  const [directoryError, setDirectoryError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const stored = localStorage.getItem("alumni_user");

    if (!token || !stored) {
      router.replace("/auth/login");
      return;
    }

    const u = JSON.parse(stored);
    const userRole = u.roles || u.role || "";

    // ✅ Robust Role Check - only allow student role
    const isAllowedRole = hasRole(userRole, ["student"]);

    if (!isAllowedRole) {
      router.replace("/auth/login");
      return;
    }

    setUser(u);
  }, [router]);

  useEffect(() => {
    const loadOpportunities = async () => {
      setLoadingOpportunities(true);
      setOpportunityError(null);

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
        setOpportunityError(err.message || "Failed to load opportunities.");
      } finally {
        setLoadingOpportunities(false);
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
        role="student"
        userName={user.fullName}
        userEmail={user.email}
      />
      <main className="flex-1 overflow-auto p-6">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="font-serif text-2xl font-bold text-navy-900">
              Welcome, {user.fullName.split(" ")[0]}! 👋
            </h1>
            <p className="text-gray-500">
              Browse live opportunities and discover alumni across the network.
            </p>
          </div>

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

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {[
              {
                label: "Open Opportunities",
                value: String(opportunities.length || 0),
                icon: Briefcase,
                color: "text-green-600",
                bg: "bg-green-50",
              },
              {
                label: "Directory Preview",
                value: String(directory.length || 0),
                icon: Users,
                color: "text-blue-600",
                bg: "bg-blue-50",
              },
              {
                label: "Departments",
                value: String(
                  new Set(
                    directory.map((item) => item.department).filter(Boolean),
                  ).size,
                ),
                icon: Calendar,
                color: "text-purple-600",
                bg: "bg-purple-50",
              },
              {
                label: "Locations",
                value: String(
                  new Set(
                    directory.map((item) => item.location).filter(Boolean),
                  ).size,
                ),
                icon: MapPin,
                color: "text-gold-600",
                bg: "bg-gold-50",
              },
            ].map(({ label, value, icon: Icon, color, bg }) => (
              <div key={label} className="card p-5 text-center">
                <div
                  className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mx-auto mb-3`}
                >
                  <Icon className={`h-5 w-5 ${color}`} />
                </div>
                <div className="text-2xl font-bold text-navy-900 font-serif">
                  {value}
                </div>
                <div className="text-xs text-gray-500 mt-0.5">{label}</div>
              </div>
            ))}
          </div>

          <section className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-navy-900 font-serif">
                Current Opportunities
              </h2>
              <Link
                href="/opportunities"
                className="text-xs text-gold-600 font-medium"
              >
                View All
              </Link>
            </div>

            {loadingOpportunities ? (
              <div className="card p-8 flex items-center justify-center gap-3 text-gray-500">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span className="text-sm">Loading opportunities...</span>
              </div>
            ) : opportunityError ? (
              <div className="card p-6 border border-red-200 bg-red-50 text-red-700 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-sm">
                    Could not load opportunities
                  </p>
                  <p className="text-sm mt-1">{opportunityError}</p>
                </div>
              </div>
            ) : opportunityPreview.length === 0 ? (
              <div className="card p-8 text-center">
                <p className="font-semibold text-navy-900">
                  No opportunities available
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Check back soon for new openings from the alumni network.
                </p>
              </div>
            ) : (
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
                      <MapPin className="h-3.5 w-3.5" /> {opportunity.location}
                    </p>
                    <Link
                      href="/opportunities"
                      className="inline-flex items-center gap-1 text-sm text-gold-600 font-medium mt-4"
                    >
                      View all opportunities <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-navy-900 font-serif">
                Directory Snapshot
              </h2>
              <Link
                href="/alumni"
                className="text-xs text-gold-600 font-medium"
              >
                View All
              </Link>
            </div>

            {directoryLoading ? (
              <div className="card p-8 flex items-center justify-center gap-3 text-gray-500">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span className="text-sm">Loading alumni directory...</span>
              </div>
            ) : directoryError ? (
              <div className="card p-6 border border-red-200 bg-red-50 text-red-700 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-sm">
                    Could not load directory
                  </p>
                  <p className="text-sm mt-1">{directoryError}</p>
                </div>
              </div>
            ) : directoryPreview.length === 0 ? (
              <div className="card p-8 text-center">
                <p className="font-semibold text-navy-900">No alumni found</p>
                <p className="text-sm text-gray-500 mt-1">
                  The alumni directory preview is empty right now.
                </p>
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
          </section>
        </div>
      </main>
    </div>
  );
}
