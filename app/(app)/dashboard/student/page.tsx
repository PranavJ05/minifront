"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
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
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { hasRole } from "@/lib/roleUtils";
import { useAuth } from "@/contexts/auth-context";
import { useOpportunitiesQuery } from "@/hooks/queries/opportunities";
import { useAlumniSearchQuery } from "@/hooks/queries/alumni";
import { BACKEND_URL } from "@/lib/config";

const resolveImageUrl = (value: string | null) => {
  if (!value) return null;
  return value.startsWith("http") ? value : `${BACKEND_URL}${value}`;
};

export default function StudentDashboard() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const {
    data: opportunities = [],
    isLoading: loadingOpportunities,
    error: opportunityError,
  } = useOpportunitiesQuery();
  const {
    data: directoryData,
    isLoading: directoryLoading,
    error: directoryError,
  } = useAlumniSearchQuery();

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated || !user) {
      router.replace("/auth/login");
      return;
    }

    const userRole = user.roles || "";
    const isAllowedRole = hasRole(userRole, ["student"]);

    if (!isAllowedRole) {
      router.replace("/auth/login");
    }
  }, [authLoading, isAuthenticated, user, router]);

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

  const opportunityPreview = useMemo(
    () => opportunities.slice(0, 3),
    [opportunities],
  );
  const directoryPreview = useMemo(() => directory.slice(0, 3), [directory]);

  if (!user) return null;

  const firstName = user.fullName ? user.fullName.split(" ")[0] : "Student";

  return (
    <div className="w-full px-4 sm:px-6 pb-6 space-y-6">
      {/* Sticky Header */}
      <div className="sticky top-14 z-30 bg-background/95 backdrop-blur-md py-4 border-b border-border/40 -mx-4 sm:-mx-6 px-4 sm:px-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h1 className="text-xl font-semibold tracking-tight text-foreground">
              Welcome back, {firstName}
            </h1>
            <p className="text-xs text-muted-foreground">
              Discover active alumni opportunities and search the graduate network.
            </p>
          </div>
          <Button variant="outline" size="sm" asChild className="cursor-pointer">
            <Link href="/alumni">
              Directory Snapshot <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Quick Search Card */}
      <Card className="p-4 bg-muted/30 border-border">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">Find Alumni Fast</h2>
            <Link href="/alumni" className="text-xs text-muted-foreground hover:text-foreground font-medium flex items-center gap-1">
              Full directory <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/60" />
            <Input
              placeholder="Search by name, company, or domain..."
              className="pl-9 h-9 text-xs bg-background border-border"
            />
          </div>
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          {
            label: "Open Opportunities",
            value: String(opportunities.length || 0),
            icon: Briefcase,
          },
          {
            label: "Directory Preview",
            value: String(directory.length || 0),
            icon: Users,
          },
          {
            label: "Departments",
            value: String(
              new Set(directory.map((item) => item.department).filter(Boolean)).size
            ),
            icon: Building2,
          },
          {
            label: "Locations",
            value: String(
              new Set(directory.map((item) => item.location).filter(Boolean)).size
            ),
            icon: MapPin,
          },
        ].map(({ label, value, icon: Icon }) => (
          <Card key={label} className="p-4">
            <CardContent className="p-0 flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-muted text-foreground shrink-0">
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <div className="text-lg font-semibold tracking-tight text-foreground leading-none">
                  {value}
                </div>
                <div className="text-xs text-muted-foreground mt-1 truncate">
                  {label}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Opportunities Section */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">Current Opportunities</h2>
          <Link href="/opportunities" className="text-xs text-muted-foreground hover:text-foreground font-medium">
            View All
          </Link>
        </div>

        {loadingOpportunities ? (
          <Card>
            <CardContent className="flex items-center justify-center py-10 gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-xs">Loading opportunities...</span>
            </CardContent>
          </Card>
        ) : opportunityError ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-xs">
              {opportunityError?.message || "Could not load opportunities"}
            </AlertDescription>
          </Alert>
        ) : opportunityPreview.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center py-10 text-center gap-1">
              <Briefcase className="h-6 w-6 text-muted-foreground/60 mb-1" />
              <p className="text-xs font-semibold text-foreground">No opportunities posted</p>
              <p className="text-[10px] text-muted-foreground">Check back soon for new postings from alumni.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-3 gap-4">
            {opportunityPreview.map((opp) => (
              <Card key={opp.id} className="p-4 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <Badge variant="secondary" className="text-[10px]">
                    {opp.type}
                  </Badge>
                  <h3 className="font-semibold text-xs text-foreground line-clamp-1">
                    {opp.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-snug line-clamp-1">
                    {opp.company}
                  </p>
                  <p className="text-[10px] text-muted-foreground/80 flex items-center gap-1">
                    <MapPin className="h-3 w-3 shrink-0" /> {opp.location}
                  </p>
                </div>
                <Button variant="ghost" size="xs" asChild className="w-full justify-between cursor-pointer text-xs">
                  <Link href="/opportunities">
                    Details <ArrowRight className="h-3 w-3" />
                  </Link>
                </Button>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Directory Snapshot Section */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">Directory Snapshot</h2>
          <Link href="/alumni" className="text-xs text-muted-foreground hover:text-foreground font-medium">
            View All
          </Link>
        </div>

        {directoryLoading ? (
          <Card>
            <CardContent className="flex items-center justify-center py-10 gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-xs">Loading alumni directory...</span>
            </CardContent>
          </Card>
        ) : directoryError ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-xs">
              {directoryError?.message || "Could not load directory"}
            </AlertDescription>
          </Alert>
        ) : directoryPreview.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center py-10 text-center gap-1">
              <Users className="h-6 w-6 text-muted-foreground/60 mb-1" />
              <p className="text-xs font-semibold text-foreground">No alumni listed</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-3 gap-4">
            {directoryPreview.map((alumni) => {
              const avatar = resolveImageUrl(alumni.profileImageUrl);
              return (
                <Card key={alumni.id} className="p-4 flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-muted overflow-hidden flex items-center justify-center shrink-0 border border-border">
                    {avatar ? (
                      <img src={avatar} alt={alumni.name} className="w-full h-full object-cover" />
                    ) : (
                      <Users className="h-4 w-4 text-muted-foreground/60" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1 space-y-0.5">
                    <p className="font-semibold text-xs text-foreground truncate">
                      {alumni.name}
                    </p>
                    <p className="text-[10px] text-muted-foreground truncate">
                      {alumni.profession || "Alumni"}
                    </p>
                    <p className="text-[10px] text-muted-foreground/60 truncate">
                      {alumni.department || alumni.location || "MEC Graduate"}
                    </p>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
