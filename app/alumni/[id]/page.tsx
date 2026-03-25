// app/alumni/[id]/page.tsx
import { notFound } from "next/navigation";
import Link from "next/link";
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
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getInitials } from "@/lib/utils";

interface Props {
  params: { id: string };
}

// Define the shape of the data coming from your Spring Boot backend
interface AlumniDTO {
  id: number;
  name: string;
  email: string;
  batchYear: number;
  department: string;
  placeOfResidence: string;
  profession: string;
  linkedinUrl: string;
}

// Notice the 'async' here! This is a Server Component.
export default async function AlumniProfilePage({ params }: Props) {
  // 1. Fetch real data from your backend
  const res = await fetch(`http://localhost:8080/api/alumni/${params.id}`, {
    // Optional: cache the profile for 60 seconds to reduce DB load
    next: { revalidate: 60 },
  });

  // 2. If the API returns a 404, trigger the Next.js not-found page
  if (!res.ok) {
    notFound();
  }

  const alumni: AlumniDTO = await res.json();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back */}
        <Link
          href="/alumni"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-navy-800 transition-colors mb-6 font-sans text-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Directory
        </Link>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left column */}
          <div className="lg:col-span-1 space-y-4">
            {/* Profile card */}
            <div className="card overflow-hidden">
              <div className="bg-navy-800 h-24 relative" />
              <div className="px-5 pb-5">
                <div className="relative -mt-10 mb-4">
                  <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-md">
                    {/* Since DB doesn't have profile pictures yet, we use initials */}
                    <div className="w-full h-full bg-navy-700 flex items-center justify-center text-white font-bold text-xl">
                      {getInitials(alumni.name)}
                    </div>
                  </div>
                </div>

                <div className="flex items-start justify-between mb-1">
                  <h1 className="font-bold text-navy-900 text-xl font-serif">
                    {alumni.name}
                  </h1>
                  <Shield
                    className="h-4 w-4 text-blue-500 flex-shrink-0 mt-1"
                    aria-label="Verified Alumni"
                  />
                </div>

                <p className="text-gold-600 font-medium text-sm mb-1">
                  {alumni.profession || "Professional"}
                </p>

                <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-4">
                  <MapPin className="h-3.5 w-3.5" />
                  <span>
                    {alumni.placeOfResidence || "Location not specified"}
                  </span>
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 btn-primary flex items-center justify-center gap-1.5 text-sm py-2.5">
                    <UserPlus className="h-4 w-4" />
                    Connect
                  </button>
                  <button className="flex-1 border-2 border-navy-800 text-navy-800 hover:bg-navy-50 font-semibold flex items-center justify-center gap-1.5 text-sm py-2.5 rounded-lg transition-colors">
                    <MessageSquare className="h-4 w-4" />
                    Message
                  </button>
                </div>
              </div>
            </div>

            {/* Academic info */}
            <div className="card p-5">
              <h3 className="font-bold text-navy-900 mb-4 flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-gold-500" />
                Academic Info
              </h3>
              <div className="space-y-2.5">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide">
                    Department
                  </p>
                  <p className="text-sm font-medium text-navy-900">
                    {alumni.department || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide">
                    Class of
                  </p>
                  <p className="text-sm font-medium text-navy-900">
                    {alumni.batchYear || "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="card p-5">
              <h3 className="font-bold text-navy-900 mb-4">Contact & Social</h3>
              <div className="space-y-3">
                {alumni.linkedinUrl && (
                  <a
                    href={alumni.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 text-sm text-blue-700 hover:text-blue-800 transition-colors"
                  >
                    <Linkedin className="h-4 w-4" />
                    <span className="truncate">LinkedIn Profile</span>
                  </a>
                )}
                <div className="flex items-center gap-2.5 text-sm text-gray-600">
                  <Mail className="h-4 w-4" />
                  <span className="truncate">
                    {alumni.email || "No email provided"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="lg:col-span-2 space-y-5">
            {/* About / Summary */}
            <div className="card p-6">
              <h2 className="font-bold text-navy-900 text-lg mb-3 font-serif flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-gold-500" />
                Professional Overview
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {alumni.name} is a graduate of the {alumni.batchYear} batch from
                the {alumni.department} department. They are currently working
                as a {alumni.profession} and are based in{" "}
                {alumni.placeOfResidence}.
              </p>
            </div>

            {/* Note: Experience, Education, and Skills have been removed here
                because that data does not exist in your Alumni database model yet.
                Once you add those tables to your database and update your DTO,
                you can map over them here! */}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
