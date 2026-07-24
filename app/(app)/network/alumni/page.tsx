"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { FaLinkedin } from "react-icons/fa";
import {
  Search,
  GraduationCap,
  MapPin,
  Mail,
  Loader2,
  Users,
  LayoutGrid,
  Map as MapIcon,
  ChevronRight,
  X,
  SlidersHorizontal,
  ArrowUpDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import AlumniDirectoryMap from "@/components/alumni/AlumniDirectoryMap";
import { useAlumniQuery, type AlumniProfile } from "@/hooks/queries/alumni";
import { useAuth } from "@/contexts/auth-context";
import { isAlumni, isFaculty } from "@/lib/roleUtils";

type SortKey = "default" | "name-asc" | "name-desc" | "batch-newest" | "batch-oldest";

export default function NetworkAlumniPage() {
  const { user } = useAuth();
  const userRoles = user?.roles ?? "";
  const viewerIsAlumni = isAlumni(userRoles);
  const viewerIsFaculty = isFaculty(userRoles);

  const description = viewerIsAlumni
    ? "Connect with fellow MEC alumni around the world. Explore career paths, discover where classmates are now, and grow your professional network across generations."
    : viewerIsFaculty
      ? "Reconnect with students you taught and see where their journeys have taken them. Discover alumni working across industries, academia, and research worldwide."
      : "Discover and connect with MEC alumni across the globe. Filter by batch, department, location, and profession to find the right connections for mentorship, career guidance, or collaboration.";

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDept, setSelectedDept] = useState("all");
  const [selectedBatch, setSelectedBatch] = useState("all");
  const [sortKey, setSortKey] = useState<SortKey>("default");
  const [viewMode, setViewMode] = useState<"list" | "map">("list");

  const queryParams: Record<string, string> = {};
  if (searchTerm) queryParams.search = searchTerm;
  if (selectedDept !== "all") queryParams.department = selectedDept;
  if (selectedBatch !== "all") queryParams.batch = selectedBatch;

  const { data: rawList = [], isLoading } = useAlumniQuery(queryParams);

  const alumniList = useMemo(() => {
    if (!rawList.length) return [];
    const list = [...rawList];
    switch (sortKey) {
      case "name-asc":
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        list.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "batch-newest":
        list.sort((a, b) => (b.batchYear ?? 0) - (a.batchYear ?? 0));
        break;
      case "batch-oldest":
        list.sort((a, b) => (a.batchYear ?? 0) - (b.batchYear ?? 0));
        break;
    }
    return list;
  }, [rawList, sortKey]);

  const activeFilterCount =
    (selectedDept !== "all" ? 1 : 0) +
    (selectedBatch !== "all" ? 1 : 0) +
    (sortKey !== "default" ? 1 : 0);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedDept("all");
    setSelectedBatch("all");
    setSortKey("default");
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Page Header */}
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Alumni Directory
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed mt-1">
          {description}
        </p>
      </div>

      {/* View Toggle — centered, prominent */}
      <div className="flex justify-center">
        <div className="inline-flex items-center gap-1 bg-card border border-border rounded-xl p-1 shadow-sm">
          <Button
            variant={viewMode === "list" ? "secondary" : "ghost"}
            onClick={() => setViewMode("list")}
            className="cursor-pointer gap-2 h-9 px-4 text-sm font-medium"
          >
            <LayoutGrid className="h-4 w-4" />
            Grid View
          </Button>
          <Button
            variant={viewMode === "map" ? "secondary" : "ghost"}
            onClick={() => setViewMode("map")}
            className="cursor-pointer gap-2 h-9 px-4 text-sm font-medium"
          >
            <MapIcon className="h-4 w-4" />
            Map View
          </Button>
        </div>
      </div>

      {/* Map View */}
      {viewMode === "map" ? (
        <AlumniDirectoryMap />
      ) : (
        <>
          {/* Grid View Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-center gap-3 max-w-3xl mx-auto">
            {/* Search */}
            <div className="relative flex-1 min-w-0 max-w-[280px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
              <Input
                placeholder="Search by name, company, or keyword..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 text-xs h-9"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Filter Row */}
            <div className="grid grid-cols-3 gap-3 flex-1 min-w-0">
              <Select value={selectedDept} onValueChange={(v) => setSelectedDept(v || "all")}>
                <SelectTrigger className="text-xs h-9 min-w-0" title="Filter by academic department">
                  <SelectValue placeholder="Department">
                    {selectedDept !== "all" ? selectedDept : undefined}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="CS">Computer Science (CS)</SelectItem>
                  <SelectItem value="EC">Electronics & Comm (EC)</SelectItem>
                  <SelectItem value="EEE">Electrical & Electronics (EEE)</SelectItem>
                  <SelectItem value="EB">Electronics & Biomedical (EB)</SelectItem>
                  <SelectItem value="ME">Mechanical (ME)</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedBatch} onValueChange={(v) => setSelectedBatch(v || "all")}>
                <SelectTrigger className="text-xs h-9" title="Filter by graduation year">
                  <SelectValue placeholder="Batch Year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Batches</SelectItem>
                  {Array.from({ length: 30 }, (_, i) => 2026 - i).map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      Class of {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortKey} onValueChange={(v) => setSortKey(v as SortKey)}>
                <SelectTrigger className="text-xs h-9" title="Change result ordering">
                  <ArrowUpDown className="h-3.5 w-3.5 mr-1.5 text-muted-foreground/60 shrink-0" />
                  <SelectValue placeholder="Sort" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default Order</SelectItem>
                  <SelectItem value="name-asc">Name A–Z</SelectItem>
                  <SelectItem value="name-desc">Name Z–A</SelectItem>
                  <SelectItem value="batch-newest">Batch (newest)</SelectItem>
                  <SelectItem value="batch-oldest">Batch (oldest)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Active filters bar */}
            {activeFilterCount > 0 && (
              <div className="flex items-center justify-between gap-2 shrink-0">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground whitespace-nowrap">
                  <SlidersHorizontal className="h-3.5 w-3.5" />
                  <span>
                    {activeFilterCount} filter{activeFilterCount > 1 ? "s" : ""} active
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  Clear
                </Button>
              </div>
            )}
          </div>

          {/* Results */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-2 text-muted-foreground">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <p className="text-xs">Loading alumni directory...</p>
            </div>
          ) : alumniList.length === 0 ? (
            <Card className="p-12 text-center border-dashed">
              <CardContent className="p-0 flex flex-col items-center gap-2">
                <Users className="h-8 w-8 text-muted-foreground/40" />
                <h3 className="font-semibold text-sm text-foreground">No Alumni Found</h3>
                <p className="text-xs text-muted-foreground max-w-sm">
                  No graduates match your search criteria. Try clearing filters or searching another keyword.
                </p>
                <Button
                  variant="outline"
                  size="xs"
                  onClick={clearFilters}
                  className="mt-2 cursor-pointer"
                >
                  Reset Filters
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {alumniList.map((alumni: AlumniProfile) => {
                const initial = alumni.name ? alumni.name.charAt(0).toUpperCase() : "A";
                return (
                  <Card
                    key={alumni.id}
                    className="group rounded-2xl border-border shadow-xs hover:shadow-md hover:border-primary/40 transition-all duration-200 flex flex-col h-full"
                  >
                    <CardContent className="p-4 flex flex-col gap-3 flex-1">
                      {/* Header */}
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold text-sm border border-primary/20 shrink-0 overflow-hidden">
                          {alumni.profileImageUrl ? (
                            <img
                              src={alumni.profileImageUrl}
                              alt={alumni.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            initial
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-sm leading-snug text-foreground truncate group-hover:text-primary transition-colors">
                            {alumni.name}
                          </h3>
                          <p className="text-xs text-muted-foreground truncate mt-0.5">
                            {alumni.profession || "MEC Alumni"}
                          </p>
                        </div>
                        {alumni.department && (
                          <Badge variant="secondary" className="font-normal text-[10px] shrink-0">
                            {alumni.department}
                          </Badge>
                        )}
                      </div>

                      {/* Meta rows */}
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <GraduationCap className="h-3.5 w-3.5 shrink-0 text-muted-foreground/70" />
                          <span className="truncate">
                            Class of {alumni.batchYear ?? "—"}
                          </span>
                        </div>
                        {alumni.location && (
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <MapPin className="h-3.5 w-3.5 shrink-0 text-muted-foreground/70" />
                            <span className="truncate">{alumni.location}</span>
                          </div>
                        )}
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between gap-2 pt-3 border-t border-border mt-auto">
                        <div className="flex items-center gap-1">
                          {alumni.email && (
                            <Button
                              variant="ghost"
                              size="icon"
                              asChild
                              className="h-8 w-8 text-muted-foreground hover:text-foreground cursor-pointer"
                              title="Send Email"
                            >
                              <a href={`mailto:${alumni.email}`}>
                                <Mail className="h-4 w-4" />
                              </a>
                            </Button>
                          )}
                          {alumni.linkedinUrl && (
                            <Button
                              variant="ghost"
                              size="icon"
                              asChild
                              className="h-8 w-8 text-muted-foreground hover:text-foreground cursor-pointer"
                              title="LinkedIn Profile"
                            >
                              <a href={alumni.linkedinUrl} target="_blank" rel="noreferrer">
                                <FaLinkedin className="h-4 w-4" />
                              </a>
                            </Button>
                          )}
                        </div>

                        <Button size="sm" variant="outline" asChild className="cursor-pointer">
                          <Link href={`/network/alumni/${alumni.id}`}>
                            View Profile
                            <ChevronRight className="h-3.5 w-3.5" />
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
