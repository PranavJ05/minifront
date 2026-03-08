'use client';
// app/dashboard/alumni/page.tsx
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  Bell, Users, Briefcase, Calendar, TrendingUp, MessageSquare,
  UserCheck, BookOpen, Star, ArrowRight, Eye
} from 'lucide-react';
import DashboardSidebar from '@/components/layout/DashboardSidebar';
import { mockEvents, mockJobs, mockAlumni } from '@/lib/mockData';

export default function AlumniDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem('alumni_user');
    if (!stored) { router.push('/auth/login'); return; }
    const u = JSON.parse(stored);
    if (u.role !== 'alumni') { router.push('/auth/login'); return; }
    setUser(u);
  }, [router]);

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-navy-800 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const recentActivity = [
    { user: 'Dr. Sarah Chen', action: 'posted a new research update in', target: 'Faculty News', time: '3H AGO', avatar: mockAlumni[2].profilePicture },
    { user: 'Mark Davis', action: 'started a new position as Director of Product at', target: 'Google', time: '5H AGO', avatar: mockAlumni[1].profilePicture },
    { user: 'Alumni Relations', action: 'announced the start of the', target: 'Annual Giving Campaign', time: 'YESTERDAY', avatar: null },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar role="alumni" userName={user.fullName} userEmail={user.email} />

      <main className="flex-1 overflow-auto">
        <div className="p-6 max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-gray-500 text-sm font-sans">GOOD MORNING</p>
              <h1 className="font-serif text-2xl font-bold text-navy-900">{user.fullName}</h1>
            </div>
            <button className="relative p-2 text-gray-400 hover:text-navy-800 transition-colors">
              <Bell className="h-6 w-6" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-gold-500 rounded-full" />
            </button>
          </div>

          {/* Pending requests banner */}
          <div className="bg-navy-800 text-white rounded-xl p-4 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gold-500/20 p-2 rounded-lg">
                <UserCheck className="h-5 w-5 text-gold-400" />
              </div>
              <div>
                <p className="font-semibold">3 Pending Requests</p>
                <p className="text-gray-400 text-sm">Mentees waiting for review</p>
              </div>
            </div>
            <button className="bg-gold-500 text-navy-950 text-sm font-bold px-4 py-2 rounded-lg hover:bg-gold-400 transition-colors">
              View All
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-6 border-b border-gray-200 mb-6">
            {['Feed', 'Reunions', 'Opportunities'].map((tab, i) => (
              <button key={tab} className={`pb-3 text-sm font-medium border-b-2 transition-colors ${i === 0 ? 'border-navy-800 text-navy-900' : 'border-transparent text-gray-500'}`}>
                {tab}
              </button>
            ))}
          </div>

          {/* Upcoming Events */}
          <section className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-navy-900 font-serif">Upcoming Events</h2>
              <Link href="/events" className="text-sm text-gold-600 font-medium hover:text-gold-700 flex items-center gap-1">
                SEE ALL <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {mockEvents.slice(0, 2).map((event) => (
                <div key={event.id} className="card overflow-hidden">
                  <div className="relative">
                    {event.image && (
                      <Image src={event.image} alt={event.title} width={400} height={150} className="object-cover w-full h-32" />
                    )}
                    <div className="absolute top-2 left-2 bg-navy-900/90 text-white px-2 py-1 rounded-lg text-xs font-bold">
                      {event.date.split(' ').slice(0, 2).join(' ')}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-navy-900 text-sm mb-1">{event.title}</h3>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> {event.location}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Suggested Job */}
          <section className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-navy-900 font-serif">Suggested for You</h2>
            </div>
            <div className="card p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-navy-800 rounded-lg flex items-center justify-center">
                    <Briefcase className="h-5 w-5 text-gold-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-navy-900">Senior UX Designer</h3>
                      <span className="badge bg-green-100 text-green-700">New Posting</span>
                    </div>
                    <p className="text-gray-500 text-sm">Adobe · Remote</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                <span className="flex items-center gap-1"><TrendingUp className="h-3.5 w-3.5" /> $140k - $180k</span>
                <span className="flex items-center gap-1"><Star className="h-3.5 w-3.5" /> Full-time</span>
              </div>
              <button className="w-full btn-primary">Apply Now</button>
            </div>
          </section>

          {/* Recent Activity */}
          <section>
            <h2 className="font-bold text-navy-900 font-serif mb-4">Recent Activity</h2>
            <div className="space-y-3">
              {recentActivity.map((item, i) => (
                <div key={i} className="card p-4 flex items-start gap-3">
                  {item.avatar ? (
                    <Image src={item.avatar} alt={item.user} width={36} height={36} className="rounded-full object-cover flex-shrink-0" />
                  ) : (
                    <div className="w-9 h-9 bg-gold-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Star className="h-4 w-4 text-gold-600" />
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold text-navy-900">{item.user}</span>{' '}
                      {item.action}{' '}
                      <span className="text-gold-600 font-medium">{item.target}</span>
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">{item.time}</p>
                    {i === 1 && (
                      <div className="flex gap-2 mt-2">
                        <button className="text-xs border border-gray-200 px-3 py-1 rounded-lg hover:bg-gray-50 flex items-center gap-1">
                          👏 Congrats
                        </button>
                        <button className="text-xs border border-gray-200 px-3 py-1 rounded-lg hover:bg-gray-50 flex items-center gap-1">
                          <MessageSquare className="h-3 w-3" /> Message
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
