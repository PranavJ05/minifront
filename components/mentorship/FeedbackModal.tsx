"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useSubmitFeedbackMutation } from "@/hooks/queries/mentorships";
import { Star, Loader2 } from "lucide-react";

interface FeedbackModalProps {
  applicationId: number;
  isOpen: boolean;
  onClose: () => void;
}

export function FeedbackModal({ applicationId, isOpen, onClose }: FeedbackModalProps) {
  const [rating, setRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [comment, setComment] = useState("");
  const mutation = useSubmitFeedbackMutation();

  if (!isOpen) return null;

  async function handleSubmit() {
    if (rating === 0) return;
    try {
      await mutation.mutateAsync({
        applicationId,
        rating,
        comment: comment.trim() || undefined,
      });
      setRating(0);
      setComment("");
      onClose();
    } catch {
      // handled by query client
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Submit Feedback</DialogTitle>
          <DialogDescription>
            How was your mentorship experience?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Rating</Label>
            <div className="flex justify-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredStar(star)}
                  onMouseLeave={() => setHoveredStar(0)}
                  className="p-1 transition-colors cursor-pointer"
                >
                  <Star
                    className={`h-8 w-8 ${
                      star <= (hoveredStar || rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-muted-foreground/30"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="feedback-comment" className="text-xs text-muted-foreground">
              Comment <span className="text-muted-foreground/60">(optional)</span>
            </Label>
            <Textarea
              id="feedback-comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience..."
              rows={4}
              maxLength={2000}
              className="resize-none"
            />
          </div>
        </div>

        <DialogFooter showCloseButton>
          <Button
            onClick={handleSubmit}
            disabled={rating === 0 || mutation.isPending}
            className="cursor-pointer"
          >
            {mutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Submit Feedback
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
