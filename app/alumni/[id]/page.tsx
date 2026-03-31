// app/alumni/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  MapPin,
  Briefcase,
  GraduationCap,
  Linkedin,
  Mail,
  MessageSquare,
  UserPlus,
  Shield,
  Building,
  Calendar,
  Globe,
  Award,
  Users,
  TrendingUp,
  ExternalLink,
  Bookmark,
  Clock,
  ChevronRight,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getInitials } from "@/lib/utils";

interface Props {
  params: { id: string };
}

// Skill object from backend
interface Skill {
  skillId: number;
  skillName: string;
  isStarter: boolean;
}

// Event object from backend
interface Event {
  eventId: number;
  title: string;
  description: string;
  eventDate: string;
  location: string | null;
  registrationLink: string | null;
}

// Opportunity object from backend
interface Opportunity {
  opportunityId: number;
  title: string;
  description: string;
  type: "JOB" | "INTERNSHIP" | "MENTORSHIP" | string;
  company: string | null;
  location: string | null;
  postedAt: string;
}

// Define the shape of the data coming from your Spring Boot backend
interface AlumniProfile {
  id: number;
  name: string;
  email: string;
  profileImageUrl: string | null;
  batchYear: number | null;
  courseCode: string | null;
  courseName: string | null;
  branchCode: string | null;
  branchName: string | null;
  department: string | null;
  profession: string | null;
  linkedinUrl: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  countryCode: string | null;
  stateCode: string | null;
  fullLocation: string | null;
  latitude: number | null;
  longitude: number | null;
  skills: Skill[] | null;
  events: Event[] | null;
  opportunities: Opportunity[] | null;
  totalSkills: number;
  totalEvents: number;
  totalOpportunities: number;
}

const API_BASE = "http://localhost:8080";

export default function AlumniProfilePage({ params }: Props) {
  const [alumni, setAlumni] = useState<AlumniProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFoundFlag, setNotFoundFlag] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch(
          `http://localhost:8080/api/alumni/${params.id}`,
          { cache: "no-store" },
        );

        if (!res.ok) {
          if (res.status === 404) {
            setNotFoundFlag(true);
          }
          return;
        }

        const data: AlumniProfile = await res.json();
        setAlumni(data);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-4 border-navy-800 border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-gray-600">Loading profile...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (notFoundFlag || !alumni) {
    notFound();
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get opportunity type badge color
  const getTypeBadgeColor = (type: string) => {
    switch (type.toUpperCase()) {
      case "JOB":
        return "bg-green-100 text-green-700 border-green-200";
      case "INTERNSHIP":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "MENTORSHIP":
        return "bg-purple-100 text-purple-700 border-purple-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Back */}
          <Link
            href="/alumni"
            className="inline-flex items-center gap-2 text-gray-300 hover:text-white transition-colors mb-8 text-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Directory
          </Link>

          <div className="flex flex-col md:flex-row items-start gap-6">
            {/* Profile Image */}
            <div className="flex-shrink-0">
              <div className="w-32 h-32 rounded-2xl overflow-hidden border-4 border-white/20 shadow-2xl bg-white/10">
                {alumni.profileImageUrl ? (
                  <Image
                    src={alumni.profileImageUrl}
                    alt={alumni.name}
                    width={128}
                    height={128}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white font-bold text-4xl">
                    {getInitials(alumni.name)}
                  </div>
                )}
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex items-start gap-3 mb-2">
                <h1 className="text-3xl font-bold font-serif">{alumni.name}</h1>
                <Shield
                  className="h-5 w-5 text-blue-400 flex-shrink-0 mt-1"
                  aria-label="Verified Alumni"
                />
              </div>

              <p className="text-gold-400 font-medium text-lg mb-2">
                {alumni.profession || "Professional"}
              </p>

              <div className="flex flex-wrap gap-4 text-sm text-gray-300 mb-4">
                {alumni.fullLocation && (
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" />
                    <span>{alumni.fullLocation}</span>
                  </div>
                )}
                {alumni.batchYear && (
                  <div className="flex items-center gap-1.5">
                    <GraduationCap className="h-4 w-4" />
                    <span>Class of {alumni.batchYear}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                {alumni.linkedinUrl && (
                  <a
                    href={alumni.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-[#0077b5] hover:bg-[#006097] text-white font-semibold py-2.5 px-5 rounded-lg transition-colors"
                  >
                    <Linkedin className="h-4 w-4" />
                    View LinkedIn Profile
                  </a>
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="flex gap-6 md:border-l md:border-white/10 md:pl-6">
              <div className="text-center">
                <div className="flex items-center gap-1.5 text-gold-400 mb-1">
                  <Award className="h-5 w-5" />
                  <span className="text-2xl font-bold">
                    {alumni.totalSkills}
                  </span>
                </div>
                <p className="text-xs text-gray-400">Skills</p>
              </div>
              <div className="text-center">
                <div className="flex items-center gap-1.5 text-gold-400 mb-1">
                  <Users className="h-5 w-5" />
                  <span className="text-2xl font-bold">
                    {alumni.totalEvents}
                  </span>
                </div>
                <p className="text-xs text-gray-400">Events</p>
              </div>
              <div className="text-center">
                <div className="flex items-center gap-1.5 text-gold-400 mb-1">
                  <TrendingUp className="h-5 w-5" />
                  <span className="text-2xl font-bold">
                    {alumni.totalOpportunities}
                  </span>
                </div>
                <p className="text-xs text-gray-400">Opportunities</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Info Cards */}
          <div className="lg:col-span-1 space-y-4">
            {/* Academic Info */}
            <div className="card p-5">
              <h3 className="font-bold text-navy-900 mb-4 flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-gold-500" />
                Academic Information
              </h3>
              <div className="space-y-3 text-sm">
                {alumni.branchName && (
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide">
                      Branch
                    </p>
                    <p className="font-medium text-navy-900">
                      {alumni.branchName}
                    </p>
                  </div>
                )}
                {alumni.courseName && (
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide">
                      Department
                    </p>
                    <p className="font-medium text-navy-900">
                      {alumni.courseName}
                    </p>
                  </div>
                )}
                {alumni.batchYear && (
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide">
                      Batch
                    </p>
                    <p className="font-medium text-navy-900">
                      {alumni.batchYear}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Contact Info */}
            <div className="card p-5">
              <h3 className="font-bold text-navy-900 mb-4 flex items-center gap-2">
                <Mail className="h-4 w-4 text-gold-500" />
                Contact Information
              </h3>
              <div className="space-y-3 text-sm">
                {alumni.email && (
                  <div className="flex items-center gap-2.5 text-gray-600">
                    <Mail className="h-4 w-4 flex-shrink-0 text-navy-600" />
                    <span className="truncate">{alumni.email}</span>
                  </div>
                )}
                {alumni.fullLocation && (
                  <div className="flex items-center gap-2.5 text-gray-600">
                    <MapPin className="h-4 w-4 flex-shrink-0 text-navy-600" />
                    <span className="truncate">{alumni.fullLocation}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Main Content */}
          <div className="lg:col-span-2 space-y-5">
            {/* Skills */}
            {alumni.skills && alumni.skills.length > 0 && (
              <div className="card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-navy-900 text-lg font-serif flex items-center gap-2">
                    <Globe className="h-5 w-5 text-gold-500" />
                    Skills & Expertise
                  </h2>
                  <span className="text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    {alumni.totalSkills} skills
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {alumni.skills.map((skill) => (
                    <span
                      key={skill.skillId}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                        skill.isStarter
                          ? "bg-navy-50 text-navy-700 border-navy-200"
                          : "bg-gold-50 text-gold-700 border-gold-200"
                      }`}
                    >
                      {skill.isStarter && <Award className="h-3 w-3" />}
                      {skill.skillName}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Events */}
            {alumni.events && alumni.events.length > 0 && (
              <div className="card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-navy-900 text-lg font-serif flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-gold-500" />
                    Events
                  </h2>
                  <span className="text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    {alumni.totalEvents} events
                  </span>
                </div>
                <div className="space-y-4">
                  {alumni.events.map((event) => (
                    <div
                      key={event.eventId}
                      className="border border-gray-200 rounded-xl p-4 hover:border-navy-300 hover:shadow-md transition-all"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <h4 className="font-semibold text-navy-900">
                            {event.title}
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">
                            {event.description}
                          </p>
                          <div className="flex flex-wrap gap-3 mt-3 text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3.5 w-3.5" />
                              <span>{formatDate(event.eventDate)}</span>
                            </div>
                            {event.location && (
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3.5 w-3.5" />
                                <span>{event.location}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        {event.registrationLink && (
                          <a
                            href={event.registrationLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-shrink-0 inline-flex items-center gap-1 bg-navy-800 hover:bg-navy-700 text-white text-xs font-medium py-2 px-3 rounded-lg transition-colors"
                          >
                            Register
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Opportunities */}
            {alumni.opportunities && alumni.opportunities.length > 0 && (
              <div className="card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-navy-900 text-lg font-serif flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-gold-500" />
                    Opportunities
                  </h2>
                  <span className="text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    {alumni.totalOpportunities} posted
                  </span>
                </div>
                <div className="space-y-4">
                  {alumni.opportunities.map((opp) => (
                    <div
                      key={opp.opportunityId}
                      className="border border-gray-200 rounded-xl p-4 hover:border-navy-300 hover:shadow-md transition-all"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getTypeBadgeColor(
                                opp.type,
                              )}`}
                            >
                              {opp.type}
                            </span>
                            {opp.company && (
                              <span className="text-xs text-gray-500 flex items-center gap-1">
                                <Building className="h-3 w-3" />
                                {opp.company}
                              </span>
                            )}
                          </div>
                          <h4 className="font-semibold text-navy-900">
                            {opp.title}
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">
                            {opp.description}
                          </p>
                          <div className="flex flex-wrap gap-3 mt-3 text-xs text-gray-500">
                            {opp.location && (
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3.5 w-3.5" />
                                <span>{opp.location}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5" />
                              <span>Posted {formatDate(opp.postedAt)}</span>
                            </div>
                          </div>
                        </div>
                        <button className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gold-500 hover:bg-gold-50 transition-colors">
                          <Bookmark className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {!alumni.skills?.length &&
              !alumni.events?.length &&
              !alumni.opportunities?.length && (
                <div className="card p-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                    <UserPlus className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="font-semibold text-navy-900 text-lg">
                    Profile Incomplete
                  </h3>
                  <p className="text-gray-500 text-sm mt-1">
                    This alumni member hasn't added their skills, events, or
                    opportunities yet.
                  </p>
                  <Link
                    href="/alumni"
                    className="inline-flex items-center gap-1 text-gold-600 font-medium text-sm mt-4 hover:text-gold-700"
                  >
                    Browse other profiles <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
