"use client";

// components/events/OrganizerPanel.tsx

import { useState } from "react";
import { ImagePlus, Video, Loader2, CheckCircle2, X } from "lucide-react";
import { addPhoto, addVideo } from "@/lib/api/events";
import { getToken } from "@/lib/auth";

interface OrganizerPanelProps {
  eventId: number;
  onMediaAdded: () => void; // triggers refetch in parent
}

type Tab = "photo" | "video";
type Status = "idle" | "submitting" | "success" | "error";

export default function OrganizerPanel({
  eventId,
  onMediaAdded,
}: OrganizerPanelProps) {
  const [tab, setTab] = useState<Tab>("photo");
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const placeholder =
    tab === "photo"
      ? "https://drive.google.com/… or https://i.imgur.com/…"
      : "https://youtube.com/watch?v=… or any video URL";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    setStatus("submitting");
    setErrorMsg("");
    try {
      const token = getToken() ?? "";
      const res =
        tab === "photo"
          ? await addPhoto(eventId, url.trim(), token)
          : await addVideo(eventId, url.trim(), token);

      if (!res.success) throw new Error(res.message);
      setStatus("success");
      setUrl("");
      onMediaAdded();
      // Reset success indicator after 2s
      setTimeout(() => setStatus("idle"), 2000);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to add media.");
      setStatus("error");
    }
  };

  return (
    <div className="card p-6 border-2 border-dashed border-navy-200">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-full bg-navy-100 flex items-center justify-center">
          <span className="text-sm">🛠️</span>
        </div>
        <div>
          <p className="text-xs font-semibold text-navy-500 uppercase tracking-wide">
            Organizer Tools
          </p>
          <p className="text-xs text-gray-400">Only visible to you</p>
        </div>
      </div>

      {/* Tab toggle */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => {
            setTab("photo");
            setStatus("idle");
            setUrl("");
          }}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-medium border-2 transition-all ${
            tab === "photo"
              ? "border-navy-700 bg-navy-50 text-navy-800"
              : "border-gray-200 text-gray-500 hover:border-navy-300"
          }`}
        >
          <ImagePlus className="h-4 w-4" /> Add Photo
        </button>
        <button
          onClick={() => {
            setTab("video");
            setStatus("idle");
            setUrl("");
          }}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-medium border-2 transition-all ${
            tab === "video"
              ? "border-navy-700 bg-navy-50 text-navy-800"
              : "border-gray-200 text-gray-500 hover:border-navy-300"
          }`}
        >
          <Video className="h-4 w-4" /> Add Video
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="url"
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            setStatus("idle");
          }}
          placeholder={placeholder}
          required
          className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-navy-400 focus:border-transparent transition-all"
          disabled={status === "submitting"}
        />
        <button
          type="submit"
          disabled={status === "submitting" || !url.trim()}
          className="btn-primary px-4 flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed shrink-0"
        >
          {status === "submitting" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : status === "success" ? (
            <CheckCircle2 className="h-4 w-4 text-green-300" />
          ) : (
            "Add"
          )}
        </button>
      </form>

      {/* Error feedback */}
      {status === "error" && (
        <p className="mt-2 text-xs text-red-500 flex items-center gap-1">
          <X className="h-3 w-3" /> {errorMsg}
        </p>
      )}

      {/* Success feedback */}
      {status === "success" && (
        <p className="mt-2 text-xs text-green-600 flex items-center gap-1">
          <CheckCircle2 className="h-3 w-3" />
          {tab === "photo" ? "Photo" : "Video"} added successfully!
        </p>
      )}
    </div>
  );
}
