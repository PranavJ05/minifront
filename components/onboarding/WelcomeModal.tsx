"use client";

import { useEffect, useState } from "react";
import { Loader2, Sparkles, XIcon } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useMyProfileQuery, useUpdateProfileMutation } from "@/hooks/queries/profile";
import { useMarkWelcomeSeenMutation } from "@/hooks/queries/onboarding";
import { isStudent, isFaculty } from "@/lib/roleUtils";

export default function WelcomeModal() {
  const { data: profile, isLoading } = useMyProfileQuery();
  const updateProfile = useUpdateProfileMutation();
  const markSeen = useMarkWelcomeSeenMutation();

  const [open, setOpen] = useState(false);
  const [bio, setBio] = useState("");
  const [phone, setPhone] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [portfolioUrl, setPortfolioUrl] = useState("");

  useEffect(() => {
    if (!profile || isLoading) return;
    if (profile.hasSeenWelcomeModal) {
      setOpen(false);
      return;
    }
    setBio(profile.alumniProfile?.bio || profile.studentProfile?.bio || profile.facultyProfile?.bio || "");
    setPhone(profile.phone || "");
    setGithubUrl(profile.studentProfile?.githubUrl || "");
    setPortfolioUrl(profile.studentProfile?.portfolioUrl || "");
    setOpen(true);
  }, [profile, isLoading]);

  const isSaving = updateProfile.isPending || markSeen.isPending;
  const roles = profile?.roles ?? [];
  const isStudentRole = isStudent(roles);
  const isFacultyRole = isFaculty(roles);

  const handleDismiss = async () => {
    setOpen(false);
    await markSeen.mutateAsync();
  };

  const handleContinue = async () => {
    setOpen(false);
    const payload: Record<string, unknown> = {};
    if (bio.trim()) payload.bio = bio.trim();
    if (phone.trim()) payload.phone = phone.trim();
    if (isStudentRole && githubUrl.trim()) payload.githubUrl = githubUrl.trim();
    if (isStudentRole && portfolioUrl.trim()) payload.portfolioUrl = portfolioUrl.trim();
    if (Object.keys(payload).length > 0) {
      await updateProfile.mutateAsync(payload);
    }
    await markSeen.mutateAsync();
  };

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) handleDismiss(); }}>
      <DialogContent showCloseButton={false} className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <Sparkles className="h-5 w-5" />
            </div>
            <DialogTitle className="text-lg">Welcome to ARC!</DialogTitle>
          </div>
          <p className="text-xs text-muted-foreground">
            Fill in a few details to help others connect with you.
          </p>
        </DialogHeader>

        <div className="space-y-4">
          {!isFacultyRole && (
            <div className="space-y-2">
              <Label htmlFor="welcome-bio">Bio</Label>
              <Textarea
                id="welcome-bio"
                placeholder="Tell us about yourself — your background, interests, and what you do..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                disabled={isSaving}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="welcome-phone">Phone</Label>
            <Input
              id="welcome-phone"
              type="tel"
              placeholder="+91 98765 43210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={isSaving}
            />
          </div>

          {isStudentRole && (
            <>
              <div className="space-y-2">
                <Label htmlFor="welcome-github">GitHub URL</Label>
                <Input
                  id="welcome-github"
                  type="url"
                  placeholder="https://github.com/your_username"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  disabled={isSaving}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="welcome-portfolio">Portfolio URL</Label>
                <Input
                  id="welcome-portfolio"
                  type="url"
                  placeholder="https://your_portfolio.com"
                  value={portfolioUrl}
                  onChange={(e) => setPortfolioUrl(e.target.value)}
                  disabled={isSaving}
                />
              </div>
            </>
          )}
        </div>

        <div className="flex items-center justify-between gap-3 pt-2">
          <Button
            variant="ghost"
            onClick={handleDismiss}
            disabled={isSaving}
            className="cursor-pointer"
          >
            Skip
          </Button>
          <Button
            onClick={handleContinue}
            disabled={isSaving}
            className="cursor-pointer"
          >
            {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
            Continue
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
