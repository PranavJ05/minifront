"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LegacyClubEventsPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/events?tab=club-events");
  }, [router]);

  return null;
}
