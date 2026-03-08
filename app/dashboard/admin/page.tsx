'use client';
// app/dashboard/admin/page.tsx
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Users, Briefcase, Calendar, TrendingUp, AlertCircle, CheckCircle, UserPlus, Eye, BarChart3 } from 'lucide-react';
import DashboardSidebar from '@/components/layout/DashboardSidebar';
import { mockAlumni } from '@/lib/mockData';
import Image from 'next/image';

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem('alumni_user');
    if (!stored) { router.push('/auth/login'); return; }
    const u = JSON.parse(stored);
    if (u.role !== 'admin') { router.push('/auth/login'); return; }
    setUser(u);
  }, [router]);

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-navy-800 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const statsData = [
    { label: 'Total Alumni', value: '35,247', change: '+5%', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Active Jobs', value: '1,204', change: '+12%', icon: Briefcase, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Upcoming Events', value: '23', change: '+3', icon: Calendar, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'New This Month', value: '847', change: '+18%', icon: TrendingUp, color: 'text-gold-600', bg: 'bg-gold-50' },
  ];

  const pendingUsers = [
    { name: 'Rahul Mehta', email: 'rahul.m@email.com', role: 'alumni', dept: 'Computer Science', year: '2022', time: '2h ago' },
    { name: 'Priya Singh', email: 'priya.s@email.com', role: 'student', dept: 'MBA', year: '2026', time: '4h ago' },
    { name: 'James Brown', email: 'james.b@email.com', role: 'alumni', dept: 'Law', year: '2018', time: '1d ago' },
  ];

  const recentActivity = [
    { type: 'success', msg: 'Event "Tech Alumni Mixer" was published', time: '1h ago' },
    { type: 'warning', msg: '5 new job postings awaiting approval', time: '3h ago' },
    { type: 'success', msg: 'Annual Giving Campaign email sent to 35k+', time: '6h ago' },
    { type: 'info', msg: '23 new alumni registered this week', time: '1d ago' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar role="admin" userName={user.fullName} userEmail={user.email} />

      <main className="flex-1 overflow-auto p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-serif text-2xl font-bold text-navy-900">Admin Dashboard</h1>
            <p className="text-gray-500">Platform overview and management</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {statsData.map(({ label, value, change, icon: Icon, color, bg }) => (
              <div key={label} className="card p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center`}>
                    <Icon className={`h-5 w-5 ${color}`} />
                  </div>
                  <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">{change}</span>
                </div>
                <div className="text-2xl font-bold text-navy-900 font-serif">{value}</div>
                <div className="text-xs text-gray-500 mt-1">{label}</div>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Pending approvals */}
            <div className="lg:col-span-2 card p-5">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold text-navy-900 font-serif flex items-center gap-2">
                  <UserPlus className="h-5 w-5 text-gold-500" />
                  Pending Approvals
                  <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-0.5 rounded-full ml-1">{pendingUsers.length}</span>
                </h2>
                <button className="text-xs text-gold-600 font-medium">View All</button>
              </div>
              <div className="space-y-3">
                {pendingUsers.map((u, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <div className="w-10 h-10 bg-navy-800 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {u.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-navy-900 text-sm">{u.name}</p>
                        <span className={`badge text-xs ${u.role === 'alumni' ? 'bg-gold-100 text-gold-700' : 'bg-blue-100 text-blue-700'}`}>
                          {u.role}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 truncate">{u.email} · {u.dept} · {u.year}</p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                        <CheckCircle className="h-4 w-4" />
                      </button>
                      <button className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <AlertCircle className="h-4 w-4" />
                      </button>
                      <button className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors">
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Activity log */}
            <div className="card p-5">
              <h2 className="font-bold text-navy-900 font-serif mb-5 flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-gold-500" />
                Recent Activity
              </h2>
              <div className="space-y-4">
                {recentActivity.map((item, i) => (
                  <div key={i} className="flex gap-3">
                    <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                      item.type === 'success' ? 'bg-green-500' :
                      item.type === 'warning' ? 'bg-amber-500' : 'bg-blue-500'
                    }`} />
                    <div>
                      <p className="text-sm text-gray-700">{item.msg}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent alumni */}
          <div className="card p-5 mt-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-navy-900 font-serif">Recent Alumni Registrations</h2>
              <button className="btn-outline text-sm py-2 px-4">Manage All</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs text-gray-400 uppercase tracking-wide border-b border-gray-100">
                    <th className="pb-3 pr-4">Member</th>
                    <th className="pb-3 pr-4">Department</th>
                    <th className="pb-3 pr-4">Company</th>
                    <th className="pb-3 pr-4">Location</th>
                    <th className="pb-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {mockAlumni.slice(0, 5).map((alumni) => (
                    <tr key={alumni.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-3">
                          <Image src={alumni.profilePicture} alt={alumni.fullName} width={32} height={32} className="rounded-full object-cover" />
                          <div>
                            <p className="font-semibold text-navy-900 text-sm">{alumni.fullName}</p>
                            <p className="text-xs text-gray-400">{alumni.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 pr-4 text-sm text-gray-600">{alumni.department}</td>
                      <td className="py-3 pr-4 text-sm text-gray-600">{alumni.currentCompany}</td>
                      <td className="py-3 pr-4 text-sm text-gray-500">{alumni.location}</td>
                      <td className="py-3">
                        <div className="flex gap-2">
                          <button className="text-xs text-navy-700 hover:text-navy-900 font-medium">View</button>
                          <button className="text-xs text-red-500 hover:text-red-700 font-medium">Remove</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
