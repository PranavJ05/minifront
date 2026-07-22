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
import { getErrorMessage } from "@/lib/get-error-message";
import {
  getStarterSkills,
  getApprovedSkills,
  searchSkills,
  addSkillToAlumni,
  getCourses,
} from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
      setCourses(data);
      if (propCourseId) {
        const course = data.find((c) => c.id === propCourseId);
        if (course) {
          setSelectedCourse(course);
          setStep("skills");
        }
      }
    } catch (err: unknown) {
      setError(
        getErrorMessage(err, "Failed to load courses. Make sure backend is running."),
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
      setStarterSkills(starters);
      setAllSkills(approved);
      const preselected = new Set<number>(
        starters.map((s) => s.id).slice(0, 5),
      );
      setSelectedSkillIds(preselected);
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Failed to load skills"));
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

      localStorage.setItem("skills_onboarding_completed", "true");

      setStep("complete");
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Failed to save skills"));
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
      <div className="relative bg-card rounded-xl border border-border shadow-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-card border-b border-border px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary p-2 rounded-lg">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-foreground">
                Setup Your Skills
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Let&apos;s showcase your expertise
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="cursor-pointer"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Progress Bar */}
        {step !== "complete" && (
          <div className="bg-muted/40 px-6 py-3">
            <div className="flex items-center gap-2">
              <div
                className={`h-2 flex-1 rounded-full transition-all ${
                  step === "course" ? "bg-primary" : "bg-muted"
                }`}
              />
              <div
                className={`h-2 flex-1 rounded-full transition-all ${
                  step === "skills" ? "bg-primary" : "bg-muted"
                }`}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Step {step === "course" ? "1" : "2"} of 2
            </p>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Step 1: Select Course */}
          {step === "course" && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <GraduationCap className="h-16 w-16 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-foreground">
                  Select Your Course
                </h3>
                <p className="text-muted-foreground mt-2">
                  Choose the course you graduated from to see relevant skills
                </p>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-3">
                  {courses.map((course) => (
                    <button
                      key={course.id}
                      onClick={() => handleCourseSelect(course)}
                      className="p-4 border border-border rounded-xl hover:border-primary hover:bg-accent transition-all text-left group cursor-pointer"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-semibold text-foreground group-hover:text-foreground">
                            {course.code}
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {course.name}
                          </p>
                        </div>
                        <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors shrink-0 mt-0.5" />
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
                <div className="inline-flex items-center gap-2 bg-muted text-muted-foreground px-4 py-2 rounded-full text-sm font-medium mb-3">
                  <GraduationCap className="h-4 w-4" />
                  {selectedCourse.code} - {selectedCourse.name}
                </div>
                <h3 className="text-2xl font-bold text-foreground">
                  Select Your Skills
                </h3>
                <p className="text-muted-foreground mt-2">
                  Choose at least 3 skills to get started (you can add more
                  later)
                </p>
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                <Input
                  type="text"
                  placeholder="Search skills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>

              {/* Starter Skills Section */}
              {!searchQuery && starterSkills.length > 0 && (
                <div>
                  <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
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
                <h4 className="font-semibold text-foreground mb-3">
                  {searchQuery ? "Search Results" : "All Approved Skills"}
                </h4>
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : filteredSkills.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
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
              <div className="bg-muted rounded-xl px-4 py-3 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {selectedSkillIds.size} skill
                  {selectedSkillIds.size !== 1 ? "s" : ""} selected
                </p>
                <p className="text-xs text-muted-foreground/60">
                  Minimum 3 recommended
                </p>
              </div>
            </div>
          )}

          {/* Step 3: Complete */}
          {step === "complete" && (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">
                Skills Added Successfully!
              </h3>
              <p className="text-muted-foreground mb-6">
                You&apos;ve added {selectedSkillIds.size} skills to your
                profile. You can always add or remove skills later.
              </p>
              <Button onClick={handleClose} className="cursor-pointer gap-2">
                Go to Dashboard
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Footer */}
        {step === "skills" && (
          <div className="border-t border-border px-6 py-4 flex items-center justify-between gap-3">
            <Button
              variant="ghost"
              onClick={handleSkip}
              className="cursor-pointer"
            >
              Skip for now
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving || selectedSkillIds.size === 0}
              className="cursor-pointer gap-2"
            >
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              {saving ? "Saving..." : `Continue (${selectedSkillIds.size})`}
            </Button>
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
      className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
        isSelected
          ? "border-primary bg-primary/5 text-foreground"
          : "border-border bg-card hover:border-primary/50 hover:bg-accent"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm truncate">{skill.name}</p>
          {skill.isStarter && (
            <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              Starter
            </p>
          )}
        </div>
        <div
          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ml-2 ${
            isSelected
              ? "border-primary bg-primary text-primary-foreground"
              : "border-muted-foreground/30"
          }`}
        >
          {isSelected && <Check className="h-3 w-3" />}
        </div>
      </div>
    </button>
  );
}
