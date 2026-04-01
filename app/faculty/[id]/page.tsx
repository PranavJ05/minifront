"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  GraduationCap,
  Mail,
  MapPin,
  Award,
  BookOpen,
  Building,
  Loader2,
  AlertCircle,
  ExternalLink,
  Linkedin,
  Clock,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getInitials } from "@/lib/utils";

const API_BASE = "http://localhost:8080";

interface Qualification {
  degree: string;
  field: string;
  institution: string;
  year: number;
}

interface FacultyProfile {
  userId: number;
  name: string;
  email: string;
  profileImageUrl: string | null;
  fullName: string;
  designation: string;
  departmentCode: string;
  departmentName: string;
  officeLocation: string | null;
  qualifications: string; // JSON string
  subjectsTaught: string; // JSON string
  linkedinUrl: string | null;
  googleScholarUrl: string | null;
  totalExperienceYears: number;
  joinDate: string;
  bio: string | null;
}

export default function FacultyProfilePage() {
  const params = useParams();
  const facultyId = params.id as string;

  const [profile, setProfile] = useState<FacultyProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Parsed data
  const [qualifications, setQualifications] = useState<Qualification[]>([]);
  const [subjectsTaught, setSubjectsTaught] = useState<string[]>([]);

  useEffect(() => {
    loadProfile();
  }, [facultyId]);

  // Parse JSON fields when profile loads
  useEffect(() => {
    if (profile) {
      try {
        if (profile.qualifications) {
          setQualifications(JSON.parse(profile.qualifications));
        }
        if (profile.subjectsTaught) {
          setSubjectsTaught(JSON.parse(profile.subjectsTaught));
        }
      } catch (err) {
        console.error("Failed to parse JSON fields:", err);
      }
    }
  }, [profile]);

  async function loadProfile() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/api/faculty/profile/${facultyId}`);

      if (!res.ok) {
        if (res.status === 404) {
          throw new Error("Faculty profile not found");
        }
        throw new Error(`Failed to load profile: ${res.status}`);
      }

      const data: FacultyProfile = await res.json();
      setProfile(data);
    } catch (err: any) {
      setError(err.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  }

  const profileImageSrc = profile?.profileImageUrl;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-navy-800 mx-auto mb-4" />
            <p className="text-gray-600">Loading profile...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-3xl mx-auto px-4 py-16">
          <div className="text-center">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-navy-900 mb-2">
              Profile Not Found
            </h2>
            <p className="text-gray-600 mb-6">
              {error || "The faculty profile you're looking for doesn't exist."}
            </p>
            <Link
              href="/faculty"
              className="inline-flex items-center gap-2 px-6 py-3 bg-navy-800 text-white rounded-lg hover:bg-navy-700 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Faculty
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800 text-white py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back */}
          <Link
            href="/faculty"
            className="inline-flex items-center gap-2 text-gray-300 hover:text-white transition-colors mb-6 text-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Faculty
          </Link>

          <div className="flex flex-col md:flex-row items-start gap-6">
            {/* Profile Image */}
            <div className="flex-shrink-0">
              <div className="w-32 h-32 rounded-2xl overflow-hidden border-4 border-white/20 shadow-2xl bg-white/10">
                {profileImageSrc ? (
                  <Image
                    src={profileImageSrc}
                    alt={profile.fullName}
                    width={128}
                    height={128}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white font-bold text-4xl">
                    {getInitials(profile.fullName)}
                  </div>
                )}
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold font-serif mb-2">
                {profile.fullName}
              </h1>
              <p className="text-gold-400 font-medium text-lg mb-3">
                {profile.designation}
              </p>

              <div className="flex flex-wrap gap-4 text-sm text-gray-300 mb-4">
                {profile.departmentName && (
                  <div className="flex items-center gap-1.5">
                    <Building className="h-4 w-4" />
                    <span>{profile.departmentName}</span>
                  </div>
                )}
                {profile.officeLocation && (
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" />
                    <span>{profile.officeLocation}</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5">
                  <Award className="h-4 w-4" />
                  <span>{profile.totalExperienceYears} years experience</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                {profile.linkedinUrl && (
                  <a
                    href={profile.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-[#0077b5] hover:bg-[#006097] text-white font-semibold py-2.5 px-5 rounded-lg transition-colors"
                  >
                    <Linkedin className="h-4 w-4" />
                    LinkedIn
                  </a>
                )}
                {profile.googleScholarUrl && (
                  <a
                    href={profile.googleScholarUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-600 text-white font-semibold py-2.5 px-5 rounded-lg transition-colors"
                  >
                    <Award className="h-4 w-4" />
                    Google Scholar
                  </a>
                )}
                <a
                  href={`mailto:${profile.email}`}
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold py-2.5 px-5 rounded-lg transition-colors border border-white/20"
                >
                  <Mail className="h-4 w-4" />
                  Email
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Contact & Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Contact Information */}
            <div className="card p-5">
              <h3 className="font-bold text-navy-900 mb-4 flex items-center gap-2">
                <Mail className="h-5 w-5 text-gold-500" />
                Contact Information
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide">
                    Email
                  </p>
                  <a
                    href={`mailto:${profile.email}`}
                    className="font-medium text-navy-900 text-sm hover:text-navy-700"
                  >
                    {profile.email}
                  </a>
                </div>
                {profile.officeLocation && (
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide">
                      Office Location
                    </p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <MapPin className="h-4 w-4 text-navy-600" />
                      <p className="font-medium text-navy-900 text-sm">
                        {profile.officeLocation}
                      </p>
                    </div>
                  </div>
                )}
                {profile.joinDate && (
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide">
                      Join Date
                    </p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <Clock className="h-4 w-4 text-navy-600" />
                      <p className="font-medium text-navy-900 text-sm">
                        {new Date(profile.joinDate).toLocaleDateString("en-IN", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="card p-5">
              <h3 className="font-bold text-navy-900 mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Experience</span>
                  <span className="font-semibold text-navy-900">
                    {profile.totalExperienceYears} years
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Subjects</span>
                  <span className="font-semibold text-navy-900">
                    {subjectsTaught.length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Qualifications</span>
                  <span className="font-semibold text-navy-900">
                    {qualifications.length}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Bio */}
            {profile.bio && (
              <div className="card p-6">
                <h3 className="font-bold text-navy-900 mb-3">About</h3>
                <p className="text-gray-700 leading-relaxed">{profile.bio}</p>
              </div>
            )}

            {/* Qualifications */}
            <div className="card p-6">
              <h3 className="font-bold text-navy-900 mb-4 flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-gold-500" />
                Qualifications
              </h3>
              {qualifications.length === 0 ? (
                <p className="text-gray-500 text-sm">
                  No qualifications added yet.
                </p>
              ) : (
                <div className="space-y-4">
                  {qualifications.map((qual, index) => (
                    <div
                      key={index}
                      className="border-l-2 border-navy-200 pl-4"
                    >
                      <div className="flex items-center gap-2">
                        <Award className="h-4 w-4 text-gold-500" />
                        <h4 className="font-semibold text-navy-900">
                          {qual.degree}
                        </h4>
                      </div>
                      <p className="text-sm text-gray-600">{qual.field}</p>
                      <p className="text-sm text-gray-500">
                        {qual.institution} • {qual.year}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Subjects Taught */}
            <div className="card p-6">
              <h3 className="font-bold text-navy-900 mb-4 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-gold-500" />
                Subjects Taught
              </h3>
              {subjectsTaught.length === 0 ? (
                <p className="text-gray-500 text-sm">
                  No subjects added yet.
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {subjectsTaught.map((subject, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-navy-50 text-navy-700 border border-navy-200"
                    >
                      {subject}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
