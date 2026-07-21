"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LegacyAlumniSessionsPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/events?tab=alumni-sessions");
  }, [router]);

  return null;
}
