"use client";

import {
  Calendar,
  User,
  Tag,
  ArrowRight,
  MapPin,
  Plus,
  Users,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useState, useEffect } from "react";
import Link from "next/link";
import ReferralRequestModal from "@/components/referrals/ReferralRequestModal";
import { hasRole, isAlumni } from "@/lib/roleUtils";
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
  referrerUserId?: number; // ID of the alumni who posted (used for referral requests)
}

// Replace with actual auth logic — e.g. from context/localStorage/cookie
// Token will be read from localStorage at runtime (key: 'token').

export default function OpportunitiesPage() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [filteredOpportunities, setFilteredOpportunities] = useState<
    Opportunity[]
  >([]);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [referralTarget, setReferralTarget] = useState<Opportunity | null>(
    null,
  );
  // Friendly fetch error state (used when token is missing or auth fails)
  const [fetchError, setFetchError] = useState<string | null>(null);

  // User role check - determine what actions user can perform
  const [userPermissions, setUserPermissions] = useState({
    canPostOpportunity: false, // Only alumni
    canViewReceivedReferrals: false, // Only alumni who post opportunities
    canRequestReferral: true, // Students AND alumni can request referrals
  });

  useEffect(() => {
    const stored = localStorage.getItem("alumni_user");
    if (stored) {
      try {
        const user = JSON.parse(stored);
        const userRole = user?.roles || user?.role || "";
        // Only alumni (including batch_admin) can post opportunities and view received referrals
        const isAlumniUser = isAlumni(userRole);
        setUserPermissions({
          canPostOpportunity: isAlumniUser,
          canViewReceivedReferrals: isAlumniUser,
          canRequestReferral: true, // Everyone can request referrals
        });
      } catch {
        setUserPermissions({
          canPostOpportunity: false,
          canViewReceivedReferrals: false,
          canRequestReferral: true,
        });
      }
    }
  }, []);

  useEffect(() => {
    const fetchOpportunities = async () => {
      setFetchError(null);
      try {
        const res = await fetch("http://localhost:8080/opportunities/all", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          setFetchError(`Failed to fetch opportunities: Error ${res.status}`);
          return;
        }

        const data: Opportunity[] = await res.json();
        setOpportunities(data);
      } catch (error) {
        console.error("Failed to fetch opportunities:", error);
        setFetchError("Unable to load opportunities. Please try again later.");
      }
    };
    fetchOpportunities();
  }, []);

  useEffect(() => {
    if (activeCategory === "All") {
      setFilteredOpportunities(opportunities);
    } else {
      setFilteredOpportunities(
        opportunities.filter((opp) => opp.type === activeCategory),
      );
    }
  }, [opportunities, activeCategory]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="bg-navy-950 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-serif text-3xl font-bold text-white mb-2">
            Opportunities
          </h1>
          <p className="text-gray-400">
            Stay updated on latest postings from our alumni community
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {fetchError ? (
          <div className="max-w-3xl mx-auto mb-6">
            <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-red-700 text-sm">
              {fetchError}
            </div>
          </div>
        ) : null}
        <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {["All", "JOB", "INTERNSHIP"].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === cat
                    ? "bg-navy-800 text-white"
                    : "bg-white border border-gray-200 text-gray-600 hover:border-navy-300"
                }`}
              >
                {cat === "JOB"
                  ? "Jobs"
                  : cat === "INTERNSHIP"
                    ? "Internships"
                    : cat}
              </button>
            ))}
          </div>

          <div className="flex gap-3">
            {/* My Referrals - visible to everyone (students can track their requests, alumni can see theirs) */}
            <Link href="/referrals/mine">
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-navy-200 text-navy-700 text-sm font-medium hover:bg-navy-50 transition-colors">
                <Users className="h-4 w-4" />
                My Referrals
              </button>
            </Link>

            {/* Referral Requests & Post Opportunity - alumni only */}
            {userPermissions.canPostOpportunity && (
              <>
                <Link href="/referrals/received">
                  <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-navy-200 text-navy-700 text-sm font-medium hover:bg-navy-50 transition-colors">
                    <Users className="h-4 w-4" />
                    Referral Requests
                  </button>
                </Link>
                <Link href="/opportunities/new">
                  <button className="btn-primary flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Post Opportunity
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Opportunities Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOpportunities.length === 0 ? (
            <p className="col-span-full text-center text-gray-600 py-16">
              No opportunities found for this category.
            </p>
          ) : (
            filteredOpportunities.map((opportunity) => (
              <article
                key={opportunity.id}
                className="card overflow-hidden flex flex-col group hover:-translate-y-1 transition-all duration-300"
              >
                <div className="p-5 flex flex-col flex-grow">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="badge bg-navy-50 text-navy-700 flex items-center gap-1">
                      <Tag className="h-3 w-3" />
                      {opportunity.type === "JOB" ? "Job" : "Internship"}
                    </span>
                    <span className="badge bg-gray-100 text-gray-700 flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(opportunity.postedAt).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="font-bold text-navy-900 mb-2 group-hover:text-navy-700 transition-colors">
                    {opportunity.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-1">
                    <span className="font-medium text-navy-800">Company:</span>{" "}
                    {opportunity.company}
                  </p>
                  <p className="text-gray-600 text-sm mb-3 flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-gray-500" />
                    <span className="font-medium text-navy-800">
                      Location:
                    </span>{" "}
                    {opportunity.location}
                  </p>
                  <p className="text-gray-500 text-sm mb-4 line-clamp-3 flex-grow">
                    {opportunity.description}
                  </p>

                  <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
                    <span className="flex items-center gap-1.5">
                      <User className="h-3 w-3" />
                      Posted by: {opportunity.postedByName}
                    </span>
                    {opportunity.allowReferrals && (
                      <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                        Referrals Open
                      </span>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 mt-auto">
                    <a
                      href={opportunity.applyLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary flex-1 flex items-center justify-center gap-2"
                    >
                      Apply Now <ArrowRight className="h-4 w-4" />
                    </a>
                    {opportunity.allowReferrals &&
                      userPermissions.canRequestReferral && (
                        <button
                          onClick={() => setReferralTarget(opportunity)}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-navy-200 text-navy-700 text-sm font-medium hover:bg-navy-50 transition-colors shrink-0"
                          title="Request a Referral"
                        >
                          <Users className="h-4 w-4" />
                          Refer Me
                        </button>
                      )}
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </div>

      <Footer />

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
