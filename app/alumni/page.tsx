"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AlumniCard from "@/components/alumni/AlumniCard";
import AlumniFiltersPanel from "@/components/alumni/AlumniFilters";
import AlumniDirectoryMap from "@/components/alumni/AlumniDirectoryMap";
import { AlumniFilters } from "@/types";
import { List, MapPin, Users } from "lucide-react";

const API_BASE = "http://localhost:8080";

const resolveImageUrl = (value: string | null | undefined) => {
  if (!value) return null;
  return value.startsWith("http") ? value : `${API_BASE}${value}`;
};

export default function AlumniDirectoryPage() {
  const [viewMode, setViewMode] = useState<"list" | "map">("list");

  const [filters, setFilters] = useState<AlumniFilters>({
    search: "",
    batch: "",
    department: "",
  });

  const [alumni, setAlumni] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [debouncedFilters, setDebouncedFilters] = useState(filters);

  // 🔥 debounce (better UX)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedFilters(filters);
    }, 300);

    return () => clearTimeout(timer);
  }, [filters]);

  // 🚀 fetch alumni
  useEffect(() => {
    const fetchAlumni = async () => {
      setLoading(true);

      const query = new URLSearchParams();

      if (debouncedFilters.search)
        query.append("search", debouncedFilters.search);

      if (debouncedFilters.batch)
        query.append("batch", String(Number(debouncedFilters.batch)));

      if (debouncedFilters.department)
        query.append("department", debouncedFilters.department);

      try {
        const res = await fetch(
          `http://localhost:8080/api/alumni/search?${query}`,
        );

        if (!res.ok) {
          throw new Error("Failed to fetch alumni");
        }

        const data = await res.json();

        console.log("API DATA:", data);

        // ✅ normalize + safety layer
        const safeData = data.map((a: any) => ({
          id: a.id,
          name: a.name || "Unknown", // ✅ real name now
          email: a.email,
          batch: a.batchYear,
          department: a.department,
          company: a.company || a.currentCompany || a.profession,
          currentRole: a.currentRole || a.profession || null,
          location:
            [a.city, a.state, a.country].filter(Boolean).join(", ") ||
            a.location ||
            a.placeOfResidence ||
            null,
          country: a.country || null,
          state: a.state || null,
          city: a.city || null,
          linkedinUrl: a.linkedinUrl,
          profilePicture: resolveImageUrl(
            a.profileImageUrl || a.profilePicture || null,
          ),
          skills: a.skills || [], // ✅ prevent crash
        }));
        console.log("SAFE department:", safeData[0].department);
        setAlumni(safeData);
      } catch (err) {
        console.error("Fetch error:", err);
      }

      setLoading(false);
    };

    fetchAlumni();
  }, [debouncedFilters]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* HEADER */}
      <div className="bg-navy-950 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <Users className="h-6 w-6 text-gold-400" />
            <h1 className="text-3xl text-white font-bold">Alumni Directory</h1>
          </div>
          <p className="text-gray-400">Connect with alumni across industries</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* FILTERS */}
        <div className="card p-5 mb-6">
          <AlumniFiltersPanel filters={filters} onFilterChange={setFilters} />
        </div>

        {/* RESULT HEADER WITH TABS */}
        <div className="flex flex-col items-center gap-4 mb-6">
          {/* Results count */}
          <p className="font-medium text-navy-800">
            {loading ? "Loading..." : `${alumni.length} alumni found`}
          </p>

          {/* View Mode Tabs - Centered & Prominent */}
          <div className="inline-flex bg-gray-100 rounded-xl p-1.5 shadow-sm">
            <button
              onClick={() => setViewMode("list")}
              className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold transition-all ${
                viewMode === "list"
                  ? "bg-navy-800 text-white shadow-md"
                  : "bg-white text-gray-600 hover:text-navy-700"
              }`}
            >
              <List className="h-4 w-4" />
              List View
            </button>
            <button
              onClick={() => setViewMode("map")}
              className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold transition-all ${
                viewMode === "map"
                  ? "bg-navy-800 text-white shadow-md"
                  : "bg-white text-gray-600 hover:text-navy-700"
              }`}
            >
              <MapPin className="h-4 w-4" />
              Map View
            </button>
          </div>
        </div>

        {/* RESULTS */}
        {loading ? (
          <p className="text-center py-10">Loading alumni...</p>
        ) : viewMode === "map" ? (
          <AlumniDirectoryMap />
        ) : alumni.length > 0 ? (
          <div className="space-y-3">
            {alumni.map((a) => (
              <AlumniCard key={a.id} alumni={a} variant="list" />
            ))}
          </div>
        ) : (
          <p className="text-center py-10 text-gray-500">No alumni found</p>
        )}
      </div>

      <Footer />
    </div>
  );
}
