"use client";

import { useEffect, useState } from "react";
import SkillsOnboardingModal from "./SkillsOnboardingModal";
import { getAlumniSkillsSummary } from "@/lib/api";

interface SkillsOnboardingWrapperProps {
  alumniId: number;
  courseId?: number;
  onComplete?: () => void;
}

export default function SkillsOnboardingWrapper({
  alumniId,
  courseId,
  onComplete,
}: SkillsOnboardingWrapperProps) {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!alumniId) {
      console.log(
        "[SkillsOnboarding] No alumniId provided, skipping onboarding",
      );
      return;
    }

    // Check if user has already completed onboarding or skipped it
    const hasCompleted = localStorage.getItem("skills_onboarding_completed");
    const hasSkipped = localStorage.getItem("skills_onboarding_skipped");

    console.log("[SkillsOnboarding] Status:", {
      hasCompleted,
      hasSkipped,
      alumniId,
      courseId,
    });

    if (hasCompleted || hasSkipped) {
      console.log(
        "[SkillsOnboarding] Already completed or skipped, not showing",
      );
      return;
    }

    // Check if user already has skills
    const checkExistingSkills = async () => {
      try {
        console.log("[SkillsOnboarding] Checking existing skills...");
        const skillsData = await getAlumniSkillsSummary(alumniId);
        console.log("[SkillsOnboarding] Current skills:", skillsData);

        if (skillsData.skills && skillsData.skills.length === 0) {
          // No skills, show onboarding
          console.log("[SkillsOnboarding] No skills found, showing onboarding");
          setShowModal(true);
        } else {
          console.log(
            "[SkillsOnboarding] User has skills, marking as completed",
          );
          localStorage.setItem("skills_onboarding_completed", "true");
        }
      } catch (error) {
        console.error(
          "[SkillsOnboarding] Failed to check existing skills:",
          error,
        );
        // Show onboarding anyway if we can't check
        console.log(
          "[SkillsOnboarding] Error checking skills, showing onboarding anyway",
        );
        setShowModal(true);
      }
    };

    checkExistingSkills();
  }, [alumniId]);

  const handleClose = () => {
    console.log("[SkillsOnboarding] Modal closed");
    setShowModal(false);
  };

  const handleComplete = () => {
    console.log("[SkillsOnboarding] Onboarding completed");
    localStorage.setItem("skills_onboarding_completed", "true");
    onComplete?.();
  };

  console.log("[SkillsOnboarding] Rendering with showModal:", showModal);

  return (
    <SkillsOnboardingModal
      isOpen={showModal}
      onClose={handleClose}
      alumniId={alumniId}
      courseId={courseId}
      onComplete={handleComplete}
    />
  );
}
