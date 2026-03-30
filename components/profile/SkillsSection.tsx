"use client";

/**
 * SkillsSection.tsx
 *
 * Displays the alumni's current skills as a tagged grid.
 * Handles: loading, empty, error, and populated states.
 * Each skill has a remove button when editable.
 */

import { useState } from "react";
import {
  Loader2,
  AlertCircle,
  Plus,
  X,
  Sparkles,
  RefreshCw,
  BookOpen,
} from "lucide-react";
import { AlumniSkillSummary } from "@/types";
import { removeSkillFromAlumni } from "@/lib/api";

const LOG = (...args: unknown[]) => console.log("[SkillsSection]", ...args);
const ERR = (...args: unknown[]) => console.error("[SkillsSection]", ...args);

// ─── Types ────────────────────────────────────────────────────────────────────

interface SkillsSectionProps {
  alumniId: number | null;
  resolvedCourseId: number | null;
  skillsData: AlumniSkillSummary | null;
  isLoading: boolean;
  isResolving: boolean;
  error: string | null;
  canEdit: boolean;
  onAddSkillClick: () => void;
  onSkillRemoved: () => void;
  onRetry: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function SkillsSection({
  alumniId,
  resolvedCourseId,
  skillsData,
  isLoading,
  isResolving,
  error,
  canEdit,
  onAddSkillClick,
  onSkillRemoved,
  onRetry,
}: SkillsSectionProps) {
  const [removingSkillId, setRemovingSkillId] = useState<number | null>(null);
  const [removeError, setRemoveError] = useState<string | null>(null);

  LOG("Render:", {
    alumniId,
    resolvedCourseId,
    isLoading,
    canEdit,
    skillCount: skillsData?.skills.length ?? 0,
    error,
  });

  // ── Remove handler ────────────────────────────────────────────────────────

  async function handleRemoveSkill(skillId: number, skillName: string) {
    if (!alumniId) {
      ERR("Cannot remove — alumniId is null");
      return;
    }

    LOG(`Removing skill: id=${skillId} name="${skillName}"`);
    setRemovingSkillId(skillId);
    setRemoveError(null);

    try {
      await removeSkillFromAlumni(alumniId, skillId);
      LOG(`Skill removed: id=${skillId}`);
      onSkillRemoved();
    } catch (err: any) {
      ERR(`Failed to remove skill id=${skillId}:`, err);
      setRemoveError(`Failed to remove "${skillName}": ${err.message}`);
    } finally {
      setRemovingSkillId(null);
    }
  }

  // ── Skeleton loader ───────────────────────────────────────────────────────

  if (isLoading || isResolving) {
    return (
      <SkillsCard
        canEdit={canEdit}
        skillCount={null}
        onAddSkillClick={onAddSkillClick}
        resolvedCourseId={resolvedCourseId}
      >
        <div className="flex flex-wrap gap-2">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-8 rounded-full bg-gray-100 animate-pulse"
              style={{ width: `${70 + (i % 3) * 30}px` }}
            />
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-3">
          {isResolving ? "Resolving course…" : "Loading skills…"}
        </p>
      </SkillsCard>
    );
  }

  // ── Error state ───────────────────────────────────────────────────────────

  if (error) {
    return (
      <SkillsCard
        canEdit={false}
        skillCount={null}
        onAddSkillClick={onAddSkillClick}
        resolvedCourseId={resolvedCourseId}
      >
        <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4">
          <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-red-700 text-sm">
              Skills unavailable
            </p>
            <p className="text-sm text-red-600 mt-0.5">{error}</p>
          </div>
          <button
            onClick={() => {
              LOG("Retry clicked");
              onRetry();
            }}
            className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-300 text-red-600 hover:bg-red-100 text-xs font-medium transition-colors"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Retry
          </button>
        </div>
      </SkillsCard>
    );
  }

  // ── Not ready (no alumniId or courseId) ───────────────────────────────────

  if (!alumniId || !resolvedCourseId) {
    return (
      <SkillsCard
        canEdit={false}
        skillCount={null}
        onAddSkillClick={onAddSkillClick}
        resolvedCourseId={resolvedCourseId}
      >
        <div className="flex items-center gap-3 text-gray-400 py-2">
          <BookOpen className="h-5 w-5" />
          <p className="text-sm">
            Skills will appear here once your profile is fully set up.
          </p>
        </div>
      </SkillsCard>
    );
  }

  const skills = skillsData?.skills ?? [];

  return (
    <SkillsCard
      canEdit={canEdit}
      skillCount={skills.length}
      onAddSkillClick={onAddSkillClick}
      resolvedCourseId={resolvedCourseId}
    >
      {/* Remove error toast */}
      {removeError && (
        <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-3 mb-3">
          <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700 flex-1">{removeError}</p>
          <button
            onClick={() => setRemoveError(null)}
            className="text-red-400 hover:text-red-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Empty state */}
      {skills.length === 0 && (
        <div className="py-8 text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#f0f4ff] flex items-center justify-center mx-auto mb-4">
            <Sparkles className="h-7 w-7 text-[#1a2744]" />
          </div>
          <p className="font-semibold text-[#1a2744] text-base">
            No skills added yet
          </p>
          <p className="text-sm text-gray-500 mt-1 max-w-xs mx-auto">
            Add skills to showcase your expertise and help others discover your
            profile.
          </p>
          {canEdit && (
            <button
              onClick={() => {
                LOG("Empty state Add Skill button clicked");
                onAddSkillClick();
              }}
              className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1a2744] text-white text-sm font-semibold hover:bg-[#243460] transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add Your First Skill
            </button>
          )}
        </div>
      )}

      {/* Skills grid */}
      {skills.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => {
            const isRemoving = removingSkillId === skill.skillId;
            return (
              <div
                key={skill.skillId}
                className={`
                  group relative flex items-center gap-2 px-3.5 py-1.5 rounded-full
                  border text-sm font-medium transition-all duration-200
                  ${
                    isRemoving
                      ? "border-red-200 bg-red-50 text-red-400 opacity-60"
                      : skill.isStarter
                        ? "border-[#c8a84b]/40 bg-[#fdf8ec] text-[#8a6d1e] hover:border-[#c8a84b]"
                        : "border-[#1a2744]/20 bg-[#f0f4ff] text-[#1a2744] hover:border-[#1a2744]/40"
                  }
                `}
              >
                {skill.isStarter && (
                  <Sparkles className="h-3 w-3 opacity-70 flex-shrink-0" />
                )}
                <span>{skill.skillName}</span>

                {/* Remove button — visible on hover */}
                {canEdit && !isRemoving && (
                  <button
                    onClick={() => {
                      LOG(
                        `Remove button clicked for skill: ${skill.skillId} "${skill.skillName}"`,
                      );
                      handleRemoveSkill(skill.skillId, skill.skillName);
                    }}
                    title={`Remove ${skill.skillName}`}
                    className="
                      ml-0.5 -mr-1 w-4 h-4 rounded-full flex items-center justify-center
                      opacity-0 group-hover:opacity-100 transition-opacity
                      bg-gray-300/60 hover:bg-red-200 text-gray-500 hover:text-red-600
                    "
                  >
                    <X className="h-2.5 w-2.5" />
                  </button>
                )}

                {/* Removing spinner */}
                {isRemoving && (
                  <Loader2 className="h-3 w-3 animate-spin ml-0.5 flex-shrink-0" />
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Legend */}
      {skills.length > 0 && (
        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100">
          <span className="flex items-center gap-1.5 text-xs text-gray-400">
            <span className="w-2.5 h-2.5 rounded-full bg-[#fdf8ec] border border-[#c8a84b]/50 inline-block" />
            Core / starter skill
          </span>
          <span className="flex items-center gap-1.5 text-xs text-gray-400">
            <span className="w-2.5 h-2.5 rounded-full bg-[#f0f4ff] border border-[#1a2744]/20 inline-block" />
            Custom skill
          </span>
          {canEdit && (
            <span className="text-xs text-gray-400 ml-auto">
              Hover a skill to remove it
            </span>
          )}
        </div>
      )}
    </SkillsCard>
  );
}

// ─── Inner card wrapper ───────────────────────────────────────────────────────

interface SkillsCardProps {
  canEdit: boolean;
  skillCount: number | null;
  onAddSkillClick: () => void;
  resolvedCourseId: number | null;
  children: React.ReactNode;
}

function SkillsCard({
  canEdit,
  skillCount,
  onAddSkillClick,
  resolvedCourseId,
  children,
}: SkillsCardProps) {
  return (
    <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Card header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#1a2744] flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-[#c8a84b]" />
          </div>
          <div>
            <h2 className="font-bold text-[#1a2744] text-base leading-none">
              Skills & Expertise
            </h2>
            {skillCount !== null && (
              <p className="text-xs text-gray-400 mt-0.5">
                {skillCount} {skillCount === 1 ? "skill" : "skills"} on your
                profile
              </p>
            )}
          </div>
        </div>

        {canEdit && (
          <button
            onClick={() => {
              LOG("[SkillsCard] Add Skill header button clicked");
              onAddSkillClick();
            }}
            className="
              inline-flex items-center gap-2 px-4 py-2 rounded-xl
              bg-[#c8a84b] text-[#1a2744] text-sm font-bold
              hover:bg-[#d4b55a] active:scale-95 transition-all duration-150
              shadow-sm
            "
          >
            <Plus className="h-4 w-4" />
            Add Skill
          </button>
        )}
      </div>

      {/* Card body */}
      <div className="px-6 py-5">{children}</div>
    </section>
  );
}
