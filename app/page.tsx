"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  GraduationCap,
  Users,
  Briefcase,
  BookOpen,
  ArrowRight,
  Shield,
  Star,
  Lock,
  Loader2,
  Search,
  CheckCircle2,
  Sparkles,
  ChevronDown,
  Calendar,
  Building2,
  MapPin,
  Award,
  UserCheck,
  MessageSquare,
  Globe,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Footer from "@/components/layout/Footer";
import Logo from "@/components/layout/Logo";
import { mockAlumni, mockJobs, mockEvents, stats, companies } from "@/lib/mockData";
import { getDashboardPathForRoles } from "@/lib/roleUtils";
import { useAuth } from "@/contexts/auth-context";

export default function LandingPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<"directory" | "mentorship" | "jobs" | "events">("directory");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated || !user) {
      const pendingRaw =
        typeof window !== "undefined"
          ? localStorage.getItem("pendingUserData")
          : null;
      if (pendingRaw) {
        router.replace("/auth/pending");
        return;
      }
      return;
    }

    const userRoles = user.roles;
    const dashboardPath = getDashboardPathForRoles(userRoles);
    router.replace(dashboardPath);
  }, [isLoading, isAuthenticated, user, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!isLoading && isAuthenticated && user) {
    return <div className="min-h-screen bg-background" />;
  }

  const faqs = [
    {
      q: "How does account verification work for alumni and students?",
      a: "Upon signing up with your roll number and graduation details, your request is verified against institutional records or reviewed by our designated Batch Administrators for instant approval.",
    },
    {
      q: "Is the platform free for alumni and current students?",
      a: "Yes, 100% free. The platform is managed officially to foster lifelong connection, career mentorship, and institutional growth across all graduating classes.",
    },
    {
      q: "How can I request 1-on-1 mentorship from a senior alumnus?",
      a: "Once logged into your dashboard, browse the Mentorship Hub by industry, role, or company. You can request a session, specify your goal (resume review, interview prep, career transition), and connect directly.",
    },
    {
      q: "Can alumni post job openings and offer internal referrals?",
      a: "Absolutely. Verified alumni can post job openings and mark whether they can offer internal referrals at their current organization, helping current students and fellow graduates fast-track applications.",
    },
    {
      q: "How is my personal contact information protected?",
      a: "Your data privacy is guaranteed. Contact details are never publicly visible to search engines. You control visibility settings within the network and direct messaging stays end-to-end authenticated.",
    },
  ];

  const featuredCompanies = companies.filter((c) => c !== "All Companies");

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary selection:text-primary-foreground">
      {/* ── Public Nav ────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md text-foreground transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-6">
              <Logo href="/" size="sm" shortTextOnMobile />
              <nav className="hidden md:flex items-center gap-5 text-xs font-medium text-muted-foreground">
                <a href="#features" className="hover:text-foreground transition-colors">
                  Features
                </a>
                <a href="#showcase" className="hover:text-foreground transition-colors">
                  Platform
                </a>
                <a href="#spotlight" className="hover:text-foreground transition-colors">
                  Alumni Spotlight
                </a>
                <a href="#faq" className="hover:text-foreground transition-colors">
                  FAQ
                </a>
              </nav>
            </div>

            <div className="flex items-center gap-2">
              <Link href="/auth/login">
                <Button variant="ghost" size="sm" className="cursor-pointer text-xs">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button size="sm" className="cursor-pointer text-xs font-medium gap-1.5">
                  Join Network
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* ── Hero Section ──────────────────────────────────────── */}
        <section className="relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-28">
          {/* SVG Vector Dot Grid Background */}
          <div
            className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30"
            aria-hidden="true"
          />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            {/* Sub-hero Pill Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/60 px-3.5 py-1 text-xs text-muted-foreground hover:bg-muted/80 transition-colors cursor-pointer mb-8">
              <Sparkles className="h-3.5 w-3.5 text-foreground" />
              <span className="font-medium text-foreground">Official Alumni & Career Gateway</span>
              <span className="h-1 w-1 rounded-full bg-muted-foreground/40" />
              <span className="hidden sm:inline">Model Engineering College</span>
              <ArrowRight className="h-3 w-3 text-muted-foreground" />
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground max-w-4xl mx-auto leading-[1.12]">
              Where Engineering Excellence Meets Lifelong Connections.
            </h1>

            {/* Sub-headline */}
            <p className="mt-6 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Uniting 35,000+ verified graduates across global technology, research, finance, and entrepreneurship. Discover mentors, unlock exclusive job referrals, and stay connected.
            </p>

            {/* CTAs */}
            <div className="mt-9 flex flex-wrap gap-3 justify-center items-center">
              <Link href="/auth/signup">
                <Button size="lg" className="cursor-pointer gap-2 font-medium px-6 h-11">
                  Join the Network
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button size="lg" variant="outline" className="cursor-pointer gap-2 px-6 h-11">
                  <Lock className="h-4 w-4 text-muted-foreground" />
                  Member Sign In
                </Button>
              </Link>
            </div>

            {/* Quick Trust Indicators */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-foreground" /> Verified Roll Number Security
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-foreground" /> 1-on-1 Mentorship Matching
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-foreground" /> Direct Alumni Referrals
              </span>
            </div>

            {/* ── Interactive Platform Preview Mockup ───────────── */}
            <div id="showcase" className="mt-14 max-w-5xl mx-auto text-left">
              <div className="bg-card text-card-foreground rounded-2xl border border-border shadow-sm overflow-hidden">
                {/* Fake Window Header */}
                <div className="flex items-center justify-between border-b border-border px-4 py-3 bg-muted/40 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-border" />
                    <span className="h-3 w-3 rounded-full bg-border" />
                    <span className="h-3 w-3 rounded-full bg-border" />
                    <span className="ml-2 font-semibold text-foreground hidden sm:inline">
                      MEC Alumni Platform
                    </span>
                  </div>

                  <div className="flex items-center gap-1 bg-background/60 border border-border px-3 py-1 rounded-md text-[11px] text-muted-foreground w-64 max-w-full truncate">
                    <Search className="h-3 w-3 shrink-0 text-muted-foreground/60" />
                    <span className="truncate">Search alumni, companies, batches...</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="hidden sm:inline font-medium text-foreground">35,000+ Online</span>
                  </div>
                </div>

                {/* Showcase Tabs Controls */}
                <div className="border-b border-border bg-muted/10 px-4 py-2 flex gap-2 overflow-x-auto">
                  {(
                    [
                      { id: "directory", label: "Directory Search", icon: Users },
                      { id: "mentorship", label: "Mentorship Hub", icon: BookOpen },
                      { id: "jobs", label: "Exclusive Referrals", icon: Briefcase },
                      { id: "events", label: "Campus Events", icon: Calendar },
                    ] as const
                  ).map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                        activeTab === tab.id
                          ? "bg-background text-foreground shadow-xs border border-border"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                      }`}
                    >
                      <tab.icon className="h-3.5 w-3.5" />
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Showcase Content Panel */}
                <div className="p-4 sm:p-6 bg-background/50 min-h-[300px]">
                  {activeTab === "directory" && (
                    <div className="space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground pb-2 border-b border-border/40">
                        <span>Showing verified graduates across <b>Google, Tesla, Meta, Spotify</b></span>
                        <Badge variant="outline" className="text-[10px]">Filtered: CSE & ECE</Badge>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-3">
                        {mockAlumni.slice(0, 4).map((alumni) => (
                          <div
                            key={alumni.id}
                            className="p-3.5 rounded-xl border border-border bg-card flex items-start gap-3 hover:border-foreground/30 transition-colors"
                          >
                            <Image
                              src={alumni.profilePicture}
                              alt={alumni.fullName}
                              width={42}
                              height={42}
                              className="rounded-full object-cover ring-1 ring-border"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-1">
                                <h4 className="font-semibold text-xs text-foreground truncate">
                                  {alumni.fullName}
                                </h4>
                                <Badge variant="secondary" className="text-[9px] px-1.5 py-0 h-4">
                                  {alumni.graduationYear}
                                </Badge>
                              </div>
                              <p className="text-[11px] text-muted-foreground font-medium truncate">
                                {alumni.currentRole} &middot; <span className="text-foreground">{alumni.currentCompany}</span>
                              </p>
                              <div className="flex flex-wrap gap-1 mt-2">
                                {alumni.skills.slice(0, 2).map((skill) => (
                                  <span
                                    key={skill}
                                    className="text-[9px] bg-muted text-muted-foreground px-1.5 py-0.5 rounded border border-border/40"
                                  >
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === "mentorship" && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-xs text-muted-foreground pb-2 border-b border-border/40">
                        <span>Connect 1-on-1 for Career Guidance & Interview Prep</span>
                        <Badge variant="secondary" className="text-[10px]">100% Free</Badge>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-3">
                        <div className="p-4 rounded-xl border border-border bg-card space-y-3">
                          <div className="flex items-center gap-3">
                            <Image
                              src={mockAlumni[0].profilePicture}
                              alt={mockAlumni[0].fullName}
                              width={40}
                              height={40}
                              className="rounded-full object-cover"
                            />
                            <div>
                              <p className="font-semibold text-xs text-foreground">{mockAlumni[0].fullName}</p>
                              <p className="text-[11px] text-muted-foreground">{mockAlumni[0].currentRole} @ Google</p>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            &ldquo;Offering mentorship for Product Management transitions, System Design, and Big Tech interviews.&rdquo;
                          </p>
                          <div className="flex items-center justify-between pt-2 border-t border-border/40 text-[11px]">
                            <span className="text-emerald-600 dark:text-emerald-400 font-medium">Available this week</span>
                            <Button size="sm" variant="outline" className="h-7 text-[11px] cursor-pointer">
                              Request Session
                            </Button>
                          </div>
                        </div>

                        <div className="p-4 rounded-xl border border-border bg-card space-y-3">
                          <div className="flex items-center gap-3">
                            <Image
                              src={mockAlumni[4].profilePicture}
                              alt={mockAlumni[4].fullName}
                              width={40}
                              height={40}
                              className="rounded-full object-cover"
                            />
                            <div>
                              <p className="font-semibold text-xs text-foreground">{mockAlumni[4].fullName}</p>
                              <p className="text-[11px] text-muted-foreground">{mockAlumni[4].currentRole} @ Tesla</p>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            &ldquo;Happy to mentor hardware engineers, PCB designers, and EV battery management enthusiasts.&rdquo;
                          </p>
                          <div className="flex items-center justify-between pt-2 border-t border-border/40 text-[11px]">
                            <span className="text-emerald-600 dark:text-emerald-400 font-medium">Available this week</span>
                            <Button size="sm" variant="outline" className="h-7 text-[11px] cursor-pointer">
                              Request Session
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "jobs" && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-xs text-muted-foreground pb-2 border-b border-border/40">
                        <span>Direct Referral Opportunities Posted by Alumni</span>
                        <Badge variant="outline" className="text-[10px]">Verified Referral Badge</Badge>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-3">
                        {mockJobs.slice(0, 4).map((job) => (
                          <div key={job.id} className="p-3.5 rounded-xl border border-border bg-card space-y-2">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <h4 className="font-semibold text-xs text-foreground">{job.title}</h4>
                                <p className="text-[11px] text-muted-foreground font-medium">{job.company} &middot; {job.location}</p>
                              </div>
                              {job.isAlumniOwned ? (
                                <Badge className="text-[9px] px-1.5 py-0">Alumni Founder</Badge>
                              ) : (
                                <Badge variant="secondary" className="text-[9px] px-1.5 py-0">Referral Open</Badge>
                              )}
                            </div>
                            <div className="flex items-center justify-between pt-2 text-[10px] text-muted-foreground border-t border-border/40">
                              <span>Posted {job.postedAt}</span>
                              <span className="font-medium text-foreground flex items-center gap-1">
                                Apply with Referral <ExternalLink className="h-3 w-3" />
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === "events" && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-xs text-muted-foreground pb-2 border-b border-border/40">
                        <span>Reunions, Industry Webinars & Regional Chapter Meetups</span>
                        <Badge variant="secondary" className="text-[10px]">Upcoming Events</Badge>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-3">
                        {mockEvents.slice(0, 2).map((event) => (
                          <div key={event.id} className="p-4 rounded-xl border border-border bg-card space-y-2">
                            <div className="flex items-center justify-between">
                              <Badge variant="outline" className="text-[9px] uppercase tracking-wider">{event.type}</Badge>
                              <span className="text-[11px] text-muted-foreground">{event.date}</span>
                            </div>
                            <h4 className="font-semibold text-xs text-foreground">{event.title}</h4>
                            <p className="text-[11px] text-muted-foreground line-clamp-2">{event.description}</p>
                            <div className="flex items-center justify-between pt-2 border-t border-border/40 text-[11px] text-muted-foreground">
                              <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {event.location}</span>
                              <span className="font-medium text-foreground">{event.attendees} Attending</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Stats & Company Strip ─────────────────────────────── */}
        <section className="py-14 border-y border-border bg-muted/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {[
                { label: "Verified Alumni", value: stats.alumni, sub: "Across 40+ countries" },
                { label: "Partner Companies", value: "450+", sub: "Top global firms" },
                { label: "Active Mentorships", value: stats.mentors, sub: "1-on-1 career guidance" },
                { label: "Annual Events", value: stats.events, sub: "Reunions & Webinars" },
              ].map((item) => (
                <div key={item.label} className="p-4 rounded-xl border border-border/60 bg-card/50">
                  <div className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">{item.value}</div>
                  <div className="text-xs font-semibold text-foreground mt-1">{item.label}</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">{item.sub}</div>
                </div>
              ))}
            </div>

            {/* Corporate Alumni Footprint Ticker */}
            <div className="mt-12 text-center">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-5">
                Our Graduates Lead Engineering & Business At
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 opacity-75">
                {featuredCompanies.map((comp) => (
                  <span
                    key={comp}
                    className="text-xs font-semibold text-muted-foreground border border-border/60 px-3 py-1 rounded-md bg-card/60"
                  >
                    {comp}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Core Capabilities ─────────────────────────────────── */}
        <section id="features" className="py-24 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">
                Built For Students & Alumni
              </p>
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Everything You Need To Build Your Legacy
              </h2>
              <p className="mt-4 text-sm text-muted-foreground max-w-xl mx-auto leading-relaxed">
                Designed to bridge the gap between academic years, connect generations of engineers, and accelerate professional career paths.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: Users,
                  title: "Verified Alumni Directory",
                  desc: "Filter 35,000+ alumni by department, graduation batch, current company, city, or technical skill tags.",
                  badge: "Directory",
                },
                {
                  icon: BookOpen,
                  title: "1-on-1 Mentorship Hub",
                  desc: "Connect directly with senior alumni for mock interviews, resume critiques, and strategic career guidance.",
                  badge: "Mentorship",
                },
                {
                  icon: Briefcase,
                  title: "Exclusive Job Referrals",
                  desc: "Access job listings and internal referral slots posted directly by alumni working at leading global companies.",
                  badge: "Careers",
                },
                {
                  icon: Calendar,
                  title: "Reunions & Global Meetups",
                  desc: "Stay involved through annual chapter reunions, technical webinars, campus hackathons, and department talks.",
                  badge: "Community",
                },
              ].map((item) => (
                <Card
                  key={item.title}
                  className="bg-card text-card-foreground rounded-2xl border border-border shadow-xs hover:border-foreground/30 transition-all p-6 flex flex-col justify-between"
                >
                  <CardContent className="p-0 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="p-2.5 bg-muted rounded-xl text-foreground">
                        <item.icon className="h-5 w-5" />
                      </div>
                      <Badge variant="outline" className="text-[10px] uppercase font-medium">
                        {item.badge}
                      </Badge>
                    </div>

                    <h3 className="font-semibold text-base text-foreground pt-1">{item.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* ── Verified Security & Governance ───────────────────── */}
        <section className="py-20 border-y border-border bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-xs text-muted-foreground">
                  <Shield className="h-3.5 w-3.5 text-foreground" />
                  <span>Institutional Governance</span>
                </div>

                <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                  A Safe, Private & Authenticated Network
                </h2>

                <p className="text-sm text-muted-foreground leading-relaxed">
                  Unlike open social networks, our alumni cell ensures every user is verified against institutional records or approved by designated Batch Administrators.
                </p>

                <div className="space-y-4 pt-2">
                  {[
                    {
                      icon: UserCheck,
                      title: "Roll Number & Batch Verification",
                      desc: "Instant credential matching during signup ensures only genuine alumni and enrolled students gain access.",
                    },
                    {
                      icon: Shield,
                      title: "Role-Based Permissions",
                      desc: "Customized dashboard experiences tailored for Students, Alumni, Faculty, and Admin roles.",
                    },
                    {
                      icon: Award,
                      title: "Verified Alumni Badges",
                      desc: "Distinguished indicators for verified mentors, chapter leads, and alumni business owners.",
                    },
                  ].map((feat) => (
                    <div key={feat.title} className="flex items-start gap-3.5">
                      <div className="p-2 bg-background border border-border rounded-lg text-foreground shrink-0 mt-0.5">
                        <feat.icon className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-foreground">{feat.title}</h4>
                        <p className="text-xs text-muted-foreground mt-0.5">{feat.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Graphic Card */}
              <div className="bg-card text-card-foreground rounded-2xl border border-border p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-4">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-foreground" />
                    <span className="font-semibold text-xs text-foreground">Verification Workflow</span>
                  </div>
                  <Badge variant="secondary" className="text-[10px]">3-Step Protocol</Badge>
                </div>

                <div className="space-y-3">
                  {[
                    { step: "01", title: "Signup with Roll No & Branch", desc: "Enter your official student roll number and graduation year." },
                    { step: "02", title: "Batch Admin Review", desc: "Your batch administrator validates your institutional record." },
                    { step: "03", title: "Full Dashboard Unlocked", desc: "Access global directory, mentorship, jobs, and exclusive events." },
                  ].map((s) => (
                    <div key={s.step} className="p-3.5 rounded-xl border border-border/60 bg-muted/20 flex items-center gap-4">
                      <span className="text-xs font-bold text-foreground bg-muted px-2.5 py-1 rounded-md border border-border">{s.step}</span>
                      <div>
                        <p className="text-xs font-semibold text-foreground">{s.title}</p>
                        <p className="text-[11px] text-muted-foreground">{s.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Alumni Spotlight / Testimonials ───────────────────── */}
        <section id="spotlight" className="py-24 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">
                Voices From The Community
              </p>
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Alumni Stories & Career Impact
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {mockAlumni.slice(0, 3).map((alumni) => (
                <Card
                  key={alumni.id}
                  className="bg-card text-card-foreground rounded-2xl border border-border shadow-xs hover:border-foreground/30 transition-all p-6 flex flex-col justify-between"
                >
                  <CardContent className="p-0 space-y-4">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-3.5 w-3.5 fill-foreground text-foreground" />
                      ))}
                    </div>

                    <p className="text-xs text-muted-foreground italic leading-relaxed">
                      &ldquo;{alumni.bio.length > 140 ? alumni.bio.slice(0, 140) + "…" : alumni.bio}&rdquo;
                    </p>

                    <div className="flex items-center gap-3 pt-4 border-t border-border">
                      <Image
                        src={alumni.profilePicture}
                        alt={alumni.fullName}
                        width={40}
                        height={40}
                        className="rounded-full object-cover ring-1 ring-border"
                      />
                      <div>
                        <p className="font-semibold text-xs text-foreground">{alumni.fullName}</p>
                        <p className="text-[11px] text-muted-foreground">
                          {alumni.currentRole} &middot; <span className="text-foreground">{alumni.currentCompany}</span>
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ Section ───────────────────────────────────────── */}
        <section id="faq" className="py-20 border-t border-border bg-muted/20">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">
                Got Questions?
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, i) => {
                const isOpen = openFaqIndex === i;
                return (
                  <div
                    key={i}
                    className="border border-border bg-card rounded-xl overflow-hidden transition-colors"
                  >
                    <button
                      onClick={() => setOpenFaqIndex(isOpen ? null : i)}
                      className="w-full p-4 text-left flex items-center justify-between gap-4 cursor-pointer"
                    >
                      <span className="text-xs sm:text-sm font-semibold text-foreground">{faq.q}</span>
                      <ChevronDown
                        className={`h-4 w-4 text-muted-foreground shrink-0 transition-transform duration-200 ${
                          isOpen ? "rotate-180 text-foreground" : ""
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 text-xs text-muted-foreground leading-relaxed border-t border-border/40 pt-3">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── CTA Banner ────────────────────────────────────────── */}
        <section className="py-20 bg-background relative overflow-hidden">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
            <div className="bg-card border border-border rounded-3xl p-8 sm:p-12 shadow-sm space-y-6">
              <div className="inline-flex items-center justify-center p-3 bg-muted rounded-2xl">
                <GraduationCap className="h-7 w-7 text-foreground" />
              </div>

              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                Ready to Join Your Alumni Community?
              </h2>

              <p className="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto leading-relaxed">
                Connect with graduates around the world, unlock exclusive mentorship, and stay engaged with your alma mater.
              </p>

              <div className="flex flex-wrap gap-3 justify-center pt-2">
                <Link href="/auth/signup">
                  <Button size="lg" className="cursor-pointer gap-2 font-medium px-6">
                    Create Free Account
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/auth/login">
                  <Button size="lg" variant="outline" className="cursor-pointer gap-2 px-6">
                    Sign In to Dashboard
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
