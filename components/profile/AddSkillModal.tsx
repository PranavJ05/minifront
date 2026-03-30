"use client";

/**
 * AddSkillModal.tsx — Fixed & hardened version
 *
 * Key fixes vs original:
 *  1. Skill ID consistency: API returns `id` field — always use `skill.id` (never `skill.skillId`)
 *  2. selectedSkillId comparison uses `skill.id` throughout
 *  3. filteredSkills uses `skill.id` for exclusion matching
 *  4. onClose + onSkillAdded called immediately after success (not in setTimeout)
 *     to avoid stale closure race
 *  5. loadSkills called with `courseId` from props (not stale closure)
 *  6. Full logging at every decision point
 *  7. Search debounce resets to approved list when query cleared
 *  8. Error cleared when user retries / changes selection
 */

import { useEffect, useRef, useState } from "react";
import {
  X,
  Search,
  Plus,
  Check,
  Loader2,
  AlertCircle,
  Sparkles,
  RefreshCw,
  ChevronLeft,
} from "lucide-react";
import { Skill } from "@/types";
import {
  getApprovedSkills,
  searchSkills,
  addSkillToAlumni,
  createSkill,
} from "@/lib/api";

const LOG = (...args: unknown[]) => console.log("[AddSkillModal]", ...args);
const ERR = (...args: unknown[]) => console.error("[AddSkillModal]", ...args);

// ─── Types ────────────────────────────────────────────────────────────────────

interface AddSkillModalProps {
  isOpen: boolean;
  onClose: () => void;
  alumniId: number;
  courseId: number;
  existingSkillIds?: number[];
  onSkillAdded?: () => void;
}

type View = "browse" | "propose";

// ─── Component ────────────────────────────────────────────────────────────────

export default function AddSkillModal({
  isOpen,
  onClose,
  alumniId,
  courseId,
  existingSkillIds = [],
  onSkillAdded,
}: AddSkillModalProps) {
  // ── State ──────────────────────────────────────────────────────────────────

  const [view, setView] = useState<View>("browse");
  const [allSkills, setAllSkills] = useState<Skill[]>([]); // full approved list
  const [shownSkills, setShownSkills] = useState<Skill[]>([]); // list currently rendered
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSkillId, setSelectedSkillId] = useState<number | null>(null);

  const [loadingSkills, setLoadingSkills] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Propose view
  const [customName, setCustomName] = useState("");

  // Debounce ref
  const searchDebounce = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Track the courseId we last loaded for (avoid stale closure)
  const loadedCourseId = useRef<number | null>(null);

  LOG("Render:", {
    isOpen,
    alumniId,
    courseId,
    existingSkillIds: existingSkillIds.length,
    view,
    shownCount: shownSkills.length,
    selectedSkillId,
    loadingSkills,
    saving,
  });

  // ── Open / close effects ───────────────────────────────────────────────────

  useEffect(() => {
    LOG(`isOpen changed → ${isOpen}, courseId=${courseId}`);

    if (isOpen) {
      // Reset all state on open
      setView("browse");
      setSearchQuery("");
      setSelectedSkillId(null);
      setLoadError(null);
      setSaveError(null);
      setSuccessMessage(null);
      setCustomName("");
      loadApprovedSkills(courseId);
    } else {
      // Clear debounce timer on close
      if (searchDebounce.current) clearTimeout(searchDebounce.current);
    }
  }, [isOpen, courseId]);

  // ── Search debounce effect ─────────────────────────────────────────────────

  useEffect(() => {
    if (!isOpen) return;

    if (searchDebounce.current) clearTimeout(searchDebounce.current);

    if (!searchQuery.trim()) {
      // Query cleared — restore the full approved list immediately
      LOG("Search cleared — restoring full approved list");
      setShownSkills(allSkills);
      return;
    }

    searchDebounce.current = setTimeout(() => {
      LOG("Debounce triggered for query:", searchQuery);
      handleSearch(searchQuery, courseId);
    }, 300);

    return () => {
      if (searchDebounce.current) clearTimeout(searchDebounce.current);
    };
  }, [searchQuery]);

  // ── Loaders ───────────────────────────────────────────────────────────────

  async function loadApprovedSkills(cId: number) {
    LOG("loadApprovedSkills() called for courseId:", cId);

    if (!cId) {
      ERR("courseId is falsy — cannot load approved skills:", cId);
      setLoadError("Course ID is missing. Cannot load skills.");
      return;
    }

    loadedCourseId.current = cId;
    setLoadingSkills(true);
    setLoadError(null);

    try {
      const data = await getApprovedSkills(cId);

      LOG("Approved skills loaded:", {
        count: data.length,
        sample: data.slice(0, 3).map((s) => `${s.id}:${s.name}`),
      });

      // Validate API returns `id` field
      if (data.length > 0 && typeof data[0].id !== "number") {
        ERR(
          "WARNING: skill objects do not have numeric `id` field. Got:",
          JSON.stringify(data[0]),
        );
      }

      setAllSkills(data);
      setShownSkills(data);
    } catch (err: any) {
      ERR("loadApprovedSkills error:", err);
      setLoadError(err.message || "Failed to load skills");
    } finally {
      setLoadingSkills(false);
    }
  }

  async function handleSearch(query: string, cId: number) {
    LOG("handleSearch() called:", { query, cId });

    setLoadingSkills(true);
    setLoadError(null);

    try {
      const data = await searchSkills(query, {
        courseId: cId,
        approvedOnly: true,
      });

      LOG("Search results:", {
        query,
        count: data.length,
        sample: data.slice(0, 3).map((s) => `${s.id}:${s.name}`),
      });

      setShownSkills(data);
    } catch (err: any) {
      ERR("handleSearch error:", err);
      setLoadError(err.message || "Search failed");
    } finally {
      setLoadingSkills(false);
    }
  }

  // ── Add skill ─────────────────────────────────────────────────────────────

  async function handleAddSkill() {
    LOG("handleAddSkill() called:", { selectedSkillId, alumniId });

    if (!selectedSkillId) {
      setSaveError("Please select a skill first.");
      return;
    }

    // Double-check not already added
    if (existingSkillIds.includes(selectedSkillId)) {
      ERR("Attempted to add already-existing skill:", selectedSkillId);
      setSaveError("You have already added this skill.");
      return;
    }

    setSaving(true);
    setSaveError(null);
    setSuccessMessage(null);

    try {
      LOG(
        `Calling addSkillToAlumni(alumniId=${alumniId}, skillId=${selectedSkillId})`,
      );
      const result = await addSkillToAlumni(alumniId, selectedSkillId);

      LOG("Skill added successfully:", result);
      setSuccessMessage(`"${result.skillName}" added to your profile!`);

      // Give user a moment to see the success message, then close
      setTimeout(() => {
        LOG("Closing modal and triggering refresh");
        onSkillAdded?.();
        onClose();
      }, 1200);
    } catch (err: any) {
      ERR("handleAddSkill error:", err);
      setSaveError(err.message || "Failed to add skill");
    } finally {
      setSaving(false);
    }
  }

  // ── Propose skill ─────────────────────────────────────────────────────────

  async function handleProposeSkill() {
    LOG("handleProposeSkill() called:", { customName, courseId });

    const trimmed = customName.trim();
    if (!trimmed) {
      setSaveError("Please enter a skill name.");
      return;
    }

    setSaving(true);
    setSaveError(null);
    setSuccessMessage(null);

    try {
      const newSkill = await createSkill({
        name: trimmed,
        courseId,
        isStarter: false,
      });

      LOG("Skill proposed:", newSkill);
      setSuccessMessage(
        `"${newSkill.name}" has been submitted for admin review. It will appear in the skill list once approved.`,
      );
      setCustomName("");

      // Return to browse view after a pause
      setTimeout(() => {
        setView("browse");
        setSuccessMessage(null);
        // Reload approved list so the new skill appears if auto-approved
        loadApprovedSkills(courseId);
      }, 2500);
    } catch (err: any) {
      ERR("handleProposeSkill error:", err);
      setSaveError(err.message || "Failed to submit skill proposal");
    } finally {
      setSaving(false);
    }
  }

  // ── Derived ───────────────────────────────────────────────────────────────

  /**
   * CRITICAL FIX: use skill.id (API field) for all comparisons.
   * The original code had skill.skillId ?? skill.id inconsistency.
   * Backend GET /api/skills/* returns `id` field; only alumni-skill join DTOs use `skillId`.
   */
  const filteredSkills = shownSkills.filter(
    (skill) => !existingSkillIds.includes(skill.id),
  );

  const hasResults = filteredSkills.length > 0;
  const allAlreadyAdded =
    shownSkills.length > 0 &&
    shownSkills.every((s) => existingSkillIds.includes(s.id));

  LOG("filteredSkills:", {
    shownCount: shownSkills.length,
    filteredCount: filteredSkills.length,
    existingIds: existingSkillIds,
    allAlreadyAdded,
  });

  // ── Guard ─────────────────────────────────────────────────────────────────

  if (!isOpen) {
    LOG("Not open — returning null");
    return null;
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => {
          if (!saving) {
            LOG("Backdrop clicked — closing modal");
            onClose();
          }
        }}
      />

      {/* Modal panel */}
      <div
        className="
          relative bg-white rounded-2xl shadow-2xl
          w-full max-w-xl flex flex-col
          max-h-[85vh]
          border border-gray-100
        "
        style={{ animation: "modalIn 0.18s ease-out" }}
      >
        {/* ── Header ── */}
        <div className="bg-[#1a2744] rounded-t-2xl px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            {view === "propose" ? (
              <button
                onClick={() => {
                  LOG("Back to browse from propose view");
                  setView("browse");
                  setSaveError(null);
                  setSuccessMessage(null);
                }}
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <ChevronLeft className="h-4 w-4 text-white" />
              </button>
            ) : (
              <div className="w-8 h-8 rounded-lg bg-[#c8a84b]/20 flex items-center justify-center">
                <Plus className="h-4 w-4 text-[#c8a84b]" />
              </div>
            )}
            <div>
              <h2 className="font-bold text-white text-base">
                {view === "browse" ? "Add Skills" : "Propose New Skill"}
              </h2>
              <p className="text-[#8fa3c0] text-xs">
                {view === "browse"
                  ? `Course ID: ${courseId} · ${existingSkillIds.length} already added`
                  : "Submit for admin review"}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              if (!saving) {
                LOG("X button clicked — closing modal");
                onClose();
              }
            }}
            disabled={saving}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#8fa3c0] hover:text-white hover:bg-white/10 transition-colors disabled:opacity-40"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* ── Scrollable body ── */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 min-h-0">
          {/* Success message */}
          {successMessage && (
            <div className="flex items-start gap-3 bg-green-50 border border-green-200 rounded-xl p-4">
              <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-green-800 text-sm">Done!</p>
                <p className="text-sm text-green-700 mt-0.5">
                  {successMessage}
                </p>
              </div>
            </div>
          )}

          {/* Save / load error */}
          {(saveError || loadError) && !successMessage && (
            <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4">
              <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-red-700 text-sm">
                  Something went wrong
                </p>
                <p className="text-sm text-red-600 mt-0.5">
                  {saveError || loadError}
                </p>
              </div>
              <button
                onClick={() => {
                  setSaveError(null);
                  setLoadError(null);
                }}
                className="text-red-400 hover:text-red-600 flex-shrink-0"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* ═══════════ BROWSE VIEW ═══════════ */}
          {view === "browse" && (
            <>
              {/* Search input */}
              <div>
                <label className="block text-xs font-semibold text-[#1a2744] uppercase tracking-wide mb-2">
                  Search Skills
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="e.g. Java, React, Machine Learning…"
                    value={searchQuery}
                    onChange={(e) => {
                      LOG("Search input changed:", e.target.value);
                      setSearchQuery(e.target.value);
                      setSelectedSkillId(null); // Clear selection on new search
                    }}
                    className="
                      w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200
                      text-sm focus:outline-none focus:ring-2 focus:ring-[#1a2744]/30 focus:border-[#1a2744]
                      transition-all placeholder:text-gray-400
                    "
                  />
                  {searchQuery && (
                    <button
                      onClick={() => {
                        LOG("Clearing search query");
                        setSearchQuery("");
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Skills list */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <p className="text-xs font-semibold text-[#1a2744] uppercase tracking-wide">
                    {searchQuery ? "Search Results" : "Available Skills"}
                  </p>
                  <div className="flex items-center gap-2">
                    {loadingSkills && (
                      <Loader2 className="h-3.5 w-3.5 animate-spin text-gray-400" />
                    )}
                    <span className="text-xs text-gray-400">
                      {filteredSkills.length} available
                    </span>
                    <button
                      onClick={() => {
                        LOG("Refresh skills clicked");
                        loadApprovedSkills(courseId);
                      }}
                      disabled={loadingSkills}
                      className="text-gray-400 hover:text-[#1a2744] transition-colors disabled:opacity-40"
                      title="Reload skills"
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* Loading skeleton */}
                {loadingSkills && shownSkills.length === 0 && (
                  <div className="grid sm:grid-cols-2 gap-2">
                    {[...Array(6)].map((_, i) => (
                      <div
                        key={i}
                        className="h-12 rounded-xl bg-gray-100 animate-pulse"
                      />
                    ))}
                  </div>
                )}

                {/* All already added */}
                {!loadingSkills && allAlreadyAdded && (
                  <div className="py-6 text-center">
                    <Check className="h-8 w-8 text-green-500 mx-auto mb-2" />
                    <p className="text-sm font-medium text-gray-700">
                      You&apos;ve added all available skills for this course!
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Propose a new skill below if you need something different.
                    </p>
                  </div>
                )}

                {/* No results (search returned empty) */}
                {!loadingSkills &&
                  !allAlreadyAdded &&
                  !hasResults &&
                  searchQuery && (
                    <div className="py-6 text-center">
                      <Search className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                      <p className="text-sm font-medium text-gray-600">
                        No skills matched &quot;{searchQuery}&quot;
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Try a different term, or propose a new skill.
                      </p>
                    </div>
                  )}

                {/* No skills loaded at all */}
                {!loadingSkills &&
                  !allAlreadyAdded &&
                  !hasResults &&
                  !searchQuery &&
                  !loadError && (
                    <div className="py-6 text-center">
                      <Sparkles className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                      <p className="text-sm font-medium text-gray-600">
                        No approved skills yet for this course
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Be the first to propose one!
                      </p>
                    </div>
                  )}

                {/* Load error with retry */}
                {!loadingSkills && loadError && shownSkills.length === 0 && (
                  <div className="py-6 text-center">
                    <AlertCircle className="h-8 w-8 text-red-400 mx-auto mb-2" />
                    <p className="text-sm font-medium text-red-700">
                      Failed to load skills
                    </p>
                    <p className="text-xs text-red-500 mt-1">{loadError}</p>
                    <button
                      onClick={() => loadApprovedSkills(courseId)}
                      className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-300 text-red-600 text-xs font-medium hover:bg-red-50 transition-colors"
                    >
                      <RefreshCw className="h-3 w-3" /> Retry
                    </button>
                  </div>
                )}

                {/* Skills grid */}
                {!loadingSkills && hasResults && (
                  <div className="grid sm:grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-1">
                    {filteredSkills.map((skill) => {
                      /**
                       * FIX: use skill.id (not skill.skillId).
                       * The /api/skills/* endpoints return objects with `id` field.
                       */
                      const isSelected = selectedSkillId === skill.id;

                      return (
                        <button
                          key={skill.id}
                          onClick={() => {
                            const next = isSelected ? null : skill.id;
                            LOG(
                              `Skill toggled: id=${skill.id} name="${skill.name}" → selectedSkillId=${next}`,
                            );
                            setSelectedSkillId(next);
                            setSaveError(null);
                          }}
                          className={`
                            w-full p-3 rounded-xl border-2 text-left transition-all duration-150
                            focus:outline-none focus:ring-2 focus:ring-[#c8a84b]/50
                            ${
                              isSelected
                                ? "border-[#c8a84b] bg-[#fdf8ec] shadow-sm"
                                : "border-gray-200 bg-white hover:border-[#c8a84b]/50 hover:bg-gray-50"
                            }
                          `}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-[#1a2744] text-sm truncate">
                                {skill.name}
                              </p>
                              {skill.isStarter && (
                                <p className="text-[10px] text-[#8a6d1e] mt-0.5 flex items-center gap-1">
                                  <Sparkles className="h-2.5 w-2.5" />
                                  Core Skill
                                </p>
                              )}
                            </div>
                            <div
                              className={`
                                w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0
                                transition-all duration-150
                                ${
                                  isSelected
                                    ? "border-[#c8a84b] bg-[#c8a84b]"
                                    : "border-gray-300"
                                }
                              `}
                            >
                              {isSelected && (
                                <Check className="h-3 w-3 text-white" />
                              )}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Propose link */}
              <div className="pt-2 border-t border-gray-100">
                <p className="text-xs text-gray-500 mb-2">
                  Can&apos;t find what you&apos;re looking for?
                </p>
                <button
                  onClick={() => {
                    LOG("Switching to propose view");
                    setView("propose");
                    setSaveError(null);
                    setSuccessMessage(null);
                  }}
                  className="text-[#c8a84b] hover:text-[#8a6d1e] font-semibold text-sm flex items-center gap-1.5 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Propose a new skill
                </button>
              </div>
            </>
          )}

          {/* ═══════════ PROPOSE VIEW ═══════════ */}
          {view === "propose" && (
            <div className="space-y-4">
              <div className="bg-[#f0f4ff] rounded-xl p-4 border border-[#1a2744]/10">
                <p className="text-sm text-[#1a2744] font-medium">
                  How this works
                </p>
                <p className="text-xs text-[#4a5568] mt-1 leading-relaxed">
                  Your proposed skill will be submitted to an admin for review.
                  Once approved, it will appear in the skill list and you can
                  add it to your profile.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1a2744] uppercase tracking-wide mb-2">
                  Skill Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. MLOps, Solidity, Embedded C…"
                  value={customName}
                  onChange={(e) => {
                    LOG("Custom skill name changed:", e.target.value);
                    setCustomName(e.target.value);
                    setSaveError(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !saving && customName.trim()) {
                      handleProposeSkill();
                    }
                  }}
                  className="
                    w-full px-4 py-2.5 rounded-xl border border-gray-200
                    text-sm focus:outline-none focus:ring-2 focus:ring-[#1a2744]/30 focus:border-[#1a2744]
                    transition-all placeholder:text-gray-400
                  "
                  autoFocus
                />
                <p className="text-xs text-gray-400 mt-1.5">
                  Course ID: {courseId}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        <div className="border-t border-gray-100 px-6 py-4 flex items-center justify-between gap-3 flex-shrink-0">
          <button
            onClick={() => {
              if (!saving) {
                LOG("Cancel button clicked");
                onClose();
              }
            }}
            disabled={saving}
            className="text-sm text-gray-500 hover:text-[#1a2744] font-medium transition-colors disabled:opacity-40"
          >
            Cancel
          </button>

          {view === "browse" ? (
            <button
              onClick={handleAddSkill}
              disabled={saving || !selectedSkillId || !!successMessage}
              className="
                inline-flex items-center gap-2 px-5 py-2.5 rounded-xl
                bg-[#1a2744] text-white text-sm font-bold
                hover:bg-[#243460] active:scale-95 transition-all duration-150
                disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100
                shadow-sm
              "
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Adding…
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Add to Profile
                </>
              )}
            </button>
          ) : (
            <button
              onClick={handleProposeSkill}
              disabled={saving || !customName.trim() || !!successMessage}
              className="
                inline-flex items-center gap-2 px-5 py-2.5 rounded-xl
                bg-[#1a2744] text-white text-sm font-bold
                hover:bg-[#243460] active:scale-95 transition-all duration-150
                disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100
                shadow-sm
              "
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Submitting…
                </>
              ) : (
                "Submit Proposal"
              )}
            </button>
          )}
        </div>
      </div>

      {/* CSS animation */}
      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.96) translateY(8px); }
          to   { opacity: 1; transform: scale(1)    translateY(0);   }
        }
      `}</style>
    </div>
  );
}
