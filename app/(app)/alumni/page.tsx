"use client";

import { useState, useEffect, useMemo } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AlumniCard from "@/components/alumni/AlumniCard";
import AlumniFiltersPanel from "@/components/alumni/AlumniFilters";
import AlumniDirectoryMap from "@/components/alumni/AlumniDirectoryMap";
import { AlumniFilters } from "@/types";
import { Users, MapPin, List } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { useAlumniSearchQuery } from "@/hooks/queries/alumni";
import { BACKEND_URL } from "@/lib/config";

const resolveImageUrl = (value: string | null | undefined) => {
  if (!value) return null;
  return value.startsWith("http") ? value : `${BACKEND_URL}${value}`;
};

export default function AlumniDirectoryPage() {
  const [viewMode, setViewMode] = useState<"list" | "map">("list");

  const [filters, setFilters] = useState<AlumniFilters>({
    search: "",
    batch: "",
    department: "",
  });

  const [debouncedFilters, setDebouncedFilters] = useState(filters);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedFilters(filters);
    }, 300);
    return () => clearTimeout(timer);
  }, [filters]);

  const activeParams: Record<string, string> = {};
  if (debouncedFilters.search) activeParams.search = debouncedFilters.search;
  if (debouncedFilters.batch)
    activeParams.batch = String(Number(debouncedFilters.batch));
  if (debouncedFilters.department)
    activeParams.department = debouncedFilters.department;

  const { data: rawAlumni, isLoading } = useAlumniSearchQuery(
    Object.keys(activeParams).length > 0 ? activeParams : undefined,
  );

  const alumni = useMemo(() => {
    if (!rawAlumni) return [];
    return rawAlumni.map((a: any) => ({
      id: a.id,
      name: a.name || "Unknown",
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
      skills: a.skills || [],
    }));
  }, [rawAlumni]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-2">
        <div className="flex items-center gap-3">
          <Users className="h-5 w-5 text-muted-foreground" />
          <div>
            <h1 className="text-2xl font-semibold text-foreground">
              Alumni Directory
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Connect with alumni across industries
            </p>
          </div>
        </div>
      </div>

      <Separator className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Card className="p-(--card-spacing) mb-6">
          <AlumniFiltersPanel filters={filters} onFilterChange={setFilters} />
        </Card>

        <div className="flex items-center justify-between mb-6">
          {isLoading ? (
            <Skeleton className="h-5 w-32" />
          ) : (
            <p className="text-sm text-muted-foreground">
              {alumni.length} alumni found
            </p>
          )}

          <Tabs
            value={viewMode}
            onValueChange={(v) => setViewMode(v as "list" | "map")}
          >
            <TabsList>
              <TabsTrigger value="list">
                <List className="h-4 w-4" />
                List
              </TabsTrigger>
              <TabsTrigger value="map">
                <MapPin className="h-4 w-4" />
                Map
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={`skel-${i}`} className="h-24 w-full rounded-[min(var(--radius-4xl),24px)]" />
            ))}
          </div>
        ) : viewMode === "map" ? (
          <AlumniDirectoryMap />
        ) : alumni.length > 0 ? (
          <div className="space-y-3">
            {alumni.map((a) => (
              <AlumniCard key={a.id} alumni={a} variant="list" />
            ))}
          </div>
        ) : (
          <Card>
            <div className="flex flex-col items-center py-16">
              <Users className="h-8 w-8 text-muted-foreground mb-4" />
              <p className="font-semibold text-foreground">No alumni found</p>
              <p className="text-sm text-muted-foreground mt-1">
                Try adjusting your search or filters
              </p>
            </div>
          </Card>
        )}
      </div>

      <Footer />
    </div>
  );
}
