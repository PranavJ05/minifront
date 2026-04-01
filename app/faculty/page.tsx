"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  GraduationCap,
  Mail,
  MapPin,
  Award,
  BookOpen,
  Building,
  Search,
  Loader2,
  AlertCircle,
  ExternalLink,
  Linkedin,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getInitials } from "@/lib/utils";

const API_BASE = "http://localhost:8080";

interface FacultyMember {
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

export default function FacultyPage() {
  const [faculty, setFaculty] = useState<FacultyMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");

  // Extract unique departments from faculty list
  const departments = useMemo(() => {
    const deptMap = new Map<string, string>();
    faculty.forEach((f) => {
      if (f.departmentCode && f.departmentName) {
        deptMap.set(f.departmentCode, f.departmentName);
      }
    });
    return Array.from(deptMap.entries()).map(([code, name]) => ({
      code,
      name,
    }));
  }, [faculty]);

  // Parsed data for display
  const [parsedFaculty, setParsedFaculty] = useState<
    Array<FacultyMember & { qualifications: any[]; subjectsTaught: string[] }>
  >([]);

  useEffect(() => {
    loadFaculty();
  }, []);

  useEffect(() => {
    filterFaculty();
  }, [selectedDepartment, searchQuery, faculty]);

  async function loadFaculty() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/api/faculty/all`);

      if (!res.ok) {
        throw new Error(`Failed to fetch faculty: ${res.status}`);
      }

      const data: FacultyMember[] = await res.json();
      setFaculty(data);
    } catch (err: any) {
      setError(err.message || "Failed to load faculty");
    } finally {
      setLoading(false);
    }
  }

  function filterFaculty() {
    let filtered = faculty;

    // Filter by department
    if (selectedDepartment) {
      filtered = filtered.filter(
        (f) => f.departmentCode === selectedDepartment,
      );
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (f) =>
          f.fullName.toLowerCase().includes(query) ||
          f.designation.toLowerCase().includes(query) ||
          f.departmentName.toLowerCase().includes(query),
      );
    }

    // Parse JSON fields for filtered results
    const parsed = filtered.map((f) => ({
      ...f,
      qualifications: f.qualifications ? JSON.parse(f.qualifications) : [],
      subjectsTaught: f.subjectsTaught ? JSON.parse(f.subjectsTaught) : [],
    }));

    setParsedFaculty(parsed);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-navy-800 mx-auto mb-4" />
            <p className="text-gray-600">Loading faculty...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <GraduationCap className="h-8 w-8 text-gold-400" />
            <h1 className="font-serif text-3xl font-bold">Our Faculty</h1>
          </div>
          <p className="text-gray-300 text-lg max-w-3xl">
            Meet our distinguished faculty members - experienced educators and
            researchers dedicated to excellence in teaching and innovation.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, designation, or department..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-500"
            />
          </div>

          {/* Department Filter */}
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-500 bg-white cursor-pointer min-w-[200px]"
          >
            <option value="">All Departments</option>
            {departments.map((dept) => (
              <option key={dept.code} value={dept.code}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>

        {/* Results count */}
        <div className="mb-6">
          <p className="text-sm text-gray-600">
            Showing {parsedFaculty.length} of {faculty.length} faculty members
            {selectedDepartment && (
              <span>
                {" "}
                in{" "}
                {departments.find((d) => d.code === selectedDepartment)?.name}
              </span>
            )}
          </p>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            {error}
          </div>
        )}

        {/* Faculty Grid */}
        {parsedFaculty.length === 0 ? (
          <div className="text-center py-16">
            <GraduationCap className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700">
              No faculty found
            </h3>
            <p className="text-gray-500 mt-1">
              {searchQuery || selectedDepartment
                ? "Try adjusting your search or filters"
                : "No faculty members available"}
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {parsedFaculty.map((member) => (
              <article
                key={member.userId}
                className="card overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                {/* Card Header */}
                <div className="bg-gradient-to-r from-navy-950 to-navy-800 h-20 relative" />

                <div className="px-5 pb-5 -mt-10">
                  {/* Profile Image */}
                  <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-md bg-navy-100 mb-4">
                    {member.profileImageUrl ? (
                      <Image
                        src={member.profileImageUrl}
                        alt={member.fullName}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-navy-600 font-bold text-xl">
                        {getInitials(member.fullName)}
                      </div>
                    )}
                  </div>

                  {/* Name & Designation */}
                  <h3 className="font-bold text-navy-900 text-lg">
                    {member.fullName}
                  </h3>
                  <p className="text-gold-600 font-medium text-sm">
                    {member.designation}
                  </p>

                  {/* Department */}
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-2">
                    <Building className="h-3.5 w-3.5" />
                    <span>{member.departmentName}</span>
                  </div>

                  {/* Experience */}
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1">
                    <Award className="h-3.5 w-3.5" />
                    <span>{member.totalExperienceYears} years experience</span>
                  </div>

                  {/* Office Location */}
                  {member.officeLocation && (
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1">
                      <MapPin className="h-3.5 w-3.5" />
                      <span>{member.officeLocation}</span>
                    </div>
                  )}

                  {/* Subjects Taught (preview) */}
                  {member.subjectsTaught.length > 0 && (
                    <div className="mt-3">
                      <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-2">
                        <BookOpen className="h-3.5 w-3.5" />
                        <span>Subjects</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {member.subjectsTaught.slice(0, 3).map((subject, i) => (
                          <span
                            key={i}
                            className="text-xs px-2 py-1 bg-navy-50 text-navy-700 rounded"
                          >
                            {subject}
                          </span>
                        ))}
                        {member.subjectsTaught.length > 3 && (
                          <span className="text-xs text-gray-400">
                            +{member.subjectsTaught.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Qualifications (preview) */}
                  {member.qualifications.length > 0 && (
                    <div className="mt-3">
                      <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-2">
                        <GraduationCap className="h-3.5 w-3.5" />
                        <span>Qualifications</span>
                      </div>
                      <p className="text-xs text-gray-600">
                        {member.qualifications[0].degree} in{" "}
                        {member.qualifications[0].field}
                      </p>
                      <p className="text-xs text-gray-500">
                        {member.qualifications[0].institution}
                      </p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                    <Link
                      href={`/faculty/${member.userId}`}
                      className="flex-1 text-center px-3 py-2 bg-navy-800 text-white text-sm font-medium rounded-lg hover:bg-navy-700 transition-colors"
                    >
                      View Profile
                    </Link>
                    {member.linkedinUrl && (
                      <a
                        href={member.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 text-blue-600 hover:bg-blue-50 transition-colors"
                        title="LinkedIn"
                      >
                        <Linkedin className="h-4 w-4" />
                      </a>
                    )}
                    <a
                      href={`mailto:${member.email}`}
                      className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 text-navy-600 hover:bg-navy-50 transition-colors"
                      title="Email"
                    >
                      <Mail className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
