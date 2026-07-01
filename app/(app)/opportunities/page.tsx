"use client";

import {
  Calendar,
  User,
  Tag,
  ArrowRight,
  MapPin,
  Plus,
  Users,
  Briefcase,
  Search,
} from "lucide-react";
import { useState, useMemo } from "react";
import Link from "next/link";
import ReferralRequestModal from "@/components/referrals/ReferralRequestModal";
import { isAlumni } from "@/lib/roleUtils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/contexts/auth-context";
import { useOpportunitiesQuery } from "@/hooks/queries/opportunities";

interface Opportunity {
  id: number;
  title: string;
  company: string;
  description: string;
  location: string;
  type: string;
  applyLink: string;
  allowReferrals: boolean;
  postedByName: string;
  postedAt: string;
  referrerUserId?: number;
}

export default function OpportunitiesPage() {
  const { user } = useAuth();
  const { data: rawData = [], isLoading, error } = useOpportunitiesQuery();
  const opportunities = rawData as Opportunity[];
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [referralTarget, setReferralTarget] = useState<Opportunity | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const userRole = user?.roles?.[0] ?? "";
  const isAlumniUser = isAlumni(userRole);
  const canPostOpportunity = isAlumniUser;
  const canViewReceivedReferrals = isAlumniUser;
  const canRequestReferral = true;

  const fetchError = error ? "Unable to load opportunities. Please try again later." : null;

  const filteredOpportunities = useMemo(() => {
    let filtered = activeCategory === "All"
      ? opportunities
      : opportunities.filter((opp) => opp.type === activeCategory);

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (opp) =>
          opp.title.toLowerCase().includes(q) ||
          opp.company.toLowerCase().includes(q) ||
          opp.location.toLowerCase().includes(q)
      );
    }

    return filtered;
  }, [opportunities, activeCategory, searchQuery]);

  return (
    <div className="w-full px-4 sm:px-6 pb-6 space-y-6">
      {/* Header */}
      <div className="sticky top-14 z-30 bg-background/95 backdrop-blur-md py-4 border-b border-border/40 -mx-4 sm:-mx-6 px-4 sm:px-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-xl font-semibold tracking-tight text-foreground">
              Opportunities
            </h1>
            <p className="text-xs text-muted-foreground">
              Stay updated on latest postings from our alumni community
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/referrals/mine">
              <Button variant="outline" size="sm" className="cursor-pointer">
                <Users className="h-4 w-4 mr-1.5" />
                My Referrals
              </Button>
            </Link>
            {canPostOpportunity && (
              <>
                <Link href="/referrals/received">
                  <Button variant="outline" size="sm" className="cursor-pointer">
                    <Users className="h-4 w-4 mr-1.5" />
                    Referral Requests
                  </Button>
                </Link>
                <Link href="/opportunities/new">
                  <Button size="sm" className="cursor-pointer">
                    <Plus className="h-4 w-4 mr-1.5" />
                    Post Opportunity
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <Tabs value={activeCategory} onValueChange={setActiveCategory}>
          <TabsList className="h-8 p-0.5 bg-muted">
            <TabsTrigger value="All" className="h-7 text-xs px-3">All</TabsTrigger>
            <TabsTrigger value="JOB" className="h-7 text-xs px-3">Jobs</TabsTrigger>
            <TabsTrigger value="INTERNSHIP" className="h-7 text-xs px-3">Internships</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/60" />
          <Input
            placeholder="Search opportunities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-8 pl-8 text-xs bg-muted/30 border-border w-[200px] md:w-[240px] focus-visible:ring-1"
          />
        </div>
      </div>

      {/* Error */}
      {fetchError && (
        <Alert variant="destructive">
          <AlertDescription>{fetchError}</AlertDescription>
        </Alert>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-[280px] rounded-xl" />
          ))}
        </div>
      )}

      {/* Empty */}
      {!isLoading && !fetchError && filteredOpportunities.length === 0 && (
        <Card className="rounded-xl border border-border bg-card">
          <CardContent className="flex flex-col items-center py-16 text-center">
            <Briefcase className="h-8 w-8 text-muted-foreground/60 mb-3" />
            <p className="font-semibold text-foreground text-sm">
              {searchQuery ? "No matching opportunities" : "No opportunities found"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {searchQuery ? "Try adjusting your search keywords." : "Check back soon for new postings."}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Opportunities Grid */}
      {!isLoading && filteredOpportunities.length > 0 && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredOpportunities.map((opportunity) => (
            <div
              key={opportunity.id}
              className="bg-card text-card-foreground rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col p-4 gap-3"
            >
              {/* Header */}
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-[10px] font-semibold gap-1">
                  <Tag className="h-3 w-3" />
                  {opportunity.type === "JOB" ? "Job" : "Internship"}
                </Badge>
                <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {new Date(opportunity.postedAt).toLocaleDateString()}
                </span>
              </div>

              {/* Title + Company */}
              <div>
                <h3 className="font-semibold text-sm leading-snug text-foreground line-clamp-1">
                  {opportunity.title}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {opportunity.company}
                </p>
              </div>

              {/* Meta */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5 shrink-0" />
                  <span>{opportunity.location}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <User className="h-3.5 w-3.5 shrink-0" />
                  <span>Posted by {opportunity.postedByName}</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-muted-foreground line-clamp-3 flex-grow">
                {opportunity.description}
              </p>

              {/* Referrals badge */}
              {opportunity.allowReferrals && (
                <div className="flex items-center gap-1.5 text-[10px] text-green-600 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  Referrals Open
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-2 pt-3 border-t border-border mt-auto">
                <a
                  href={opportunity.applyLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1"
                >
                  <Button className="w-full cursor-pointer gap-1.5" size="sm">
                    Apply Now
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </a>
                {opportunity.allowReferrals && canRequestReferral && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="cursor-pointer shrink-0"
                    onClick={() => setReferralTarget(opportunity)}
                  >
                    <Users className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Referral Modal */}
      {referralTarget && (
        <ReferralRequestModal
          opportunity={referralTarget}
          referrerUserId={referralTarget.referrerUserId ?? 0}
          onClose={() => setReferralTarget(null)}
        />
      )}
    </div>
  );
}
