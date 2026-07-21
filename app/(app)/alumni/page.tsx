"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LegacyAlumniPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/network/alumni");
  }, [router]);

  return null;
}
