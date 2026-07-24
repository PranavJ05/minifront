"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  GraduationCap,
  Users,
  BookOpen,
  ArrowRight,
  Shield,
  Lock,
  Loader2,
  Search,
  CheckCircle2,
  Calendar,
  Building2,
  Star,
  ChevronRight,
  Cpu,
  Code2,
  Zap,
  Cog,
  HeartPulse,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Footer from "@/components/layout/Footer";
import Logo from "@/components/layout/Logo";
import { mockAlumni, mockEvents, companies } from "@/lib/mockData";
import { getDashboardPathForRoles } from "@/lib/roleUtils";
import { useAuth } from "@/contexts/auth-context";

export default function LandingPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<"mentorship" | "directory" | "events">("mentorship");

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

  const alumniCompanies = companies.filter((c) => c !== "All Companies");

  const mecDepartments = [
    {
      code: "CSE",
      name: "Computer Science & Engineering",
      icon: Code2,
      topics: ["Software Engineering", "AI & Data Science", "System Design", "Cloud Infrastructure"],
    },
    {
      code: "ECE",
      name: "Electronics & Communication",
      icon: Cpu,
      topics: ["Embedded Systems", "VLSI Design", "Robotics", "Telecommunications"],
    },
    {
      code: "EEE",
      name: "Electrical & Electronics",
      icon: Zap,
      topics: ["Power Electronics", "Renewable Energy", "Automation", "Control Systems"],
    },
    {
      code: "ME",
      name: "Mechanical Engineering",
      icon: Cog,
      topics: ["Automotive & Robotics", "CAD/CAM & FEA", "Thermodynamics", "Manufacturing"],
    },
    {
      code: "BME",
      name: "Biomedical Engineering",
      icon: HeartPulse,
      topics: ["Medical Instrumentation", "Healthcare Tech", "Biomechanics", "Clinical R&D"],
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary selection:text-primary-foreground">
      {/* ── Public Nav ────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md text-foreground transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-6">
              <Logo href="/" size="sm" shortTextOnMobile />
              <nav className="hidden md:flex items-center gap-5 text-xs font-medium text-muted-foreground">
                <a href="#mentorship" className="hover:text-foreground transition-colors">
                  Mentorship
                </a>
                <a href="#directory" className="hover:text-foreground transition-colors">
                  Alumni Directory
                </a>
                <a href="#departments" className="hover:text-foreground transition-colors">
                  Departments
                </a>
                <a href="#companies" className="hover:text-foreground transition-colors">
                  Alumni Placements
                </a>
                <a href="#spotlight" className="hover:text-foreground transition-colors">
                  Testimonials
                </a>
                <a href="#events" className="hover:text-foreground transition-colors">
                  Events & News
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
        <section className="relative overflow-hidden pt-14 pb-16 md:pt-20 md:pb-24">
          {/* SVG Vector Grid Background */}
          <div
            className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30"
            aria-hidden="true"
          />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            {/* Sub-hero Pill Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/60 px-3.5 py-1 text-xs text-muted-foreground hover:bg-muted/80 transition-colors cursor-pointer mb-7">
              <GraduationCap className="h-3.5 w-3.5 text-foreground" />
              <span className="font-semibold text-foreground">Alumni Relations Cell</span>
              <span className="h-1 w-1 rounded-full bg-muted-foreground/40" />
              <span>Model Engineering College</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground max-w-3xl mx-auto leading-[1.12]">
              MEC Network
            </h1>

            {/* Sub-headline */}
            <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              The official network connecting Model Engineering College students and alumni. Access mentorship guidance sessions, find verified graduates, and stay engaged.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap gap-3 justify-center items-center">
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

            {/* Key Focus Points */}
            <div className="mt-9 flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-foreground" /> Mentorship & Career Guidance
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-foreground" /> Verified MEC Graduate Directory
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-foreground" /> Campus Events & Announcements
              </span>
            </div>

            {/* ── Interactive Platform Preview Mockup ───────────── */}
            <div className="mt-12 max-w-4xl mx-auto text-left">
              <div className="bg-card text-card-foreground rounded-2xl border border-border shadow-sm overflow-hidden">
                {/* Fake Window Header */}
                <div className="flex items-center justify-between border-b border-border px-4 py-3 bg-muted/40 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-border" />
                    <span className="h-3 w-3 rounded-full bg-border" />
                    <span className="h-3 w-3 rounded-full bg-border" />
                    <span className="ml-2 font-semibold text-foreground hidden sm:inline">
                      MEC Alumni Portal
                    </span>
                  </div>

                  <div className="flex items-center gap-1 bg-background/60 border border-border px-3 py-1 rounded-md text-[11px] text-muted-foreground w-64 max-w-full truncate">
                    <Search className="h-3 w-3 shrink-0 text-muted-foreground/60" />
                    <span className="truncate">Search by department, batch, or company...</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    <span className="hidden sm:inline font-medium text-foreground">Alumni Cell</span>
                  </div>
                </div>

                {/* Showcase Tabs Controls */}
                <div className="border-b border-border bg-muted/10 px-4 py-2 flex gap-2 overflow-x-auto">
                  {(
                    [
                      { id: "mentorship", label: "Mentorship Guidance", icon: BookOpen },
                      { id: "directory", label: "Alumni Directory", icon: Users },
                      { id: "events", label: "Events & News", icon: Calendar },
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
                <div className="p-4 sm:p-6 bg-background/50 min-h-[260px]">
                  {activeTab === "mentorship" && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-xs text-muted-foreground pb-2 border-b border-border/40">
                        <span>Career Guidance & Technical Mentorship Sessions</span>
                        <Badge variant="outline" className="text-[10px]">Active Sessions</Badge>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-3">
                        <div className="p-3.5 rounded-xl border border-border bg-card space-y-2.5">
                          <div className="flex items-center gap-3">
                            <Image
                              src={mockAlumni[0].profilePicture}
                              alt={mockAlumni[0].fullName}
                              width={38}
                              height={38}
                              className="rounded-full object-cover"
                            />
                            <div>
                              <p className="font-semibold text-xs text-foreground">{mockAlumni[0].fullName}</p>
                              <p className="text-[11px] text-muted-foreground">{mockAlumni[0].currentRole} @ Google</p>
                            </div>
                          </div>
                          <p className="text-[11px] text-muted-foreground line-clamp-2">
                            &ldquo;Available for software engineering guidance, product management roadmaps, and career advice.&rdquo;
                          </p>
                          <div className="flex items-center justify-between pt-2 border-t border-border/40 text-[11px]">
                            <span className="text-xs text-muted-foreground font-medium">CSE Batch 2014</span>
                            <Button size="sm" variant="outline" className="h-7 text-[11px] cursor-pointer">
                              Book Guidance
                            </Button>
                          </div>
                        </div>

                        <div className="p-3.5 rounded-xl border border-border bg-card space-y-2.5">
                          <div className="flex items-center gap-3">
                            <Image
                              src={mockAlumni[4].profilePicture}
                              alt={mockAlumni[4].fullName}
                              width={38}
                              height={38}
                              className="rounded-full object-cover"
                            />
                            <div>
                              <p className="font-semibold text-xs text-foreground">{mockAlumni[4].fullName}</p>
                              <p className="text-[11px] text-muted-foreground">{mockAlumni[4].currentRole} @ Tesla</p>
                            </div>
                          </div>
                          <p className="text-[11px] text-muted-foreground line-clamp-2">
                            &ldquo;Helping electrical and electronics students with embedded hardware, PCB design, and career paths.&rdquo;
                          </p>
                          <div className="flex items-center justify-between pt-2 border-t border-border/40 text-[11px]">
                            <span className="text-xs text-muted-foreground font-medium">EEE Batch 2017</span>
                            <Button size="sm" variant="outline" className="h-7 text-[11px] cursor-pointer">
                              Book Guidance
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "directory" && (
                    <div className="space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground pb-2 border-b border-border/40">
                        <span>Search Graduates Across CSE, ECE, EEE, Mech & Biomedical</span>
                        <Badge variant="outline" className="text-[10px]">Filter by Batch</Badge>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-3">
                        {mockAlumni.slice(0, 4).map((alumni) => (
                          <div
                            key={alumni.id}
                            className="p-3 rounded-xl border border-border bg-card flex items-start gap-3 hover:border-foreground/30 transition-colors"
                          >
                            <Image
                              src={alumni.profilePicture}
                              alt={alumni.fullName}
                              width={38}
                              height={38}
                              className="rounded-full object-cover ring-1 ring-border"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-1">
                                <h4 className="font-semibold text-xs text-foreground truncate">
                                  {alumni.fullName}
                                </h4>
                                <span className="text-[10px] text-muted-foreground">
                                  {alumni.graduationYear}
                                </span>
                              </div>
                              <p className="text-[11px] text-muted-foreground font-medium truncate">
                                {alumni.currentRole} &middot; <span className="text-foreground">{alumni.currentCompany}</span>
                              </p>
                              <p className="text-[10px] text-muted-foreground mt-1">
                                {alumni.department}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === "events" && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-xs text-muted-foreground pb-2 border-b border-border/40">
                        <span>Campus Talks, Webinars & Alumni Cell Announcements</span>
                        <Badge variant="secondary" className="text-[10px]">Recent News</Badge>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-3">
                        {mockEvents.slice(0, 2).map((event) => (
                          <div key={event.id} className="p-3.5 rounded-xl border border-border bg-card space-y-1.5">
                            <div className="flex items-center justify-between">
                              <Badge variant="outline" className="text-[9px] uppercase">{event.type}</Badge>
                              <span className="text-[10px] text-muted-foreground">{event.date}</span>
                            </div>
                            <h4 className="font-semibold text-xs text-foreground">{event.title}</h4>
                            <p className="text-[11px] text-muted-foreground line-clamp-2">{event.description}</p>
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

        {/* ── MEC Graduates Are Working Area ───────────────────── */}
        <section id="companies" className="py-12 border-y border-border bg-muted/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-4">
              MEC Graduates Are Working At Top Engineering & Tech Enterprises
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              {alumniCompanies.map((comp) => (
                <span
                  key={comp}
                  className="text-xs font-medium text-muted-foreground border border-border px-3 py-1.5 rounded-lg bg-card shadow-2xs hover:text-foreground transition-colors"
                >
                  {comp}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ── Core Platform Features ─────────────────────────────── */}
        <section id="mentorship" className="py-20 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">
                What You Can Do
              </p>
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Built For MEC Students & Alumni
              </h2>
              <p className="mt-3 text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed">
                Connect directly with graduates from your department, get guidance from seniors, and participate in campus activities.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: BookOpen,
                  title: "Mentorship & Career Guidance",
                  desc: "Students can request guidance sessions from MEC alumni for career roadmaps, technical domains, and higher studies.",
                },
                {
                  icon: Users,
                  title: "MEC Alumni Directory",
                  desc: "Search graduates across Computer Science, Electronics, Electrical, Mechanical, and Biomedical departments.",
                },
                {
                  icon: Calendar,
                  title: "Events & Campus News",
                  desc: "Stay updated with talk sessions, alumni interactions, webinars, and news published by the Alumni Relations Cell.",
                },
              ].map((item) => (
                <Card
                  key={item.title}
                  className="bg-card text-card-foreground rounded-2xl border border-border shadow-xs hover:border-foreground/30 transition-all p-6 flex flex-col justify-between"
                >
                  <CardContent className="p-0 space-y-3">
                    <div className="p-2.5 bg-muted rounded-xl text-foreground w-fit">
                      <item.icon className="h-5 w-5" />
                    </div>

                    <h3 className="font-semibold text-base text-foreground pt-1">{item.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* ── Department & Branch Guidance Hub ───────────────────── */}
        <section id="departments" className="py-20 border-t border-border bg-muted/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-xs text-muted-foreground mb-3">
                <GraduationCap className="h-3.5 w-3.5 text-foreground" />
                <span>MEC Academic Branches</span>
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Connect By Department & Domain
              </h2>
              <p className="mt-3 text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed">
                Find alumni and mentorship sessions aligned with your specific branch of engineering at Model Engineering College.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mecDepartments.map((dept) => (
                <Card
                  key={dept.code}
                  className="bg-card text-card-foreground rounded-2xl border border-border shadow-xs hover:border-foreground/30 transition-all p-6 flex flex-col justify-between"
                >
                  <CardContent className="p-0 space-y-4">
                    <div className="flex items-center justify-between border-b border-border pb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 bg-muted rounded-lg text-foreground">
                          <dept.icon className="h-4 w-4" />
                        </div>
                        <div>
                          <Badge variant="outline" className="text-[10px] font-bold">
                            {dept.code}
                          </Badge>
                        </div>
                      </div>
                      <span className="text-[11px] text-muted-foreground font-medium">Model Engineering College</span>
                    </div>

                    <h3 className="font-semibold text-sm text-foreground">{dept.name}</h3>

                    <div className="space-y-1.5 pt-1">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                        Key Mentorship Topics:
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {dept.topics.map((t) => (
                          <span
                            key={t}
                            className="text-[10px] bg-muted/60 text-muted-foreground px-2 py-0.5 rounded border border-border/40 font-medium"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* ── Testimonials / Alumni Spotlights ───────────────────── */}
        <section id="spotlight" className="py-20 border-t border-border bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">
                Voices From The Community
              </p>
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Alumni Experiences & Guidance
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
                      &ldquo;{alumni.bio.length > 130 ? alumni.bio.slice(0, 130) + "…" : alumni.bio}&rdquo;
                    </p>

                    <div className="flex items-center gap-3 pt-4 border-t border-border">
                      <Image
                        src={alumni.profilePicture}
                        alt={alumni.fullName}
                        width={40}
                        height={40}
                        className="rounded-full object-cover ring-1 ring-border"
                      />
                      <div className="min-w-0">
                        <p className="font-semibold text-xs text-foreground truncate">{alumni.fullName}</p>
                        <p className="text-[11px] text-muted-foreground truncate">
                          {alumni.currentRole} &middot; <span className="text-foreground">{alumni.currentCompany}</span>
                        </p>
                        <span className="text-[10px] text-muted-foreground">{alumni.department} ({alumni.graduationYear})</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* ── Governance & Access ─────────────────────────────── */}
        <section id="directory" className="py-20 border-t border-border bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-10 items-center">
              <div className="space-y-5">
                <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-xs text-muted-foreground">
                  <Shield className="h-3.5 w-3.5 text-foreground" />
                  <span>Maintained by Alumni Relations Cell</span>
                </div>

                <h2 className="text-3xl font-bold tracking-tight text-foreground">
                  Simple & Verified Access
                </h2>

                <p className="text-sm text-muted-foreground leading-relaxed">
                  Accounts are verified by batch administrators and the Alumni Cell to ensure authentic interactions between MEC students, alumni, and faculty.
                </p>

                <div className="space-y-3 pt-2">
                  {[
                    {
                      title: "Students & Alumni Login",
                      desc: "Log in to browse the directory, request mentorship guidance sessions, or edit your profile.",
                    },
                    {
                      title: "Batch Admin Verification",
                      desc: "Batch representatives help verify student and alumni details for authentic community access.",
                    },
                    {
                      title: "Faculty & Admin Management",
                      desc: "Post department updates, oversee events, and manage alumni cell initiatives.",
                    },
                  ].map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="h-5 w-5 rounded-full bg-muted border border-border flex items-center justify-center text-[10px] font-bold text-foreground shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-foreground">{feat.title}</h4>
                        <p className="text-xs text-muted-foreground mt-0.5">{feat.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Simple Card */}
              <div id="events" className="bg-card text-card-foreground rounded-2xl border border-border p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <span className="font-semibold text-xs text-foreground">Model Engineering College</span>
                  <Badge variant="outline" className="text-[10px]">Alumni Cell</Badge>
                </div>

                <div className="space-y-3 text-xs text-muted-foreground leading-relaxed">
                  <p>
                    The Alumni Relations Cell facilitates direct interaction between current students and graduates. Whether you are looking for project guidance, mentorship sessions, or reconnecting with classmates, MEC Network provides a structured portal for our college community.
                  </p>
                </div>

                <div className="pt-2 border-t border-border flex items-center justify-between">
                  <span className="text-xs font-medium text-foreground">Ready to get started?</span>
                  <Link href="/auth/signup">
                    <Button size="sm" className="cursor-pointer text-xs gap-1">
                      Register Now <ChevronRight className="h-3 w-3" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA Banner ────────────────────────────────────────── */}
        <section className="py-16 bg-muted/20 border-t border-border">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="bg-card border border-border rounded-2xl p-8 shadow-sm space-y-5">
              <div className="inline-flex items-center justify-center p-2.5 bg-muted rounded-xl">
                <GraduationCap className="h-6 w-6 text-foreground" />
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                Join the MEC Network
              </h2>

              <p className="text-xs sm:text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed">
                Connect with fellow students and alumni of Model Engineering College. Request mentorship guidance sessions and stay engaged.
              </p>

              <div className="flex flex-wrap gap-3 justify-center pt-1">
                <Link href="/auth/signup">
                  <Button size="lg" className="cursor-pointer gap-2 font-medium px-6 h-10 text-xs">
                    Create Account
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/auth/login">
                  <Button size="lg" variant="outline" className="cursor-pointer gap-2 px-6 h-10 text-xs">
                    Member Sign In
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
