"use client";

import { useState } from "react";
import {
  X,
  Send,
  FileText,
  MessageSquare,
  Loader2,
  CheckCircle2,
} from "lucide-react";

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

    // Read JWT from localStorage (key: 'token'). Adjust key if your app uses a different one.
    let tokenFromStorage: string | null = null;
    try {
      tokenFromStorage = localStorage.getItem("token");
    } catch {
      tokenFromStorage = null;
    }

    if (!tokenFromStorage) {
      setErrorMsg(
        "Authentication required. Please sign in to submit a referral request.",
      );
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
    } catch (err: any) {
      setErrorMsg(err.message || "Something went wrong. Please try again.");
      setModalState("error");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden animate-modal-in">
        {/* Header */}
        <div className="bg-navy-950 px-6 py-5 flex items-start justify-between">
          <div>
            <p className="text-navy-300 text-xs font-medium uppercase tracking-widest mb-1">
              Referral Request
            </p>
            <h2 className="text-white font-serif text-xl font-bold leading-tight">
              {opportunity.title}
            </h2>
            <p className="text-navy-400 text-sm mt-0.5">
              {opportunity.company}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-navy-400 hover:text-white transition-colors mt-0.5 ml-4 shrink-0"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {modalState === "success" ? (
            <div className="flex flex-col items-center text-center py-6 gap-4">
              <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8 text-green-500" />
              </div>
              <div>
                <h3 className="text-navy-900 font-bold text-lg">
                  Request Sent!
                </h3>
                <p className="text-gray-500 text-sm mt-1 max-w-xs">
                  Your referral request has been submitted. You'll be notified
                  once the referrer responds.
                </p>
              </div>
              <button onClick={onClose} className="btn-primary mt-2 px-8">
                Done
              </button>
            </div>
          ) : modalState === "error" ? (
            <div className="flex flex-col items-center text-center py-6 gap-4">
              <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
                <X className="h-8 w-8 text-red-400" />
              </div>
              <div>
                <h3 className="text-navy-900 font-bold text-lg">
                  Submission Failed
                </h3>
                <p className="text-red-500 text-sm mt-1">{errorMsg}</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setModalState("form")}
                  className="btn-primary px-6"
                >
                  Try Again
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-2 border border-gray-200 rounded-lg text-gray-600 text-sm hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <p className="text-gray-500 text-sm">
                Write a compelling message to the referrer. Be clear about why
                you're a strong candidate.
              </p>

              {/* Message */}
              <div>
                <label className="block text-sm font-semibold text-navy-800 mb-1.5 flex items-center gap-1.5">
                  <MessageSquare className="h-3.5 w-3.5" />
                  Cover Message
                  <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  placeholder="I am very interested in this role because..."
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-navy-400 focus:border-transparent resize-none transition-all"
                  disabled={modalState === "submitting"}
                />
              </div>

              {/* Resume Link */}
              <div>
                <label className="block text-sm font-semibold text-navy-800 mb-1.5 flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5" />
                  Resume Link
                  <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <input
                  type="url"
                  value={resumeLink}
                  onChange={(e) => setResumeLink(e.target.value)}
                  placeholder="https://drive.google.com/your-resume"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-navy-400 focus:border-transparent transition-all"
                  disabled={modalState === "submitting"}
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-1">
                <button
                  type="submit"
                  disabled={modalState === "submitting"}
                  className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {modalState === "submitting" ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Submitting…
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Send Request
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  disabled={modalState === "submitting"}
                  className="px-5 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes modal-in {
          from {
            opacity: 0;
            transform: translateY(16px) scale(0.97);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-modal-in {
          animation: modal-in 0.22s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
      `}</style>
    </div>
  );
}
