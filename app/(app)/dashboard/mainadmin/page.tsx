"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function MainAdminDashboardRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/main-admin");
  }, [router]);

  return null;
}
