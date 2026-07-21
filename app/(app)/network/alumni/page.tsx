"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  GraduationCap,
  MapPin,
  Briefcase,
  Mail,
  ExternalLink,
  Loader2,
  Users,
  LayoutGrid,
  Map as MapIcon,
  ChevronRight,
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
import AlumniDirectoryMap from "@/components/alumni/AlumniDirectoryMap";
import { useAlumniQuery } from "@/hooks/queries/alumni";

export default function NetworkAlumniPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDept, setSelectedDept] = useState("all");
  const [selectedBatch, setSelectedBatch] = useState("all");
  const [viewMode, setViewMode] = useState<"list" | "map">("list");

  const queryParams: Record<string, string> = {};
  if (searchTerm) queryParams.search = searchTerm;
  if (selectedDept !== "all") queryParams.department = selectedDept;
  if (selectedBatch !== "all") queryParams.batch = selectedBatch;

  const { data: alumniList = [], isLoading } = useAlumniQuery(queryParams);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              <Users className="h-3.5 w-3.5 mr-1 text-primary" /> Directory
            </Badge>
            <span className="text-xs text-muted-foreground">Network / Alumni</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground mt-1">
            Alumni Directory
          </h1>
          <p className="text-xs text-muted-foreground">
            Search and connect with verified Model Engineering College graduates.
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-2 bg-muted/60 p-1 rounded-xl border border-border shrink-0 self-start sm:self-center">
          <Button
            variant={viewMode === "list" ? "secondary" : "ghost"}
            size="xs"
            onClick={() => setViewMode("list")}
            className="cursor-pointer"
          >
            <LayoutGrid className="h-3.5 w-3.5 mr-1.5" /> Grid List
          </Button>
          <Button
            variant={viewMode === "map" ? "secondary" : "ghost"}
            size="xs"
            onClick={() => setViewMode("map")}
            className="cursor-pointer"
          >
            <MapIcon className="h-3.5 w-3.5 mr-1.5" /> Map View
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <Card variant="outline" className="p-4 bg-card/60 backdrop-blur-xs border-border">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-6 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
            <Input
              placeholder="Search by name, company, or keyword..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 text-xs"
            />
          </div>

          <div className="sm:col-span-3">
            <Select value={selectedDept} onValueChange={setSelectedDept}>
              <SelectTrigger className="text-xs">
                <SelectValue placeholder="Department" />
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
          </div>

          <div className="sm:col-span-3">
            <Select value={selectedBatch} onValueChange={setSelectedBatch}>
              <SelectTrigger className="text-xs">
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
          </div>
        </div>
      </Card>

      {/* View Modes */}
      {viewMode === "map" ? (
        <AlumniDirectoryMap />
      ) : isLoading ? (
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
              onClick={() => {
                setSearchTerm("");
                setSelectedDept("all");
                setSelectedBatch("all");
              }}
              className="mt-2 cursor-pointer"
            >
              Reset Filters
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {alumniList.map((alumni) => {
            const initial = alumni.name ? alumni.name.charAt(0).toUpperCase() : "A";
            return (
              <Card
                key={alumni.id}
                className="group border-border hover:border-primary/40 transition-all duration-300 shadow-xs hover:shadow-md flex flex-col justify-between"
              >
                <CardContent className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    {/* Header Row */}
                    <div className="flex items-start gap-3">
                      <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-base border border-primary/20 shrink-0">
                        {alumni.profileImageUrl ? (
                          <img
                            src={alumni.profileImageUrl}
                            alt={alumni.name}
                            className="h-full w-full rounded-full object-cover"
                          />
                        ) : (
                          initial
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-sm text-foreground truncate group-hover:text-primary transition-colors">
                          {alumni.name}
                        </h3>
                        <p className="text-xs text-muted-foreground truncate">
                          {alumni.profession || "MEC Alumni"}
                        </p>
                      </div>
                    </div>

                    {/* Badges Row */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {alumni.batchYear && (
                        <Badge variant="outline" className="font-normal text-[11px]">
                          <GraduationCap className="h-3 w-3 mr-1 text-primary" />
                          Class of {alumni.batchYear}
                        </Badge>
                      )}
                      {alumni.department && (
                        <Badge variant="secondary" className="font-normal text-[11px]">
                          {alumni.department}
                        </Badge>
                      )}
                    </div>

                    {/* Location */}
                    {alumni.location && (
                      <p className="text-xs text-muted-foreground flex items-center gap-1.5 truncate pt-1">
                        <MapPin className="h-3.5 w-3.5 text-muted-foreground/70 shrink-0" />
                        <span className="truncate">{alumni.location}</span>
                      </p>
                    )}
                  </div>

                  {/* Actions & Privacy Contact Links */}
                  <div className="pt-4 border-t border-border/50 flex items-center justify-between gap-2 mt-4">
                    <div className="flex items-center gap-1.5">
                      {alumni.email && (
                        <Button variant="ghost" size="icon" asChild className="h-8 w-8 text-muted-foreground hover:text-foreground cursor-pointer" title="Send Email">
                          <a href={`mailto:${alumni.email}`}>
                            <Mail className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                      {alumni.linkedinUrl && (
                        <Button variant="ghost" size="icon" asChild className="h-8 w-8 text-muted-foreground hover:text-foreground cursor-pointer" title="LinkedIn Profile">
                          <a href={alumni.linkedinUrl} target="_blank" rel="noreferrer">
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                    </div>

                    <Button size="xs" variant="outline" asChild className="cursor-pointer">
                      <Link href={`/alumni/${alumni.id}`}>
                        View Profile <ChevronRight className="h-3.5 w-3.5 ml-1" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
