// lib/skillsOnboarding.ts
// Utility functions for skills onboarding management

/**
 * Reset skills onboarding state (for testing)
 * Call this from browser console: window.resetSkillsOnboarding()
 */
export function resetSkillsOnboarding(): void {
  if (typeof window === 'undefined') return;

  localStorage.removeItem('skills_onboarding_completed');
  localStorage.removeItem('skills_onboarding_skipped');
  console.log('✅ Skills onboarding state reset. Refresh the page to see onboarding.');
}

/**
 * Check if onboarding is completed
 */
export function isOnboardingCompleted(): boolean {
  if (typeof window === 'undefined') return false;

  const completed = localStorage.getItem('skills_onboarding_completed');
  const skipped = localStorage.getItem('skills_onboarding_skipped');
  return !!(completed || skipped);
}

/**
 * Get current onboarding status
 */
export function getOnboardingStatus(): {
  completed: boolean;
  skipped: boolean;
  shouldShow: boolean;
} {
  if (typeof window === 'undefined') {
    return { completed: false, skipped: false, shouldShow: false };
  }

  const completed = !!localStorage.getItem('skills_onboarding_completed');
  const skipped = !!localStorage.getItem('skills_onboarding_skipped');

  return {
    completed,
    skipped,
    shouldShow: !completed && !skipped,
  };
}

// Expose to window for debugging
if (typeof window !== 'undefined') {
  (window as any).resetSkillsOnboarding = resetSkillsOnboarding;
  (window as any).getOnboardingStatus = getOnboardingStatus;
}
