"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useMentorshipQuery, useUpdateMentorshipMutation } from "@/hooks/queries/mentorships";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, ArrowLeft, Minus, Plus } from "lucide-react";

function parseDuration(duration: string) {
  const match = duration.match(/^(\d+)\s*(week|month)/i);
  if (match) {
    return {
      count: parseInt(match[1]),
      unit: match[2].toLowerCase() as "week" | "month",
    };
  }
  return { count: 3, unit: "month" as const };
}

function computeDuration(count: number, unit: "week" | "month") {
  const display = `${count} ${unit}${count > 1 ? "s" : ""}`;
  const durationDays = count * (unit === "month" ? 30 : 7);
  return { duration: display, durationDays };
}

export default function EditMentorshipPage() {
  const params = useParams();
  const router = useRouter();
  const mentorshipId = Number(params.id);

  const { data: mentorship, isLoading } = useMentorshipQuery(mentorshipId);
  const mutation = useUpdateMentorshipMutation();

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

  useEffect(() => {
    if (!mentorship) return;
    setTitle(mentorship.title);
    setDescription(mentorship.description);
    setDomain(mentorship.domain);
    setMode(mentorship.mode);
    const parsed = parseDuration(mentorship.duration);
    setDurationCount(parsed.count);
    setDurationUnit(parsed.unit);
    setYearsOfExperience(mentorship.yearsOfExperience);
    setExpertise(mentorship.expertise);
    setMaxMentees(mentorship.maxMentees);
    setDeadline(mentorship.applicationDeadline.substring(0, 16));
  }, [mentorship]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const { duration, durationDays } = computeDuration(durationCount, durationUnit);
    try {
      await mutation.mutateAsync({
        id: mentorshipId,
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
      router.push(`/alumni-mentorship/${mentorshipId}`);
    } catch {
      alert("Failed to update mentorship.");
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-8 w-64" />
        <div className="space-y-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full rounded-md" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <Link
        href={`/alumni-mentorship/${mentorshipId}`}
        className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Mentorship
      </Link>

      <div className="space-y-1">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Edit Mentorship
        </h1>
        <p className="text-xs text-muted-foreground">
          Update your mentorship details.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="title">Title <span className="text-destructive">*</span></Label>
          <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description <span className="text-destructive">*</span></Label>
          <Textarea id="description" rows={5} value={description} onChange={(e) => setDescription(e.target.value)} required className="resize-none" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="domain">Domain <span className="text-destructive">*</span></Label>
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
            <Label>Duration <span className="text-destructive">*</span></Label>
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
              <Select value={durationUnit} onValueChange={(v) => setDurationUnit(v as typeof durationUnit)}>
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
            <Label htmlFor="yearsOfExperience">Experience <span className="text-destructive">*</span></Label>
            <Input id="yearsOfExperience" type="number" min={0} value={yearsOfExperience} onChange={(e) => setYearsOfExperience(Number(e.target.value))} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="maxMentees">Max Mentees <span className="text-destructive">*</span></Label>
            <Input id="maxMentees" type="number" min={1} value={maxMentees} onChange={(e) => setMaxMentees(Number(e.target.value))} required />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="expertise">Expertise <span className="text-destructive">*</span></Label>
          <Input id="expertise" value={expertise} onChange={(e) => setExpertise(e.target.value)} required />
          <p className="text-[10px] text-muted-foreground">
            Comma-separated list of skills.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="deadline">Application Deadline <span className="text-destructive">*</span></Label>
          <Input id="deadline" type="datetime-local" value={deadline} onChange={(e) => setDeadline(e.target.value)} required />
        </div>

        <Button type="submit" disabled={mutation.isPending} className="w-full cursor-pointer">
          {mutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          {mutation.isPending ? "Updating..." : "Update Mentorship"}
        </Button>
      </form>
    </div>
  );
}
