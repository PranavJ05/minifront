"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LegacyFacultyPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/network/faculty");
  }, [router]);

  return null;
}
