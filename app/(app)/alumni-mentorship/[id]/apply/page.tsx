"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useApplyMentorshipMutation } from "@/hooks/queries/mentorships";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Loader2, ArrowLeft, Upload } from "lucide-react";

export default function ApplyMentorshipPage() {
  const params = useParams();
  const router = useRouter();
  const mentorshipId = Number(params.id);
  const mutation = useApplyMentorshipMutation();

  const [motivation, setMotivation] = useState("");
  const [cgpaAtApplication, setCgpaAtApplication] = useState<number | "">("");
  const [resume, setResume] = useState<File | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (motivation.trim().length < 20) {
      alert("Motivation should be at least 20 characters.");
      return;
    }
    if (cgpaAtApplication === "" || cgpaAtApplication < 0 || cgpaAtApplication > 10) {
      alert("Please enter a valid CGPA (0–10).");
      return;
    }
    try {
      await mutation.mutateAsync({
        mentorshipId,
        motivation: motivation.trim(),
        cgpaAtApplication: Number(cgpaAtApplication),
        resume,
      });
      router.push(`/alumni-mentorship/${params.id}`);
    } catch {
      alert("Submission Failed");
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <Link
        href={`/alumni-mentorship/${params.id}`}
        className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Mentorship
      </Link>

      <div className="space-y-1">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Apply for Mentorship
        </h1>
        <p className="text-xs text-muted-foreground">
          Tell us why you&apos;re a great fit.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="motivation">
            Why do you want this mentorship? <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="motivation"
            value={motivation}
            onChange={(e) => setMotivation(e.target.value)}
            rows={8}
            required
            placeholder="Share your goals, what you hope to learn, and why you're interested in this domain..."
            className="resize-none"
          />
          <p className="text-xs text-muted-foreground">
            {motivation.length}/20 minimum characters
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="cgpa">
            Current CGPA <span className="text-destructive">*</span>
          </Label>
          <Input
            id="cgpa"
            type="number"
            step="0.01"
            min={0}
            max={10}
            value={cgpaAtApplication}
            onChange={(e) => setCgpaAtApplication(e.target.value === "" ? "" : Number(e.target.value))}
            required
            placeholder="e.g. 8.50"
          />
          <p className="text-xs text-muted-foreground">
            Your CGPA at the time of application (0–10 scale).
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="resume">
            Resume <span className="text-muted-foreground/60">(optional)</span>
          </Label>
          <div className="flex items-center gap-3">
            <Input
              id="resume"
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => setResume(e.target.files?.[0] || null)}
              className="file:mr-3 file:py-1 file:px-3 file:rounded-md file:border file:border-border file:text-xs file:font-medium file:bg-muted file:text-muted-foreground hover:file:bg-muted/80 cursor-pointer"
            />
            {resume && (
              <span className="text-xs text-muted-foreground shrink-0">
                {resume.name}
              </span>
            )}
          </div>
        </div>

        <Button
          type="submit"
          disabled={mutation.isPending}
          className="cursor-pointer"
        >
          {mutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          {mutation.isPending ? "Submitting..." : "Submit Application"}
        </Button>
      </form>
    </div>
  );
}
