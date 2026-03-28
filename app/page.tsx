'use client';

// app/page.tsx
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  GraduationCap, Users, Briefcase, BookOpen,
  ArrowRight, Shield, Star, ChevronRight, Quote, Lock
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { mockAlumni, stats } from '@/lib/mockData';
import { getDashboardPath } from '@/lib/utils';

/**
 * LandingPage component
 *
 * A landing page for the alumni website, featuring a hero section, a why join section, a testimonials section, and a locked content CTA section.
 *
 * @returns {JSX.Element} The LandingPage component
 */
export default function LandingPage() {
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('alumni_user');

    if (!token || !storedUser) {
      setIsCheckingAuth(false);
      return;
    }

    try {
      const user = JSON.parse(storedUser);
      const rawRole = typeof user?.role === 'string' ? user.role.toLowerCase() : '';
      const normalizedRole = rawRole === 'batch_admin' ? 'alumni' : rawRole;
      const dashboardPath = getDashboardPath(normalizedRole);

      if (dashboardPath !== '/') {
        router.replace(dashboardPath);
        return;
      }
    } catch (error) {
      console.error('Failed to parse stored user:', error);
      localStorage.removeItem('alumni_user');
    }

    setIsCheckingAuth(false);
  }, [router]);

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-2 border-navy-800 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-navy-950 min-h-[92vh] flex items-center">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-24 left-10 w-72 h-72 bg-gold-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-16 right-10 w-96 h-96 bg-navy-700/40 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 grid lg:grid-cols-2 gap-16 items-center">
          <div className="text-white">
            <div className="inline-flex items-center gap-2 bg-gold-500/15 border border-gold-500/25 rounded-full px-4 py-1.5 mb-7">
              <GraduationCap className="h-4 w-4 text-gold-400" />
              <span className="text-gold-400 text-sm font-medium tracking-wide">
                Official University Alumni Platform
              </span>
            </div>

            <h1 className="font-serif text-5xl lg:text-6xl font-bold leading-[1.1] mb-6">
              Your Journey<br />
              Doesn't End at<br />
              <span className="gradient-text">Graduation.</span>
            </h1>

            <p className="text-gray-300 text-lg leading-relaxed mb-4 max-w-lg">
              Thousands of graduates are already growing careers, mentoring
              the next generation, and giving back all through one platform.
            </p>
            <p className="text-gold-400 font-medium mb-10 max-w-lg">
              Your network is waiting. Are you in?
            </p>

            <div className="flex flex-wrap gap-4">
              <Link href="/auth/signup" className="btn-gold flex items-center gap-2 text-base px-8 py-4">
                Join the Network
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/auth/login"
                className="flex items-center gap-2 border-2 border-white/25 text-white hover:bg-white/10 font-semibold px-8 py-4 rounded-lg transition-all duration-200"
              >
                <Lock className="h-4 w-4" />
                Member Login
              </Link>
            </div>

            <div className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-6 pt-10 border-t border-white/10">
              {[
                { label: 'Alumni', value: stats.alumni },
                { label: 'Jobs Posted', value: stats.jobs },
                { label: 'Events/Year', value: stats.events },
                { label: 'Mentors', value: stats.mentors },
              ].map(({ label, value }) => (
                <div key={label}>
                  <div className="text-2xl font-bold text-gold-400 font-serif">{value}</div>
                  <div className="text-gray-400 text-sm mt-0.5">{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Floating alumni cards */}
          <div className="hidden lg:grid grid-cols-2 gap-4">
            {mockAlumni.slice(0, 4).map((alumni, i) => (
              <div
                key={alumni.id}
                className={`bg-navy-800/70 backdrop-blur rounded-xl p-4 border border-navy-700/40 ${i % 2 === 1 ? 'translate-y-5' : ''}`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <Image
                    src={alumni.profilePicture}
                    alt={alumni.fullName}
                    width={38}
                    height={38}
                    className="rounded-full object-cover ring-2 ring-gold-500/40"
                  />
                  <div>
                    <p className="text-white text-xs font-semibold">{alumni.fullName.split(' ')[0]}</p>
                    <p className="text-gray-400 text-xs">{alumni.currentCompany}</p>
                  </div>
                </div>
                <p className="text-gray-300 text-xs">{alumni.currentRole}</p>
                <span className="inline-block mt-2 text-xs text-gold-400 bg-gold-500/10 px-2 py-0.5 rounded-full">
                  {alumni.department}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Join ─────────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-gold-600 font-semibold text-sm uppercase tracking-widest mb-3">
              Why Alumni Log In Every Day
            </p>
            <h2 className="section-title mb-4">Everything You Need,<br />In One Place</h2>
            <p className="text-gray-500 max-w-xl mx-auto leading-relaxed">
              Behind the login, a world of exclusive opportunities, connections,
              and resources built specifically for our graduates.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Users,
                title: 'Global Alumni Directory',
                desc: 'Search and connect with 35,000+ verified graduates across every industry, country, and graduating class.',
                color: 'bg-blue-50 text-blue-600',
                cta: 'Browse Profiles',
              },
              {
                icon: Briefcase,
                title: 'Exclusive Opportunities',
                desc: 'Jobs, internships, and freelance gigs posted directly by alumni-led companies and top recruiters not available anywhere else.',
                color: 'bg-green-50 text-green-600',
                cta: 'Explore Jobs',
              },
              {
                icon: BookOpen,
                title: 'Mentorship Hub',
                desc: "Get 1-on-1 guidance from senior alumni in your field. Whether you're job hunting or scaling a startup, someone's been there.",
                color: 'bg-purple-50 text-purple-600',
                cta: 'Find a Mentor',
              },
            ].map((item) => (
              <div key={item.title} className="card p-8 group hover:-translate-y-1 transition-all duration-300">
                <div className={`w-14 h-14 rounded-2xl ${item.color} flex items-center justify-center mb-6`}>
                  <item.icon className="h-7 w-7" />
                </div>
                <h3 className="font-bold text-navy-900 text-xl mb-3 font-serif">{item.title}</h3>
                <p className="text-gray-500 leading-relaxed mb-5 text-sm">{item.desc}</p>
                <div className="flex items-center text-gold-600 font-semibold text-sm gap-1 group-hover:gap-2 transition-all">
                  {item.cta} <ChevronRight className="h-4 w-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────── */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-gold-600 font-semibold text-sm uppercase tracking-widest mb-3">
              Hear It From Them
            </p>
            <h2 className="section-title">Alumni Who Came Back<br />Never Looked Back</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {mockAlumni.slice(0, 3).map((alumni) => (
              <div key={alumni.id} className="card p-7 hover:-translate-y-1 transition-all duration-300">
                <div className="flex items-center gap-1 mb-5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-gold-400 text-gold-400" />
                  ))}
                </div>
                <div className="flex items-start gap-2 mb-6">
                  <Quote className="h-5 w-5 text-gold-400 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-600 text-sm italic leading-relaxed">
                    {alumni.bio.length > 120 ? alumni.bio.slice(0, 120) + '…' : alumni.bio}
                  </p>
                </div>
                <div className="flex items-center gap-3 pt-5 border-t border-gray-100">
                  <Image
                    src={alumni.profilePicture}
                    alt={alumni.fullName}
                    width={40}
                    height={40}
                    className="rounded-full object-cover ring-2 ring-gold-400/30"
                  />
                  <div>
                    <p className="font-bold text-navy-900 text-sm">{alumni.fullName}</p>
                    <p className="text-gold-600 text-xs">{alumni.currentRole} · {alumni.currentCompany}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Locked content CTA ───────────────────────────────── */}
      <section className="py-24 bg-navy-950 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gold-500/15 rounded-2xl mb-6">
            <Lock className="h-8 w-8 text-gold-400" />
          </div>
          <h2 className="font-serif text-4xl font-bold text-white mb-5">
            Exclusive Content Awaits<br />
            <span className="gradient-text">Behind Your Login</span>
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-4 leading-relaxed">
            Campus updates, department news, faculty announcements, and alumni
            achievements all exclusively for verified members.
          </p>
          <p className="text-gold-400 font-medium mb-10">
            Create your account in 2 minutes. Start connecting today.
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/auth/signup" className="btn-gold flex items-center gap-2 px-8 py-4 text-base">
              <GraduationCap className="h-5 w-5" />
              Create Free Account
            </Link>
            <Link
              href="/auth/login"
              className="border-2 border-white/20 text-white hover:bg-white/10 font-semibold px-8 py-4 rounded-lg transition-colors flex items-center gap-2"
            >
              Already a Member? Sign In
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-gray-500 text-sm">
            <span className="flex items-center gap-1.5">
              <Shield className="h-4 w-4 text-gold-500" /> Verified members only
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="h-4 w-4 text-gold-500" /> 35,000+ active alumni
            </span>
            <span className="flex items-center gap-1.5">
              <Star className="h-4 w-4 text-gold-500" /> Free to join
            </span>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
