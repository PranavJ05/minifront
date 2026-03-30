"use client";

import { useEffect, useState } from "react";
import {
  X,
  Check,
  Search,
  GraduationCap,
  Sparkles,
  ArrowRight,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Skill, Course } from "@/types";
import {
  getStarterSkills,
  getApprovedSkills,
  searchSkills,
  addSkillToAlumni,
  getCourses,
} from "@/lib/api";

interface SkillsOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  alumniId: number;
  courseId?: number;
  onComplete?: () => void;
}

export default function SkillsOnboardingModal({
  isOpen,
  onClose,
  alumniId,
  courseId: propCourseId,
  onComplete,
}: SkillsOnboardingModalProps) {
  const [step, setStep] = useState<"course" | "skills" | "complete">("course");
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [starterSkills, setStarterSkills] = useState<Skill[]>([]);
  const [allSkills, setAllSkills] = useState<Skill[]>([]);
  const [selectedSkillIds, setSelectedSkillIds] = useState<Set<number>>(
    new Set(),
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load courses on mount
  useEffect(() => {
    if (isOpen && step === "course") {
      loadCourses();
    }
  }, [isOpen, step]);

  // Load skills when course is selected
  useEffect(() => {
    if (selectedCourse && step === "skills") {
      loadSkills(selectedCourse.id);
    }
  }, [selectedCourse, step]);

  const loadCourses = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCourses();
      console.log("[Onboarding] Courses loaded:", data);
      setCourses(data);
      // If a course was passed as prop, select it
      if (propCourseId) {
        const course = data.find((c) => c.id === propCourseId);
        if (course) {
          setSelectedCourse(course);
          setStep("skills");
        }
      }
    } catch (err: any) {
      console.error("[Onboarding] Failed to load courses:", err);
      setError(
        err.message || "Failed to load courses. Make sure backend is running.",
      );
    } finally {
      setLoading(false);
    }
  };

  const loadSkills = async (courseId: number) => {
    setLoading(true);
    setError(null);
    try {
      const [starters, approved] = await Promise.all([
        getStarterSkills(courseId),
        getApprovedSkills(courseId),
      ]);
      console.log("[Onboarding] Skills loaded for course", courseId, {
        starters,
        approved,
      });
      setStarterSkills(starters);
      setAllSkills(approved);
      // Pre-select starter skills (first 5)
      const preselected = new Set<number>(
        starters.map((s) => s.id).slice(0, 5),
      );
      setSelectedSkillIds(preselected);
    } catch (err: any) {
      console.error("[Onboarding] Failed to load skills:", err);
      setError(err.message || "Failed to load skills");
    } finally {
      setLoading(false);
    }
  };

  const handleCourseSelect = (course: Course) => {
    setSelectedCourse(course);
    setStep("skills");
  };

  const toggleSkill = (skillId: number) => {
    setSelectedSkillIds((prev) => {
      const next = new Set(prev);
      if (next.has(skillId)) {
        next.delete(skillId);
      } else {
        next.add(skillId);
      }
      return next;
    });
  };

  const handleSave = async () => {
    if (selectedSkillIds.size === 0) {
      setError("Please select at least one skill");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const promises = Array.from(selectedSkillIds).map((skillId) =>
        addSkillToAlumni(alumniId, skillId),
      );
      await Promise.all(promises);
      setStep("complete");
    } catch (err: any) {
      setError(err.message || "Failed to save skills");
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    setStep("course");
    setSelectedCourse(null);
    setSelectedSkillIds(new Set());
    setSearchQuery("");
    setError(null);
    onClose();
    onComplete?.();
  };

  const handleSkip = () => {
    localStorage.setItem("skills_onboarding_skipped", "true");
    handleClose();
  };

  const filteredSkills = searchQuery
    ? allSkills.filter((skill) =>
        skill.name.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : allSkills;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleSkip}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-navy-950 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gold-500 p-2 rounded-lg">
              <Sparkles className="h-5 w-5 text-navy-950" />
            </div>
            <div>
              <h2 className="font-serif text-xl font-bold text-white">
                Setup Your Skills
              </h2>
              <p className="text-gray-400 text-xs mt-0.5">
                Let&apos;s showcase your expertise
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Progress Bar */}
        {step !== "complete" && (
          <div className="bg-navy-900 px-6 py-3">
            <div className="flex items-center gap-2">
              <div
                className={`h-2 flex-1 rounded-full transition-all ${
                  step === "course" ? "bg-gold-500" : "bg-navy-700"
                }`}
              />
              <div
                className={`h-2 flex-1 rounded-full transition-all ${
                  step === "skills" ? "bg-gold-500" : "bg-navy-700"
                }`}
              />
            </div>
            <p className="text-gray-400 text-xs mt-2">
              Step {step === "course" ? "1" : "2"} of 2
            </p>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-700">
              <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-sm">Error</p>
                <p className="text-sm mt-0.5">{error}</p>
              </div>
              <button
                onClick={() => setError(null)}
                className="text-red-400 hover:text-red-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Step 1: Select Course */}
          {step === "course" && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <GraduationCap className="h-16 w-16 text-gold-500 mx-auto mb-4" />
                <h3 className="font-serif text-2xl font-bold text-navy-900">
                  Select Your Course
                </h3>
                <p className="text-gray-600 mt-2">
                  Choose the course you graduated from to see relevant skills
                </p>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-navy-800" />
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-3">
                  {courses.map((course) => (
                    <button
                      key={course.id}
                      onClick={() => handleCourseSelect(course)}
                      className="p-4 border-2 border-gray-200 rounded-xl hover:border-gold-500 hover:bg-gold-50 transition-all text-left group"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-bold text-navy-900 group-hover:text-gold-700">
                            {course.code}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            {course.name}
                          </p>
                        </div>
                        <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-gold-500 transition-colors" />
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 2: Select Skills */}
          {step === "skills" && selectedCourse && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 bg-gold-50 text-gold-700 px-4 py-2 rounded-full text-sm font-medium mb-3">
                  <GraduationCap className="h-4 w-4" />
                  {selectedCourse.code} - {selectedCourse.name}
                </div>
                <h3 className="font-serif text-2xl font-bold text-navy-900">
                  Select Your Skills
                </h3>
                <p className="text-gray-600 mt-2">
                  Choose at least 3 skills to get started (you can add more
                  later)
                </p>
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search skills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-500"
                />
              </div>

              {/* Starter Skills Section */}
              {!searchQuery && starterSkills.length > 0 && (
                <div>
                  <h4 className="font-semibold text-navy-900 mb-3 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-gold-500" />
                    Recommended Starter Skills
                  </h4>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {starterSkills.slice(0, 6).map((skill) => (
                      <SkillBadge
                        key={skill.id}
                        skill={skill}
                        isSelected={selectedSkillIds.has(skill.id)}
                        onToggle={() => toggleSkill(skill.id)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* All Skills */}
              <div>
                <h4 className="font-semibold text-navy-900 mb-3">
                  {searchQuery ? "Search Results" : "All Approved Skills"}
                </h4>
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-navy-800" />
                  </div>
                ) : filteredSkills.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    No skills found
                  </p>
                ) : (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-80 overflow-y-auto">
                    {filteredSkills.map((skill) => (
                      <SkillBadge
                        key={skill.id}
                        skill={skill}
                        isSelected={selectedSkillIds.has(skill.id)}
                        onToggle={() => toggleSkill(skill.id)}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Selection Count */}
              <div className="bg-navy-50 rounded-xl px-4 py-3 flex items-center justify-between">
                <p className="text-sm text-navy-700">
                  {selectedSkillIds.size} skill
                  {selectedSkillIds.size !== 1 ? "s" : ""} selected
                </p>
                <p className="text-xs text-gray-500">Minimum 3 recommended</p>
              </div>
            </div>
          )}

          {/* Step 3: Complete */}
          {step === "complete" && (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="h-10 w-10 text-green-500" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-navy-900 mb-2">
                Skills Added Successfully!
              </h3>
              <p className="text-gray-600 mb-6">
                You&apos;ve added {selectedSkillIds.size} skills to your
                profile. You can always add or remove skills later.
              </p>
              <button
                onClick={handleClose}
                className="btn-primary inline-flex items-center gap-2"
              >
                Go to Dashboard
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        {step === "skills" && (
          <div className="border-t border-gray-200 px-6 py-4 flex items-center justify-between gap-3">
            <button
              onClick={handleSkip}
              className="text-gray-600 hover:text-navy-900 font-medium text-sm"
            >
              Skip for now
            </button>
            <button
              onClick={handleSave}
              disabled={saving || selectedSkillIds.size === 0}
              className="btn-primary inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              {saving ? "Saving..." : `Continue (${selectedSkillIds.size})`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Skill Badge Component
function SkillBadge({
  skill,
  isSelected,
  onToggle,
}: {
  skill: Skill;
  isSelected: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className={`p-3 rounded-lg border-2 text-left transition-all ${
        isSelected
          ? "border-gold-500 bg-gold-50 text-gold-700"
          : "border-gray-200 hover:border-gold-300 hover:bg-gray-50"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm truncate">{skill.name}</p>
          {skill.isStarter && (
            <p className="text-xs text-gold-600 mt-0.5 flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              Starter
            </p>
          )}
        </div>
        <div
          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ml-2 ${
            isSelected
              ? "border-gold-500 bg-gold-500 text-white"
              : "border-gray-300"
          }`}
        >
          {isSelected && <Check className="h-3 w-3" />}
        </div>
      </div>
    </button>
  );
}
