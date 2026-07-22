"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCreateMentorshipMutation } from "@/hooks/queries/mentorships";
import { DOMAINS } from "@/lib/types/mentorship";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, ArrowLeft, Minus, Plus } from "lucide-react";

function computeDuration(count: number, unit: "week" | "month") {
  const display = `${count} ${unit}${count > 1 ? "s" : ""}`;
  const durationDays = count * (unit === "month" ? 30 : 7);
  return { duration: display, durationDays };
}

export default function CreateMentorshipPage() {
  const router = useRouter();
  const mutation = useCreateMentorshipMutation();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [domain, setDomain] = useState("");
  const [mode, setMode] = useState<"ONLINE" | "OFFLINE" | "HYBRID">("ONLINE");
  const [durationCount, setDurationCount] = useState(3);
  const [durationUnit, setDurationUnit] = useState<"week" | "month">("month");
  const [yearsOfExperience, setYearsOfExperience] = useState(0);
  const [expertise, setExpertise] = useState("");
  const [maxMentees, setMaxMentees] = useState(1);
  const [deadline, setDeadline] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const { duration, durationDays } = computeDuration(durationCount, durationUnit);
    try {
      await mutation.mutateAsync({
        title: title.trim(),
        description: description.trim(),
        domain,
        mode,
        duration,
        durationDays,
        yearsOfExperience,
        expertise: expertise.trim(),
        maxMentees,
        applicationDeadline: deadline,
      });
      router.push("/alumni-mentorship");
    } catch {
      alert("Failed to create mentorship.");
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <Link
        href="/alumni-mentorship"
        className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Mentorships
      </Link>

      <div className="space-y-1">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Create Mentorship
        </h1>
        <p className="text-xs text-muted-foreground">
          Share your expertise with students.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="title">
            Title <span className="text-destructive">*</span>
          </Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Software Engineering Mentorship"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">
            Description <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe what you'll offer as a mentor..."
            rows={5}
            required
            className="resize-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="domain">
              Domain <span className="text-destructive">*</span>
            </Label>
            <Select value={domain} onValueChange={(v) => v && setDomain(v)} required>
              <SelectTrigger>
                <SelectValue placeholder="Select a domain" />
              </SelectTrigger>
              <SelectContent>
                {DOMAINS.map((d) => (
                  <SelectItem key={d} value={d}>{d}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="mode">Mode</Label>
            <Select value={mode} onValueChange={(v) => setMode(v as typeof mode)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ONLINE">Online</SelectItem>
                <SelectItem value="OFFLINE">Offline</SelectItem>
                <SelectItem value="HYBRID">Hybrid</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>
              Duration <span className="text-destructive">*</span>
            </Label>
            <div className="flex items-center gap-2">
              <div className="flex items-center border border-border rounded-md">
                <button
                  type="button"
                  onClick={() => setDurationCount(Math.max(1, durationCount - 1))}
                  className="h-9 px-2 text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors cursor-pointer"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="w-8 text-center text-sm font-medium text-foreground tabular-nums">
                  {durationCount}
                </span>
                <button
                  type="button"
                  onClick={() => setDurationCount(Math.min(12, durationCount + 1))}
                  className="h-9 px-2 text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
              <Select
                value={durationUnit}
                onValueChange={(v) => setDurationUnit(v as typeof durationUnit)}
              >
                <SelectTrigger className="w-28">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Week{durationCount > 1 ? "s" : ""}</SelectItem>
                  <SelectItem value="month">Month{durationCount > 1 ? "s" : ""}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <p className="text-[10px] text-muted-foreground">
              = {computeDuration(durationCount, durationUnit).duration}
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="yearsOfExperience">
              Experience <span className="text-destructive">*</span>
            </Label>
            <Input
              id="yearsOfExperience"
              type="number"
              min={0}
              placeholder="Years"
              value={yearsOfExperience}
              onChange={(e) => setYearsOfExperience(Number(e.target.value))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="maxMentees">
              Max Mentees <span className="text-destructive">*</span>
            </Label>
            <Input
              id="maxMentees"
              type="number"
              min={1}
              placeholder="e.g. 3"
              value={maxMentees}
              onChange={(e) => setMaxMentees(Number(e.target.value))}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="expertise">
            Expertise <span className="text-destructive">*</span>
          </Label>
          <Input
            id="expertise"
            value={expertise}
            onChange={(e) => setExpertise(e.target.value)}
            placeholder="e.g. Spring Boot, React, AWS"
            required
          />
          <p className="text-[10px] text-muted-foreground">
            Comma-separated list of skills you&apos;ll mentor on.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="deadline">
            Application Deadline <span className="text-destructive">*</span>
          </Label>
          <Input
            id="deadline"
            type="datetime-local"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            required
          />
        </div>

        <Button
          type="submit"
          disabled={mutation.isPending}
          className="w-full cursor-pointer"
        >
          {mutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          {mutation.isPending ? "Creating..." : "Create Mentorship"}
        </Button>
      </form>
    </div>
  );
}
