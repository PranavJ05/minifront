// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { getOnboardingStatus } from "@/lib/skillsOnboarding";

export const metadata: Metadata = {
  title: "Alumni Network | University Alumni Relations",
  description:
    "The official platform for university alumni to network, mentor, and find career opportunities.",
  keywords: "alumni, university, networking, mentorship, careers",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Expose debugging utilities to window
  if (typeof window !== "undefined") {
    console.log("[App] Skills onboarding status:", getOnboardingStatus());
  }

  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
