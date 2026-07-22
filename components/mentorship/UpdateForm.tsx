"use client";

import { useState } from "react";
import { usePostUpdateMutation } from "@/hooks/queries/mentorships";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Send } from "lucide-react";

export function UpdateForm({ applicationId }: { applicationId: number }) {
  const [content, setContent] = useState("");
  const [isMilestone, setIsMilestone] = useState(false);
  const mutation = usePostUpdateMutation();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (content.trim().length < 10) return;
    try {
      await mutation.mutateAsync({ applicationId, content: content.trim(), isMilestone });
      setContent("");
      setIsMilestone(false);
    } catch {
      // handled by query client
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="space-y-1.5">
        <Label htmlFor="update-content" className="text-xs text-muted-foreground">
          Progress Update
        </Label>
        <Textarea
          id="update-content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What progress has the mentee made?"
          rows={3}
          className="resize-none"
        />
      </div>
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
          <input
            type="checkbox"
            checked={isMilestone}
            onChange={(e) => setIsMilestone(e.target.checked)}
            className="rounded border-border"
          />
          Mark as milestone
        </label>
        <Button
          type="submit"
          disabled={mutation.isPending || content.trim().length < 10}
          size="sm"
          className="cursor-pointer"
        >
          {mutation.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
          Post Update
        </Button>
      </div>
    </form>
  );
}
