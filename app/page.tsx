// app/page.tsx
import Link from 'next/link';
import Image from 'next/image';
import {
  GraduationCap, Users, Briefcase, Calendar, ArrowRight,
  Shield, Star, ChevronRight, Quote, TrendingUp, BookOpen
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { mockAlumni, mockEvents, mockNews, stats } from '@/lib/mockData';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-navy-950 min-h-[600px] flex items-center">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 bg-gold-500 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-navy-700 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-white">
            <div className="inline-flex items-center gap-2 bg-gold-500/20 border border-gold-500/30 rounded-full px-4 py-1.5 mb-6">
              <GraduationCap className="h-4 w-4 text-gold-400" />
              <span className="text-gold-400 text-sm font-medium">Official University Alumni Platform</span>
            </div>
            <h1 className="font-serif text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Connect, Grow,<br />
              and <span className="gradient-text">Give Back</span>
            </h1>
            <p className="text-gray-300 text-lg leading-relaxed mb-8 max-w-lg">
              The official platform for university alumni to network, mentor, and find career opportunities across the globe.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/auth/signup" className="btn-gold flex items-center gap-2">
                Join the Network
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/auth/login" className="flex items-center gap-2 border-2 border-white/30 text-white hover:bg-white/10 font-semibold px-6 py-3 rounded-lg transition-all duration-200">
                Member Login
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-6">
              {[
                { label: 'Alumni', value: stats.alumni, icon: Users },
                { label: 'Jobs', value: stats.jobs, icon: Briefcase },
                { label: 'Events', value: stats.events, icon: Calendar },
                { label: 'Mentors', value: stats.mentors, icon: BookOpen },
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} className="text-center">
                  <div className="text-2xl font-bold text-gold-400 font-serif">{value}</div>
                  <div className="text-gray-400 text-sm mt-0.5">{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Hero image / card display */}
          <div className="hidden lg:block relative">
            <div className="grid grid-cols-2 gap-4">
              {mockAlumni.slice(0, 4).map((alumni, i) => (
                <div
                  key={alumni.id}
                  className={`bg-navy-800/80 backdrop-blur rounded-xl p-4 border border-navy-700/50 ${i === 1 || i === 2 ? 'translate-y-4' : ''}`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Image
                      src={alumni.profilePicture}
                      alt={alumni.fullName}
                      width={36}
                      height={36}
                      className="rounded-full object-cover"
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
        </div>
      </section>

      {/* Core Pillars */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="section-title mb-4">Core Pillars</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">Everything you need to stay connected and grow professionally within our alumni community.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Users,
                title: 'Global Directory',
                desc: 'Expand your professional network worldwide. Connect with 35,000+ alumni across every industry and continent.',
                href: '/alumni',
                color: 'bg-blue-50 text-blue-700',
              },
              {
                icon: Briefcase,
                title: 'Exclusive Job Board',
                desc: 'Opportunities curated for our community. From top companies to alumni-owned startups.',
                href: '/dashboard/alumni',
                color: 'bg-green-50 text-green-700',
              },
              {
                icon: BookOpen,
                title: 'Mentorship Hub',
                desc: 'Guide the next generation of leaders. Share expertise and fast-track careers through 1-on-1 mentorship.',
                href: '/dashboard/alumni',
                color: 'bg-purple-50 text-purple-700',
              },
            ].map((pillar) => (
              <Link key={pillar.title} href={pillar.href} className="group card p-8 hover:-translate-y-1 transition-all duration-300">
                <div className={`w-14 h-14 rounded-xl ${pillar.color} flex items-center justify-center mb-6`}>
                  <pillar.icon className="h-7 w-7" />
                </div>
                <h3 className="font-bold text-navy-900 text-xl mb-3 font-serif">{pillar.title}</h3>
                <p className="text-gray-500 leading-relaxed mb-4">{pillar.desc}</p>
                <div className="flex items-center text-gold-600 font-semibold text-sm group-hover:gap-2 gap-1 transition-all">
                  Learn more <ChevronRight className="h-4 w-4" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Alumni */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="section-title mb-2">Featured Alumni</h2>
              <p className="text-gray-500">Inspiring stories from our community</p>
            </div>
            <Link href="/alumni" className="hidden sm:flex items-center gap-1.5 text-navy-700 font-semibold hover:text-gold-600 transition-colors">
              View Directory <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {mockAlumni.slice(0, 3).map((alumni) => (
              <Link href={`/alumni/${alumni.id}`} key={alumni.id} className="card group overflow-hidden hover:-translate-y-1 transition-all duration-300">
                <div className="bg-navy-800 p-6 relative">
                  <div className="flex items-center gap-4">
                    <Image
                      src={alumni.profilePicture}
                      alt={alumni.fullName}
                      width={56}
                      height={56}
                      className="rounded-full object-cover border-2 border-gold-500"
                    />
                    <div>
                      <h3 className="text-white font-bold">{alumni.fullName}</h3>
                      <p className="text-gold-400 text-sm">{alumni.currentRole}</p>
                      <p className="text-gray-400 text-xs">{alumni.currentCompany}</p>
                    </div>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-start gap-2 mb-4">
                    <Quote className="h-4 w-4 text-gold-500 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-600 text-sm italic leading-relaxed line-clamp-3">{alumni.bio}</p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="badge bg-navy-50 text-navy-700">Class of {alumni.graduationYear}</span>
                    <span className="badge bg-gray-100 text-gray-600">{alumni.department}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="section-title mb-2">Upcoming Events</h2>
              <p className="text-gray-500">Reunions, webinars, and networking opportunities</p>
            </div>
            <Link href="/events" className="hidden sm:flex items-center gap-1.5 text-navy-700 font-semibold hover:text-gold-600 transition-colors">
              All Events <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockEvents.slice(0, 3).map((event) => (
              <div key={event.id} className="card overflow-hidden hover:-translate-y-1 transition-all duration-300">
                {event.image && (
                  <div className="h-44 overflow-hidden relative">
                    <Image src={event.image} alt={event.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    {event.isFeatured && (
                      <span className="absolute top-3 right-3 bg-gold-500 text-navy-950 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                        <Star className="h-3 w-3" /> Featured
                      </span>
                    )}
                  </div>
                )}
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`badge ${event.type === 'webinar' ? 'bg-blue-100 text-blue-700' : event.type === 'reunion' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'} capitalize`}>
                      {event.type}
                    </span>
                    {event.isOnline && <span className="badge bg-gray-100 text-gray-600">Online</span>}
                  </div>
                  <h3 className="font-bold text-navy-900 mb-2">{event.title}</h3>
                  <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-1">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{event.date} · {event.time}</span>
                  </div>
                  <p className="text-xs text-gray-400 mb-4">{event.location}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{event.attendees} attending</span>
                    <button className="btn-primary text-xs py-2 px-4">RSVP</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* News */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="section-title mb-2">News & Announcements</h2>
              <p className="text-gray-500">Stay updated with our alumni community</p>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {mockNews.map((news) => (
              <article key={news.id} className="card overflow-hidden hover:-translate-y-1 transition-all duration-300">
                {news.image && (
                  <div className="h-48 overflow-hidden">
                    <Image src={news.image} alt={news.title} width={400} height={192} className="object-cover w-full h-full hover:scale-105 transition-transform duration-500" />
                  </div>
                )}
                <div className="p-5">
                  <span className="badge bg-gold-100 text-gold-700 mb-3">{news.category}</span>
                  <h3 className="font-bold text-navy-900 mb-2 hover:text-navy-700">{news.title}</h3>
                  <p className="text-gray-500 text-sm mb-4 line-clamp-2">{news.excerpt}</p>
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>{news.author}</span>
                    <span>{news.date}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-20 bg-navy-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Quote className="h-10 w-10 text-gold-500 mx-auto mb-6" />
          <blockquote className="text-2xl md:text-3xl text-white font-serif italic leading-relaxed mb-8">
            "The mentorship program gave me my first break. Now, I hire directly from the network."
          </blockquote>
          <div className="flex items-center justify-center gap-4">
            <Image
              src={mockAlumni[0].profilePicture}
              alt="Sarah Jenkins"
              width={48}
              height={48}
              className="rounded-full object-cover border-2 border-gold-500"
            />
            <div className="text-left">
              <p className="text-white font-bold">Sarah Jenkins, Class of '14</p>
              <p className="text-gold-400 text-sm">VP of Engineering at TechCorp</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-gold-600 to-gold-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-navy-950 font-serif mb-4">
            Ready to Join Your Alumni Community?
          </h2>
          <p className="text-navy-800 text-lg mb-8 max-w-2xl mx-auto">
            Connect with thousands of successful graduates who are shaping the world. Your network is your net worth.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/auth/signup" className="bg-navy-950 text-white font-bold px-8 py-4 rounded-lg hover:bg-navy-800 transition-colors flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Join Alumni Network
            </Link>
            <Link href="/auth/login" className="bg-white/20 hover:bg-white/30 text-navy-950 font-bold px-8 py-4 rounded-lg transition-colors">
              Member Login
            </Link>
          </div>
          <div className="mt-8 flex items-center justify-center gap-2 text-navy-800">
            <Shield className="h-4 w-4" />
            <span className="text-sm">Verified University Platform · Access restricted to students, alumni, and faculty</span>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
