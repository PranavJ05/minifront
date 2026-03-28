"use client";

// components/events/OrganizerPanel.tsx

import { useMemo, useState } from "react";
import { ImagePlus, Video, Loader2, CheckCircle2, X, Upload } from "lucide-react";
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
  const [videoUrl, setVideoUrl] = useState("");
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const photoLabel = useMemo(() => {
    if (!selectedPhoto) return "Choose JPG, PNG, or WEBP";
    return selectedPhoto.name;
  }, [selectedPhoto]);

  const resetState = (nextTab: Tab) => {
    setTab(nextTab);
    setStatus("idle");
    setErrorMsg("");
    setVideoUrl("");
    setSelectedPhoto(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (tab === "photo" && !selectedPhoto) return;
    if (tab === "video" && !videoUrl.trim()) return;

    setStatus("submitting");
    setErrorMsg("");

    try {
      const token = getToken() ?? "";
      const res =
        tab === "photo"
          ? await addPhoto(eventId, selectedPhoto as File, token)
          : await addVideo(eventId, videoUrl.trim(), token);

      if (!res.success) throw new Error(res.message);
      setStatus("success");
      setVideoUrl("");
      setSelectedPhoto(null);
      onMediaAdded();
      setTimeout(() => setStatus("idle"), 2000);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to add media.");
      setStatus("error");
    }
  };

  return (
    <div className="card p-6 border-2 border-dashed border-navy-200">
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

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => resetState("photo")}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-medium border-2 transition-all ${
            tab === "photo"
              ? "border-navy-700 bg-navy-50 text-navy-800"
              : "border-gray-200 text-gray-500 hover:border-navy-300"
          }`}
        >
          <ImagePlus className="h-4 w-4" /> Add Photo
        </button>
        <button
          onClick={() => resetState("video")}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-medium border-2 transition-all ${
            tab === "video"
              ? "border-navy-700 bg-navy-50 text-navy-800"
              : "border-gray-200 text-gray-500 hover:border-navy-300"
          }`}
        >
          <Video className="h-4 w-4" /> Add Video
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        {tab === "photo" ? (
          <label className="block">
            <span className="block text-sm font-medium text-navy-800 mb-2">
              Upload event image
            </span>
            <div className="flex items-center gap-2">
              <div className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 bg-white truncate">
                {photoLabel}
              </div>
              <div className="relative shrink-0">
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  disabled={status === "submitting"}
                  onChange={(e) => {
                    setSelectedPhoto(e.target.files?.[0] ?? null);
                    setStatus("idle");
                    setErrorMsg("");
                  }}
                />
                <div className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-navy-700 flex items-center gap-2 bg-white hover:bg-gray-50 transition-colors">
                  <Upload className="h-4 w-4" /> Browse
                </div>
              </div>
            </div>
            <p className="mt-2 text-xs text-gray-400">
              Images are uploaded as files. Supported formats: JPG, PNG, WEBP.
            </p>
          </label>
        ) : (
          <div>
            <label className="block text-sm font-medium text-navy-800 mb-2">
              Video URL
            </label>
            <input
              type="url"
              value={videoUrl}
              onChange={(e) => {
                setVideoUrl(e.target.value);
                setStatus("idle");
                setErrorMsg("");
              }}
              placeholder="https://youtube.com/watch?v=… or any video URL"
              required
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-navy-400 focus:border-transparent transition-all"
              disabled={status === "submitting"}
            />
          </div>
        )}

        <button
          type="submit"
          disabled={
            status === "submitting" ||
            (tab === "photo" ? !selectedPhoto : !videoUrl.trim())
          }
          className="btn-primary px-4 flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
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

      {status === "error" && (
        <p className="mt-2 text-xs text-red-500 flex items-center gap-1">
          <X className="h-3 w-3" /> {errorMsg}
        </p>
      )}

      {status === "success" && (
        <p className="mt-2 text-xs text-green-600 flex items-center gap-1">
          <CheckCircle2 className="h-3 w-3" />
          {tab === "photo" ? "Photo" : "Video"} added successfully!
        </p>
      )}
    </div>
  );
}
