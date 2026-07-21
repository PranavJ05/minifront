"use client";

import Link from "next/link";
import { GraduationCap, Users, ArrowRight, ShieldCheck, Search, Briefcase } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function NetworkHubPage() {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Hero Header */}
      <div className="space-y-3 text-center max-w-2xl mx-auto">
        <Badge variant="secondary" className="text-xs px-3 py-1 font-medium">
          <Users className="h-3.5 w-3.5 mr-1 text-primary" /> Institutional Directory Hub
        </Badge>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          MEC Community Network
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Connect with verified alumni across industries, discover career placement opportunities, and reach out to institute faculty members.
        </p>
      </div>

      {/* Hero Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        {/* Alumni Card */}
        <Card variant="default" className="group relative overflow-hidden border-border/60 hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-md">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />
          <CardContent className="p-8 flex flex-col justify-between h-full space-y-6">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20 group-hover:scale-105 transition-transform">
                <GraduationCap className="h-6 w-6" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                    Alumni Directory
                  </h2>
                  <Badge variant="outline" className="text-[11px] font-normal">
                    Verified Graduates
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Browse and connect with Model Engineering College alumni worldwide. Search by batch, branch, company, and location.
                </p>
              </div>

              <div className="space-y-2 pt-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-3.5 w-3.5 text-primary" /> Privacy-controlled contact details
                </div>
                <div className="flex items-center gap-2">
                  <Briefcase className="h-3.5 w-3.5 text-primary" /> Career mentorship & placement referrals
                </div>
              </div>
            </div>

            <Link href="/network/alumni">
              <Button className="w-full justify-between cursor-pointer group-hover:bg-primary">
                <span>Browse Alumni</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Faculty Card */}
        <Card variant="default" className="group relative overflow-hidden border-border/60 hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-md">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />
          <CardContent className="p-8 flex flex-col justify-between h-full space-y-6">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20 group-hover:scale-105 transition-transform">
                <Users className="h-6 w-6" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                    Faculty Directory
                  </h2>
                  <Badge variant="outline" className="text-[11px] font-normal">
                    Academic Staff
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Connect with department professors, lab instructors, and academic staff across computer science, electronics, and engineering disciplines.
                </p>
              </div>

              <div className="space-y-2 pt-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Search className="h-3.5 w-3.5 text-primary" /> Filter by department & designation
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-3.5 w-3.5 text-primary" /> Direct official email communication
                </div>
              </div>
            </div>

            <Link href="/network/faculty">
              <Button variant="outline" className="w-full justify-between cursor-pointer group-hover:border-primary">
                <span>Browse Faculty</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
