// app/alumni/[id]/page.tsx
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft, MapPin, Briefcase, GraduationCap, Linkedin, Globe,
  Mail, MessageSquare, UserPlus, Shield, Calendar, ChevronRight
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { mockAlumni } from '@/lib/mockData';
import { getInitials } from '@/lib/utils';

interface Props {
  params: { id: string };
}

export default function AlumniProfilePage({ params }: Props) {
  const alumni = mockAlumni.find((a) => a.id === params.id);
  if (!alumni) notFound();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back */}
        <Link href="/alumni" className="inline-flex items-center gap-2 text-gray-500 hover:text-navy-800 transition-colors mb-6 font-sans text-sm">
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
                    {alumni.profilePicture ? (
                      <Image src={alumni.profilePicture} alt={alumni.fullName} width={80} height={80} className="object-cover" />
                    ) : (
                      <div className="w-full h-full bg-navy-700 flex items-center justify-center text-white font-bold text-xl">
                        {getInitials(alumni.fullName)}
                      </div>
                    )}
                  </div>
                  {alumni.isOnline && (
                    <span className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
                  )}
                </div>

                <div className="flex items-start justify-between mb-1">
                  <h1 className="font-bold text-navy-900 text-xl font-serif">{alumni.fullName}</h1>
                  <Shield className="h-4 w-4 text-blue-500 flex-shrink-0 mt-1" title="Verified Alumni" />
                </div>
                <p className="text-gold-600 font-medium text-sm mb-1">{alumni.currentRole}</p>
                <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-1">
                  <Briefcase className="h-3.5 w-3.5" />
                  <span>{alumni.currentCompany}</span>
                </div>
                <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-4">
                  <MapPin className="h-3.5 w-3.5" />
                  <span>{alumni.location}</span>
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
                  <p className="text-xs text-gray-400 uppercase tracking-wide">Department</p>
                  <p className="text-sm font-medium text-navy-900">{alumni.department}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide">Class of</p>
                  <p className="text-sm font-medium text-navy-900">{alumni.graduationYear}</p>
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="card p-5">
              <h3 className="font-bold text-navy-900 mb-4">Contact & Social</h3>
              <div className="space-y-3">
                {alumni.linkedin && (
                  <a href={alumni.linkedin} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2.5 text-sm text-blue-700 hover:text-blue-800 transition-colors">
                    <Linkedin className="h-4 w-4" />
                    <span className="truncate">{alumni.linkedin.replace('https://', '')}</span>
                  </a>
                )}
                {alumni.website && (
                  <a href={alumni.website} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2.5 text-sm text-gray-600 hover:text-navy-800 transition-colors">
                    <Globe className="h-4 w-4" />
                    <span className="truncate">{alumni.website.replace('https://', '')}</span>
                  </a>
                )}
                <div className="flex items-center gap-2.5 text-sm text-gray-600">
                  <Mail className="h-4 w-4" />
                  <span className="truncate">{alumni.email}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="lg:col-span-2 space-y-5">
            {/* About */}
            <div className="card p-6">
              <h2 className="font-bold text-navy-900 text-lg mb-3 font-serif">About</h2>
              <p className="text-gray-600 leading-relaxed">{alumni.bio}</p>
            </div>

            {/* Experience */}
            <div className="card p-6">
              <h2 className="font-bold text-navy-900 text-lg mb-5 font-serif flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-gold-500" />
                Work Experience
              </h2>
              <div className="space-y-5">
                {alumni.experience.map((exp, index) => (
                  <div key={exp.id} className="relative">
                    {index < alumni.experience.length - 1 && (
                      <div className="absolute left-4 top-10 bottom-0 w-0.5 bg-gray-100" />
                    )}
                    <div className="flex gap-4">
                      <div className="w-8 h-8 bg-navy-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <Briefcase className="h-4 w-4 text-navy-700" />
                      </div>
                      <div>
                        <h3 className="font-bold text-navy-900">{exp.role}</h3>
                        <p className="text-gold-600 font-medium text-sm">{exp.company}</p>
                        <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {exp.startYear} – {exp.endYear}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {exp.location}
                          </span>
                        </div>
                        {exp.description && <p className="text-gray-500 text-sm mt-2">{exp.description}</p>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Education */}
            <div className="card p-6">
              <h2 className="font-bold text-navy-900 text-lg mb-5 font-serif flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-gold-500" />
                Education
              </h2>
              {alumni.education.map((edu) => (
                <div key={edu.id} className="flex gap-4">
                  <div className="w-10 h-10 bg-navy-800 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-xs">U</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-navy-900">{edu.institution}</h3>
                    <p className="text-gray-600 text-sm">{edu.degree}, {edu.field}</p>
                    <p className="text-gray-400 text-xs mt-1">{edu.startYear} – {edu.endYear}</p>
                    {edu.activities && (
                      <p className="text-gray-500 text-xs mt-1">Activities: {edu.activities}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Skills */}
            <div className="card p-6">
              <h2 className="font-bold text-navy-900 text-lg mb-4 font-serif">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {alumni.skills.map((skill) => (
                  <span key={skill} className="badge bg-navy-50 text-navy-800 border border-navy-100 px-3 py-1.5 text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export async function generateStaticParams() {
  return mockAlumni.map((a) => ({ id: a.id }));
}
