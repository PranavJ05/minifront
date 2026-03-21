"use client";

import Image from "next/image";
import { Calendar, User, Tag, ArrowRight, MapPin, Plus } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useState, useEffect } from "react";
import Link from "next/link";

interface Opportunity {
  id: number;
  title: string;
  company: string;
  description: string;
  location: string;
  type: string;
  applyLink: string;
  allowReferrals: boolean;
  postedByName: string; // Changed from postedBy to match backend response
  postedAt: string;
}

export default function OpportunitiesPage() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [filteredOpportunities, setFilteredOpportunities] = useState<
    Opportunity[]
  >([]);
  const [activeCategory, setActiveCategory] = useState<string>("All");

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        // In a real application, the token would be dynamically retrieved from an authentication context or local storage.
        // For demonstration purposes, I'm using the hardcoded token from your curl example.
        const token =
          "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJqb2VAbWVjLmFjLmluIiwiaWF0IjoxNzc0MDc3MDE5LCJleHAiOjE3NzQxNjM0MTl9.4lfj_SGs05dnuLmK3yR3W4FQWJ9VvHQiS0GONme2DJU";

        const res = await fetch("http://localhost:8080/opportunities/all", {
          method: "GET", // Changed from POST to GET as per backend endpoint
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Added Authorization header
          },
        });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data: Opportunity[] = await res.json();
        setOpportunities(data);
      } catch (error) {
        console.error("Failed to fetch opportunities:", error);
        // You might want to set an error state here to display feedback to the user
      }
    };

    fetchOpportunities();
  }, []); // The empty dependency array ensures this effect runs only once after the initial render.

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
        <div className="flex justify-between items-center mb-6">
          {/* Categories */}
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
          <Link href="/opportunities/new">
            <button className="btn-primary flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create New Opportunity
            </button>
          </Link>
        </div>

        {/* Opportunities Listing */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOpportunities.length === 0 ? (
            <p className="col-span-full text-center text-gray-600">
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
                      <span className="text-green-600 font-semibold">
                        Referrals Allowed
                      </span>
                    )}
                  </div>
                  <a
                    href={opportunity.applyLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary flex items-center justify-center gap-2 mt-auto"
                  >
                    Apply Now <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              </article>
            ))
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
