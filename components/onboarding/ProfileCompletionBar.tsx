"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { X, ArrowRight, ListChecks } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMyProfileQuery } from "@/hooks/queries/profile";

const DISMISS_KEY = "profile_bar_dismissed";

export default function ProfileCompletionBar() {
  const { data: profile, isLoading } = useMyProfileQuery();
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = sessionStorage.getItem(DISMISS_KEY);
    if (stored) setDismissed(true);
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    try {
      sessionStorage.setItem(DISMISS_KEY, Date.now().toString());
    } catch {}
  };

  if (isLoading || !profile || dismissed) return null;

  const { profileCompletion, missingFields } = profile;

  if (profileCompletion >= 100) return null;

  const topMissing = missingFields.slice(0, 2);
  const barText = topMissing.length > 0
    ? `Add your ${topMissing.join(" and ")}`
    : "Complete your profile";

  return (
    <div className="border-b border-border bg-muted/30">
      <div className="flex items-center gap-3 px-6 py-2.5 text-xs text-muted-foreground">
        <ListChecks className="h-4 w-4 shrink-0 text-primary" />

        <div className="flex-1 flex items-center gap-3 min-w-0">
          <span className="shrink-0 font-medium text-foreground/80">
            Profile {profileCompletion}% complete
          </span>

          <div className="hidden sm:block h-2 w-24 rounded-full bg-muted overflow-hidden shrink-0">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${profileCompletion}%` }}
            />
          </div>

          <span className="truncate text-muted-foreground/80">{barText}</span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link href="/profile">
            <Button variant="outline" size="xs" className="cursor-pointer h-7 text-xs gap-1.5">
              Complete Profile
              <ArrowRight className="h-3 w-3" />
            </Button>
          </Link>
          <button
            onClick={handleDismiss}
            className="p-1 rounded-md text-muted-foreground/60 hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
            aria-label="Dismiss"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
