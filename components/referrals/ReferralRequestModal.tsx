"use client";

import { useState } from "react";
import { Send, FileText, MessageSquare, Loader2, CheckCircle2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface Opportunity {
  id: number;
  title: string;
  company: string;
  referrerUserId?: number;
}

interface ReferralRequestModalProps {
  opportunity: Opportunity;
  referrerUserId: number;
  onClose: () => void;
}

type ModalState = "form" | "submitting" | "success" | "error";

export default function ReferralRequestModal({
  opportunity,
  referrerUserId,
  onClose,
}: ReferralRequestModalProps) {
  const [message, setMessage] = useState("");
  const [resumeLink, setResumeLink] = useState("");
  const [modalState, setModalState] = useState<ModalState>("form");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalState("submitting");
    setErrorMsg("");

    let tokenFromStorage: string | null = null;
    try {
      tokenFromStorage = localStorage.getItem("token");
    } catch {
      tokenFromStorage = null;
    }

    if (!tokenFromStorage) {
      setErrorMsg("Authentication required. Please sign in to submit a referral request.");
      setModalState("error");
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/referrals/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenFromStorage}`,
        },
        body: JSON.stringify({
          opportunityId: opportunity.id,
          referrerUserId: referrerUserId,
          message: message.trim() || undefined,
          resumeLink: resumeLink.trim() || undefined,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.message || `Error ${res.status}`);
      }

      setModalState("success");
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setModalState("error");
    }
  };

  const handleClose = () => {
    if (modalState === "submitting") return;
    onClose();
  };

  return (
    <Dialog open onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg p-0 overflow-hidden">
        {/* Header */}
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border">
          <div className="flex items-start justify-between">
            <div>
              <Badge variant="secondary" className="text-[10px] font-semibold uppercase tracking-wider mb-2">
                Referral Request
              </Badge>
              <DialogTitle className="text-lg font-bold text-foreground leading-tight">
                {opportunity.title}
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground mt-0.5">
                {opportunity.company}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Body */}
        <div className="p-6">
          {modalState === "success" ? (
            <div className="flex flex-col items-center text-center py-6 gap-4">
              <div className="w-14 h-14 rounded-full bg-green-500/10 flex items-center justify-center">
                <CheckCircle2 className="h-7 w-7 text-green-500" />
              </div>
              <div>
                <h3 className="font-bold text-foreground text-base">Request Sent!</h3>
                <p className="text-muted-foreground text-sm mt-1 max-w-xs">
                  Your referral request has been submitted. You'll be notified once the referrer responds.
                </p>
              </div>
              <Button onClick={onClose} className="mt-2 cursor-pointer">
                Done
              </Button>
            </div>
          ) : modalState === "error" ? (
            <div className="flex flex-col items-center text-center py-6 gap-4">
              <div className="w-14 h-14 rounded-full bg-destructive/10 flex items-center justify-center">
                <span className="text-destructive text-2xl font-bold">!</span>
              </div>
              <div>
                <h3 className="font-bold text-foreground text-base">Submission Failed</h3>
                <p className="text-destructive text-sm mt-1">{errorMsg}</p>
              </div>
              <div className="flex gap-3">
                <Button onClick={() => setModalState("form")} className="cursor-pointer">
                  Try Again
                </Button>
                <Button variant="outline" onClick={onClose} className="cursor-pointer">
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <p className="text-muted-foreground text-sm">
                Write a compelling message to the referrer. Be clear about why you're a strong candidate.
              </p>

              {/* Cover Message */}
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-foreground flex items-center gap-1.5">
                  <MessageSquare className="h-3.5 w-3.5 text-muted-foreground" />
                  Cover Message
                  <span className="text-muted-foreground font-normal text-xs">(optional)</span>
                </Label>
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  placeholder="I am very interested in this role because..."
                  className="resize-none text-sm"
                  disabled={modalState === "submitting"}
                />
              </div>

              {/* Resume Link */}
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-foreground flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                  Resume Link
                  <span className="text-muted-foreground font-normal text-xs">(optional)</span>
                </Label>
                <Input
                  type="url"
                  value={resumeLink}
                  onChange={(e) => setResumeLink(e.target.value)}
                  placeholder="https://drive.google.com/your-resume"
                  className="text-sm"
                  disabled={modalState === "submitting"}
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-1">
                <Button
                  type="submit"
                  disabled={modalState === "submitting"}
                  className="flex-1 cursor-pointer"
                >
                  {modalState === "submitting" ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Send Request
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={modalState === "submitting"}
                  className="cursor-pointer"
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
