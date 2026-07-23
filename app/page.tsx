"use client";

import { useEffect } from "react";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Footer from "@/components/layout/Footer";
import Logo from "@/components/layout/Logo";
import { mockAlumni, stats } from "@/lib/mockData";
import { getDashboardPathForRoles } from "@/lib/roleUtils";
import { useAuth } from "@/contexts/auth-context";

export default function LandingPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();

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

  return (
    <div className="min-h-screen bg-background">
      {/* Public Nav */}
      <div className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md text-foreground">
        <div className="w-full px-4 sm:px-6">
          <div className="flex items-center justify-between h-14">
            <Logo href="/" size="sm" shortTextOnMobile />
            <div className="flex items-center gap-2">
              <Link href="/auth/login">
                <Button variant="ghost" size="sm" className="cursor-pointer">
                  Login
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button size="sm" className="cursor-pointer">
                  Join Network
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary via-primary/95 to-primary min-h-[92vh] flex items-center">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-24 left-10 w-72 h-72 bg-primary-foreground/5 rounded-full blur-3xl" />
          <div className="absolute bottom-16 right-10 w-96 h-96 bg-foreground/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 grid lg:grid-cols-2 gap-16 items-center">
          <div className="text-primary-foreground">
            <div className="inline-flex items-center gap-2 bg-primary-foreground/10 border border-primary-foreground/20 rounded-full px-4 py-1.5 mb-7">
              <GraduationCap className="h-4 w-4 text-primary-foreground/80" />
              <span className="text-primary-foreground/80 text-sm font-medium tracking-wide">
                Official University Alumni Platform
              </span>
            </div>

            <h1 className="text-5xl lg:text-6xl font-bold leading-[1.1] mb-6">
              Your Journey
              <br />
              Doesn&apos;t End at
              <br />
              <span className="text-primary-foreground/90">Graduation.</span>
            </h1>

            <p className="text-primary-foreground/70 text-lg leading-relaxed mb-4 max-w-lg">
              Thousands of graduates are already growing careers, mentoring the
              next generation, and giving back all through one platform.
            </p>
            <p className="text-primary-foreground/80 font-medium mb-10 max-w-lg">
              Your network is waiting. Are you in?
            </p>

            <div className="flex flex-wrap gap-4">
              <Link href="/auth/signup">
                <Button
                  size="lg"
                  variant="secondary"
                  className="cursor-pointer gap-2"
                >
                  Join the Network
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button
                  size="lg"
                  className="cursor-pointer bg-transparent border border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 gap-2 shadow-none"
                >
                  <Lock className="h-4 w-4" />
                  Member Login
                </Button>
              </Link>
            </div>

            <div className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-6 pt-10 border-t border-primary-foreground/10">
              {[
                { label: "Alumni", value: stats.alumni },
                { label: "Jobs Posted", value: stats.jobs },
                { label: "Events/Year", value: stats.events },
                { label: "Mentors", value: stats.mentors },
              ].map(({ label, value }) => (
                <div key={label}>
                  <div className="text-2xl font-bold text-primary-foreground">
                    {value}
                  </div>
                  <div className="text-primary-foreground/60 text-sm mt-0.5">
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Floating alumni cards */}
          <div className="hidden lg:grid grid-cols-2 gap-4">
            {mockAlumni.slice(0, 4).map((alumni, i) => (
              <div
                key={alumni.id}
                className={`bg-primary-foreground/10 backdrop-blur rounded-xl p-4 border border-primary-foreground/20 text-primary-foreground ${i % 2 === 1 ? "translate-y-5" : ""}`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <Image
                    src={alumni.profilePicture}
                    alt={alumni.fullName}
                    width={38}
                    height={38}
                    className="rounded-full object-cover ring-2 ring-primary-foreground/20"
                  />
                  <div>
                    <p className="text-primary-foreground text-xs font-semibold">
                      {alumni.fullName.split(" ")[0]}
                    </p>
                    <p className="text-primary-foreground/60 text-xs">
                      {alumni.currentCompany}
                    </p>
                  </div>
                </div>
                <p className="text-primary-foreground/70 text-xs">
                  {alumni.currentRole}
                </p>
                <span className="inline-block mt-2 text-[10px] font-medium text-primary-foreground/80 bg-primary-foreground/10 px-2 py-0.5 rounded-full">
                  {alumni.department}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Join ─────────────────────────────────────────── */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">
              Why Alumni Log In Every Day
            </p>
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Everything You Need,
              <br />
              In One Place
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed">
              Behind the login, a world of exclusive opportunities, connections,
              and resources built specifically for our graduates.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Users,
                title: "Global Alumni Directory",
                desc: "Search and connect with verified graduates across every industry, country, and graduating class.",
              },
              {
                icon: Briefcase,
                title: "Exclusive Opportunities",
                desc: "Jobs, internships, and freelance gigs posted directly by alumni-led companies and top recruiters not available anywhere else.",
              },
              {
                icon: BookOpen,
                title: "Mentorship Hub",
                desc: "Get 1-on-1 guidance from senior alumni in your field. Whether you're job hunting or scaling a startup, someone's been there.",
              },
            ].map((item) => (
              <Card
                key={item.title}
                className="group hover:shadow-md transition-all duration-300"
              >
                <CardContent className="p-8 space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                    <item.icon className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="font-semibold text-lg text-foreground">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.desc}
                  </p>
                  <div className="flex items-center text-sm font-medium text-foreground gap-1 group-hover:gap-2 transition-all pt-2">
                    Learn more <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────── */}
      <section className="py-24 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">
              Hear It From Them
            </p>
            <h2 className="text-3xl font-bold text-foreground">
              Alumni Who Came Back
              <br />
              Never Looked Back
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {mockAlumni.slice(0, 3).map((alumni) => (
              <Card
                key={alumni.id}
                className="hover:shadow-md transition-all duration-300"
              >
                <CardContent className="p-7 space-y-5">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-primary text-primary"
                      />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground italic leading-relaxed">
                    &ldquo;{alumni.bio.length > 120
                      ? alumni.bio.slice(0, 120) + "…"
                      : alumni.bio}&rdquo;
                  </p>
                  <div className="flex items-center gap-3 pt-4 border-t border-border">
                    <Image
                      src={alumni.profilePicture}
                      alt={alumni.fullName}
                      width={40}
                      height={40}
                      className="rounded-full object-cover ring-2 ring-primary/20"
                    />
                    <div>
                      <p className="font-semibold text-sm text-foreground">
                        {alumni.fullName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {alumni.currentRole} &middot; {alumni.currentCompany}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── Locked content CTA ───────────────────────────────── */}
      <section className="py-24 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary-foreground/5 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-foreground/10 rounded-2xl mb-6">
            <Lock className="h-8 w-8 text-primary-foreground/80" />
          </div>
          <h2 className="text-4xl font-bold text-primary-foreground mb-5">
            Exclusive Content Awaits
            <br />
            <span className="text-primary-foreground/90">Behind Your Login</span>
          </h2>
          <p className="text-primary-foreground/70 text-lg max-w-2xl mx-auto mb-4 leading-relaxed">
            Campus updates, department news, faculty announcements, and alumni
            achievements all exclusively for verified members.
          </p>
          <p className="text-primary-foreground/80 font-medium mb-10">
            Create your account in 2 minutes. Start connecting today.
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/auth/signup">
              <Button
                size="lg"
                variant="secondary"
                className="cursor-pointer gap-2"
              >
                <GraduationCap className="h-5 w-5" />
                Create Free Account
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button
                size="lg"
                className="cursor-pointer bg-transparent border border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 gap-2 shadow-none"
              >
                Already a Member? Sign In
              </Button>
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-primary-foreground/60">
            <span className="flex items-center gap-1.5">
              <Shield className="h-4 w-4 text-primary-foreground/80" /> Verified members only
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="h-4 w-4 text-primary-foreground/80" /> Active alumni network
            </span>
            <span className="flex items-center gap-1.5">
              <Star className="h-4 w-4 text-primary-foreground/80" /> Free to join
            </span>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
