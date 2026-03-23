'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Users, Briefcase, Calendar, BookOpen, ArrowRight, Search, Star, MapPin } from 'lucide-react';
import DashboardSidebar from '@/components/layout/DashboardSidebar';
import { mockAlumni, mockJobs, mockEvents } from '@/lib/mockData';

export default function StudentDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // 1. Check for the JWT token
    const token = localStorage.getItem('token');
    // 2. Check for the stored user context
    const stored = localStorage.getItem('alumni_user');
    
    // Redirect if either is missing
    if (!token || !stored) { 
      router.push('/auth/login'); 
      return; 
    }
    
    const u = JSON.parse(stored);
    
    // Ensure the role matches
    if (u.role.toLowerCase() !== 'student') { 
      router.push('/auth/login'); 
      return; 
    }
    
    setUser(u);
  }, [router]);

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-navy-800 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar role="student" userName={user.fullName} userEmail={user.email} />
      {/* ... Rest of your Dashboard layout code remains unchanged ... */}
      <main className="flex-1 overflow-auto p-6">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-serif text-2xl font-bold text-navy-900">Welcome, {user.fullName.split(' ')[0]}! 👋</h1>
            <p className="text-gray-500">Find mentors, jobs, and connections to kickstart your career.</p>
          </div>
          
           {/* Quick search */}
          <div className="card p-5 mb-6 bg-navy-950">
            <h2 className="text-white font-bold mb-3">Find an Alumni Mentor</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, company, or field..."
                className="w-full pl-10 pr-4 py-3 bg-navy-800 border border-navy-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gold-500"
              />
            </div>
            <Link href="/alumni" className="inline-flex items-center gap-2 mt-3 text-gold-400 text-sm hover:text-gold-300">
              Browse full directory <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Alumni Mentors', value: '500+', icon: BookOpen, color: 'text-purple-600', bg: 'bg-purple-50' },
              { label: 'Job Openings', value: '452', icon: Briefcase, color: 'text-green-600', bg: 'bg-green-50' },
              { label: 'Upcoming Events', value: '8', icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-50' },
              { label: 'My Connections', value: '12', icon: Users, color: 'text-gold-600', bg: 'bg-gold-50' },
            ].map(({ label, value, icon: Icon, color, bg }) => (
              <div key={label} className="card p-5 text-center">
                <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                  <Icon className={`h-5 w-5 ${color}`} />
                </div>
                <div className="text-2xl font-bold text-navy-900 font-serif">{value}</div>
                <div className="text-xs text-gray-500 mt-0.5">{label}</div>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Recommended mentors */}
            <div className="card p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-navy-900 font-serif">Recommended Mentors</h2>
                <Link href="/alumni" className="text-xs text-gold-600 font-medium">View All</Link>
              </div>
              <div className="space-y-3">
                {mockAlumni.slice(0, 3).map((alumni) => (
                  <div key={alumni.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <Image src={alumni.profilePicture} alt={alumni.fullName} width={40} height={40} className="rounded-full object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-navy-900 text-sm">{alumni.fullName}</p>
                      <p className="text-xs text-gray-500 truncate">{alumni.currentRole} · {alumni.currentCompany}</p>
                    </div>
                    <button className="text-xs bg-navy-800 text-white px-3 py-1.5 rounded-lg hover:bg-navy-700 transition-colors flex-shrink-0">
                      Connect
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Job opportunities */}
            <div className="card p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-navy-900 font-serif">For You — Jobs</h2>
                <Link href="/dashboard/student/jobs" className="text-xs text-gold-600 font-medium">View All</Link>
              </div>
              <div className="space-y-3">
                {mockJobs.slice(0, 3).map((job) => (
                  <div key={job.id} className="p-3 border border-gray-100 rounded-lg hover:border-navy-200 hover:bg-gray-50 transition-all">
                    <div className="flex items-start justify-between mb-1">
                      <div>
                        <p className="font-semibold text-navy-900 text-sm">{job.title}</p>
                        <p className="text-xs text-gray-500">{job.company}</p>
                      </div>
                      {job.isAlumniOwned && (
                        <span className="badge bg-gold-100 text-gold-700 text-xs flex items-center gap-1">
                          <Star className="h-2.5 w-2.5" /> Alumni
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <MapPin className="h-3 w-3" />
                      <span>{job.location}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Upcoming events */}
          <div className="card p-5 mt-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-navy-900 font-serif">Events You Might Like</h2>
              <Link href="/events" className="text-xs text-gold-600 font-medium">See All</Link>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {mockEvents.slice(0, 2).map((event) => (
                <div key={event.id} className="flex gap-3 p-3 border border-gray-100 rounded-lg">
                  <div className="bg-navy-900 text-white text-center px-2 py-1.5 rounded-lg flex-shrink-0 w-12">
                    <span className="block text-xs text-gray-400">OCT</span>
                    <span className="font-bold text-lg leading-tight">{event.date.split(' ')[1].replace(',', '')}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-navy-900 text-sm">{event.title}</p>
                    <p className="text-xs text-gray-400">{event.location}</p>
                    <button className="mt-2 text-xs text-gold-600 font-medium">RSVP →</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        
        </div>
      </main>
    </div>
  );
}










