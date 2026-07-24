"use client";

import Link from "next/link";
import { GraduationCap, Users, ArrowRight, Briefcase } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function NetworkHubPage() {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Hero Header */}
      <div className="space-y-3 text-center max-w-2xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          MEC Community Network
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Connect with alumni across industries, discover placement opportunities, and reach out to faculty.
        </p>
        
      </div>

      {/* Hero Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        {/* Alumni Card */}
        <Card className="group relative overflow-hidden border-border/60 hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-md">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />
          <CardContent className="p-6 flex flex-col justify-between h-full gap-4">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20 group-hover:scale-105 transition-transform">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                  Alumni Directory
                </h2>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Browse MEC alumni by batch, branch, company, or location.
                </p>
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
        <Card className="group relative overflow-hidden border-border/60 hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-md">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />
          <CardContent className="p-6 flex flex-col justify-between h-full gap-4">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20 group-hover:scale-105 transition-transform">
                <Users className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                  Faculty Directory
                </h2>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Find professors and staff by department, designation, and specialisation.
                </p>
              </div>
            </div>

            <Link href="/network/faculty">
              <Button className="w-full justify-between cursor-pointer">
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
