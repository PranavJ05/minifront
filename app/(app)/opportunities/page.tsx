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
  CheckCircle2,
  Building2,
  Mail,
  Phone,
  Info,
  X,
  ShieldCheck,
  Loader2,
} from "lucide-react";
import { useState, useMemo } from "react";
import Link from "next/link";
import { toast } from "sonner";
import ReferralRequestModal from "@/components/referrals/ReferralRequestModal";
import { isAlumni, isStudent, isFaculty, isMainAdmin } from "@/lib/roleUtils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/contexts/auth-context";
import {
  useOpportunitiesQuery,
  useVerifyOpportunityMutation,
  type Opportunity,
} from "@/hooks/queries/opportunities";
import { getErrorMessage } from "@/lib/get-error-message";

export default function OpportunitiesPage() {
  const { user } = useAuth();
  const { data: rawData = [], isLoading, error } = useOpportunitiesQuery();
  const opportunities = rawData as Opportunity[];
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [referralTarget, setReferralTarget] = useState<Opportunity | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showPlacementModal, setShowPlacementModal] = useState(false);
  const [verifyingId, setVerifyingId] = useState<number | null>(null);

  const verifyMutation = useVerifyOpportunityMutation();

  const userRoles = user?.roles ?? [];
  const isStudentUser = isStudent(userRoles);
  const isAlumniUser = isAlumni(userRoles);
  const isFacultyUser = isFaculty(userRoles);
  const isAdminUser = isMainAdmin(userRoles);

  // All alumni, faculty, and admins can post opportunities
  const canPostOpportunity = isAlumniUser || isFacultyUser || isAdminUser;

  const fetchError = error ? "Unable to load opportunities. Please try again later." : null;

  const handleToggleVerification = async (oppId: number) => {
    setVerifyingId(oppId);
    try {
      await verifyMutation.mutateAsync(oppId);
      toast.success("Opportunity verification updated");
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "Failed to update verification"));
    } finally {
      setVerifyingId(null);
    }
  };

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
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 pb-6 space-y-6">
      {/* Header */}
      <div className="sticky top-14 z-30 bg-background/95 backdrop-blur-md py-4 border-b border-border/40 -mx-4 sm:-mx-6 px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <h1 className="text-xl font-semibold tracking-tight text-foreground flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-primary" /> Opportunities
            </h1>
            <p className="text-xs text-muted-foreground">
              Career postings, placement referrals, and job opportunities from the alumni network.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {/* Student Placement Cell Modal Button */}
            {isStudentUser && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowPlacementModal(true)}
                className="cursor-pointer"
              >
                <Building2 className="h-4 w-4 mr-1.5 text-primary" /> Placement Cell
              </Button>
            )}

            <Link href="/referrals/mine">
              <Button variant="outline" size="sm" className="cursor-pointer">
                <Users className="h-4 w-4 mr-1.5" /> My Referrals
              </Button>
            </Link>

            {canPostOpportunity && (
              <>
                <Link href="/referrals/received">
                  <Button variant="outline" size="sm" className="cursor-pointer">
                    <Users className="h-4 w-4 mr-1.5" /> Referral Requests
                  </Button>
                </Link>
                <Link href="/opportunities/new">
                  <Button size="sm" className="cursor-pointer">
                    <Plus className="h-4 w-4 mr-1.5" /> Post Opportunity
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Student Placement Banner Notice */}
      {isStudentUser && (
        <Card className="border-primary/30 bg-primary/5 p-4">
          <CardContent className="p-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-start sm:items-center gap-2.5">
              <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
                <Building2 className="h-4 w-4" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Official Student Placements & Internships</p>
                <p className="text-muted-foreground text-[11px]">
                  Campus placements for current students are coordinated officially through the MEC Training & Placement Cell.
                </p>
              </div>
            </div>
            <Button
              size="xs"
              onClick={() => setShowPlacementModal(true)}
              className="shrink-0 cursor-pointer"
            >
              Contact Placement Cell
            </Button>
          </CardContent>
        </Card>
      )}

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
              className="bg-card text-card-foreground rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col p-5 gap-3"
            >
              {/* Header Badges */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <Badge variant="secondary" className="text-[10px] font-semibold gap-1">
                    <Tag className="h-3 w-3" />
                    {opportunity.type === "JOB" ? "Job" : "Internship"}
                  </Badge>

                  {/* Verified Blue Check Badge */}
                  {opportunity.verified && (
                    <Badge variant="secondary" className="text-[10px] font-semibold gap-1 bg-blue-500/10 text-blue-600 border border-blue-500/20">
                      <CheckCircle2 className="h-3 w-3 fill-blue-500 text-white" />
                      Verified
                    </Badge>
                  )}
                </div>

                <span className="text-[10px] text-muted-foreground flex items-center gap-1 shrink-0">
                  <Calendar className="h-3 w-3" />
                  {new Date(opportunity.postedAt).toLocaleDateString()}
                </span>
              </div>

              {/* Title + Company */}
              <div>
                <h3 className="font-bold text-sm leading-snug text-foreground line-clamp-1">
                  {opportunity.title}
                </h3>
                <p className="text-xs font-medium text-muted-foreground mt-0.5">
                  {opportunity.company}
                </p>
              </div>

              {/* Meta Info */}
              <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">{opportunity.location}</span>
                </div>
                {opportunity.postedByName && (
                  <div className="flex items-center gap-2">
                    <User className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">Posted by {opportunity.postedByName}</span>
                  </div>
                )}
              </div>

              {/* Description */}
              {opportunity.description && (
                <p className="text-xs text-muted-foreground line-clamp-3 flex-grow leading-relaxed">
                  {opportunity.description}
                </p>
              )}

              {/* Referrals badge */}
              {opportunity.allowReferrals && (
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Alumni Referrals Open
                </div>
              )}

              {/* Admin Toggle Verification Button */}
              {isAdminUser && (
                <Button
                  size="xs"
                  variant="outline"
                  onClick={() => handleToggleVerification(opportunity.id)}
                  disabled={verifyingId === opportunity.id}
                  className="w-full text-xs font-medium cursor-pointer my-1 border-blue-500/30 text-blue-600 hover:bg-blue-500/10"
                >
                  {verifyingId === opportunity.id ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" />
                  ) : (
                    <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                  )}
                  {opportunity.verified ? "Remove Verification Badge" : "Mark as Verified Opportunity"}
                </Button>
              )}

              {/* Actions */}
              <div className="flex items-center gap-2 pt-3 border-t border-border mt-auto">
                {opportunity.applyLink && (
                  <a
                    href={opportunity.applyLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1"
                  >
                    <Button className="w-full cursor-pointer gap-1.5" size="xs">
                      Apply Now <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </a>
                )}
                {opportunity.allowReferrals && (
                  <Button
                    variant="outline"
                    size="xs"
                    className="cursor-pointer shrink-0"
                    title="Request Referral"
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
          referrerUserId={0}
          onClose={() => setReferralTarget(null)}
        />
      )}

      {/* Placement Cell Information Modal */}
      {showPlacementModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <Card className="max-w-md w-full p-6 space-y-5 border-border shadow-xl">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                <h2 className="text-base font-bold text-foreground">Training &amp; Placement Cell</h2>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowPlacementModal(false)}
                className="h-7 w-7 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 text-foreground space-y-1">
                <p className="font-semibold flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-primary" /> Official Student Recruitment &amp; Campus Placements
                </p>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  All student placement drives, internships, and campus recruitment processes are officially managed through the Model Engineering College Training &amp; Placement Cell.
                </p>
              </div>

              <div className="space-y-2.5">
                <div className="flex items-start gap-2.5">
                  <Mail className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-foreground">Placement Cell Email</p>
                    <a href="mailto:placement@mec.ac.in" className="text-primary hover:underline font-medium">
                      placement@mec.ac.in
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Building2 className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-foreground">Office Location</p>
                    <p className="text-muted-foreground">Room 102, Administrative Block, Model Engineering College, Thrikkakara</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Phone className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-foreground">Contact Phone</p>
                    <p className="text-muted-foreground">+91 484 2575370 / +91 484 2577379</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-border flex justify-end">
              <Button size="xs" onClick={() => setShowPlacementModal(false)} className="cursor-pointer">
                Close
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
