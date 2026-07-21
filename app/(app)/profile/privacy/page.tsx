"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Shield, Eye, GraduationCap, Users, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  useAlumniPrivacyQuery,
  useUpdateAlumniPrivacyMutation,
} from "@/hooks/queries/privacy";
import { isCurrentAlumni } from "@/lib/auth";
import { getErrorMessage } from "@/lib/get-error-message";

export default function ProfilePrivacyPage() {
  const router = useRouter();
  const isAlumniUser = isCurrentAlumni();

  const { data: privacySettings, isLoading } = useAlumniPrivacyQuery({
    enabled: isAlumniUser,
  });
  const updateMutation = useUpdateAlumniPrivacyMutation();

  useEffect(() => {
    if (!isAlumniUser) {
      router.replace("/profile");
    }
  }, [isAlumniUser, router]);

  const handleToggle = async (
    key: keyof import("@/lib/types/privacy").AlumniPrivacySettings,
    currentValue: boolean
  ) => {
    try {
      await updateMutation.mutateAsync({ [key]: !currentValue });
      toast.success("Privacy preferences updated");
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "Failed to update privacy settings"));
    }
  };

  if (isLoading || !privacySettings) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const studentToggles = [
    {
      key: "showEmailToStudents" as const,
      title: "Show Email Address to Students",
      desc: "Allow enrolled students to view your email for academic & mentorship queries.",
    },
    {
      key: "showLinkedinToStudents" as const,
      title: "Show LinkedIn Profile to Students",
      desc: "Display your LinkedIn link to students viewing your profile.",
    },
    {
      key: "showCompanyToStudents" as const,
      title: "Show Profession & Company to Students",
      desc: "Allow students to view your current job title and employer.",
    },
    {
      key: "showLocationToStudents" as const,
      title: "Show Location to Students",
      desc: "Allow students to view your city/state on directory maps.",
    },
  ];

  const alumniToggles = [
    {
      key: "showEmailToAlumni" as const,
      title: "Show Email Address to Fellow Alumni",
      desc: "Allow verified alumni to view your email address.",
    },
    {
      key: "showLinkedinToAlumni" as const,
      title: "Show LinkedIn Profile to Fellow Alumni",
      desc: "Display your LinkedIn profile link to other graduates.",
    },
    {
      key: "showCompanyToAlumni" as const,
      title: "Show Profession & Company to Fellow Alumni",
      desc: "Allow fellow alumni to view your current company and title.",
    },
    {
      key: "showLocationToAlumni" as const,
      title: "Show Location to Fellow Alumni",
      desc: "Include your location on global alumni map directories.",
    },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Link
            href="/profile"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-1"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Profile
          </Link>
          <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" /> Privacy & Information Visibility
          </h1>
          <p className="text-xs text-muted-foreground">
            Control what contact & career information is visible to students and fellow alumni.
          </p>
        </div>
      </div>

      {/* Visibility to Students */}
      <Card className="border-border">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-primary" />
            <CardTitle className="text-sm font-semibold">Visibility to Enrolled Students</CardTitle>
          </div>
          <CardDescription className="text-xs">
            Configure default settings for what students see when browsing your profile in the directory.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {studentToggles.map(({ key, title, desc }) => (
            <div
              key={key}
              className="flex items-center justify-between gap-4 p-3 rounded-lg bg-muted/20 border border-border/40"
            >
              <div className="space-y-0.5">
                <p className="text-xs font-semibold text-foreground">{title}</p>
                <p className="text-[11px] text-muted-foreground">{desc}</p>
              </div>
              <Switch
                checked={privacySettings[key]}
                onCheckedChange={() => handleToggle(key, privacySettings[key])}
                disabled={updateMutation.isPending}
                className="cursor-pointer"
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Visibility to Fellow Alumni */}
      <Card className="border-border">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            <CardTitle className="text-sm font-semibold">Visibility to Verified Alumni</CardTitle>
          </div>
          <CardDescription className="text-xs">
            Configure visibility settings for fellow graduates across the alumni network.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {alumniToggles.map(({ key, title, desc }) => (
            <div
              key={key}
              className="flex items-center justify-between gap-4 p-3 rounded-lg bg-muted/20 border border-border/40"
            >
              <div className="space-y-0.5">
                <p className="text-xs font-semibold text-foreground">{title}</p>
                <p className="text-[11px] text-muted-foreground">{desc}</p>
              </div>
              <Switch
                checked={privacySettings[key]}
                onCheckedChange={() => handleToggle(key, privacySettings[key])}
                disabled={updateMutation.isPending}
                className="cursor-pointer"
              />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
