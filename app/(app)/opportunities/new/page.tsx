"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Briefcase, Building2, MapPin, Link as LinkIcon, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateOpportunityMutation } from "@/hooks/queries/opportunities";
import { getErrorMessage } from "@/lib/get-error-message";

interface OpportunityFormData {
  title: string;
  company: string;
  description: string;
  location: string;
  type: "JOB" | "INTERNSHIP" | "";
  applyLink: string;
  allowReferrals: boolean;
}

export default function NewOpportunityPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<OpportunityFormData>({
    title: "",
    company: "",
    description: "",
    location: "",
    type: "JOB",
    applyLink: "",
    allowReferrals: true,
  });

  const createMutation = useCreateOpportunityMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.title.trim() ||
      !formData.company.trim() ||
      !formData.description.trim() ||
      !formData.location.trim() ||
      !formData.type ||
      !formData.applyLink.trim()
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      await createMutation.mutateAsync({
        title: formData.title.trim(),
        company: formData.company.trim(),
        description: formData.description.trim(),
        location: formData.location.trim(),
        type: formData.type,
        applyLink: formData.applyLink.trim(),
        allowReferrals: formData.allowReferrals,
      });

      toast.success("Opportunity posted successfully!");
      router.push("/opportunities");
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "Failed to create opportunity."));
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <Link
        href="/opportunities"
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-1"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Opportunities
      </Link>

      <Card className="border-border">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <Briefcase className="h-5 w-5" />
            </div>
            <CardTitle className="text-xl font-bold">Post New Opportunity</CardTitle>
          </div>
          <CardDescription className="text-xs">
            Share a job posting or internship opening with fellow alumni and graduates.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="title" className="text-xs font-semibold">
                Opportunity Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                placeholder="e.g. Senior Software Engineer / Frontend Intern"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="text-xs"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="company" className="text-xs font-semibold">
                  Company Name <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/60" />
                  <Input
                    id="company"
                    placeholder="e.g. Google / Microsoft / Startup"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="pl-9 text-xs"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="type" className="text-xs font-semibold">
                  Opportunity Type <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.type}
                  onValueChange={(val) => setFormData({ ...formData, type: (val as "JOB" | "INTERNSHIP") || "JOB" })}
                >
                  <SelectTrigger className="text-xs">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="JOB">Full-Time Job</SelectItem>
                    <SelectItem value="INTERNSHIP">Internship</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="location" className="text-xs font-semibold">
                Location <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/60" />
                <Input
                  id="location"
                  placeholder="e.g. Bengaluru, India / Remote"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="pl-9 text-xs"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="applyLink" className="text-xs font-semibold">
                Application URL / Careers Link <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/60" />
                <Input
                  id="applyLink"
                  type="url"
                  placeholder="https://company.careers/job/123"
                  value={formData.applyLink}
                  onChange={(e) => setFormData({ ...formData, applyLink: e.target.value })}
                  className="pl-9 text-xs"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="description" className="text-xs font-semibold">
                Description &amp; Requirements <span className="text-destructive">*</span>
              </Label>
              <textarea
                id="description"
                rows={4}
                placeholder="Brief summary of role responsibilities, tech stack, and eligibility criteria..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full rounded-md border border-border bg-muted/30 p-3 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-foreground"
                required
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="allowReferrals"
                checked={formData.allowReferrals}
                onChange={(e) => setFormData({ ...formData, allowReferrals: e.target.checked })}
                className="rounded border-border h-4 w-4"
              />
              <Label htmlFor="allowReferrals" className="text-xs font-medium cursor-pointer">
                Open to receiving referral requests from fellow alumni
              </Label>
            </div>

            <div className="pt-4 border-t border-border flex gap-3 justify-end">
              <Button variant="outline" size="sm" type="button" onClick={() => router.push("/opportunities")} className="cursor-pointer">
                Cancel
              </Button>
              <Button size="sm" type="submit" disabled={createMutation.isPending} className="cursor-pointer">
                {createMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
                    Posting...
                  </>
                ) : (
                  "Publish Opportunity"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
