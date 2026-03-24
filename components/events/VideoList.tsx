"use client";

// components/events/VideoList.tsx

import { useState } from "react";
import { ExternalLink, Trash2, Loader2, Play } from "lucide-react";
import { EventVideo } from "@/lib/types/events";
import { deleteVideo } from "@/lib/api/events";
import { getToken } from "@/lib/auth";

interface VideoListProps {
  eventId: number;
  videos: EventVideo[];
  isOrganizer: boolean;
  onVideosChanged: () => void;
}

/** Extract YouTube video ID from various URL formats */
function getYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

export default function VideoList({
  eventId,
  videos,
  isOrganizer,
  onVideosChanged,
}: VideoListProps) {
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  if (videos.length === 0 && !isOrganizer) return null;

  const handleDelete = async (video: EventVideo) => {
    if (!confirm("Remove this video?")) return;
    setDeletingId(video.id);
    try {
      const token = getToken() ?? "";
      await deleteVideo(eventId, video.id, token);
      onVideosChanged();
      if (expandedId === video.id) setExpandedId(null);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="card p-6">
      <h2 className="font-serif font-bold text-navy-900 text-lg mb-4 flex items-center gap-2">
        <span>🎬</span> Videos
        <span className="text-sm font-normal text-gray-400">
          ({videos.length})
        </span>
      </h2>

      {videos.length === 0 ? (
        <p className="text-gray-400 text-sm text-center py-6">
          No videos yet. Add some below.
        </p>
      ) : (
        <div className="space-y-3">
          {videos.map((video) => {
            const ytId = getYouTubeId(video.videoUrl);
            const isExpanded = expandedId === video.id;

            return (
              <div
                key={video.id}
                className="rounded-xl border border-gray-100 overflow-hidden"
              >
                {/* Collapsed row */}
                <div className="flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors">
                  {/* Thumbnail / play toggle */}
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : video.id)}
                    className="w-14 h-10 rounded-lg overflow-hidden bg-navy-900 flex items-center justify-center shrink-0 relative group"
                  >
                    {ytId ? (
                      <>
                        <img
                          src={`https://img.youtube.com/vi/${ytId}/mqdefault.jpg`}
                          alt="thumbnail"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                          <Play className="h-4 w-4 text-white fill-white" />
                        </div>
                      </>
                    ) : (
                      <Play className="h-4 w-4 text-white" />
                    )}
                  </button>

                  {/* URL / label */}
                  <span className="text-navy-700 text-sm truncate flex-1">
                    {ytId ? `YouTube · ${ytId}` : video.videoUrl}
                  </span>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    <a
                      href={video.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 text-gray-400 hover:text-navy-700 transition-colors"
                      title="Open in new tab"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                    {isOrganizer && (
                      <button
                        onClick={() => handleDelete(video)}
                        disabled={deletingId === video.id}
                        className="p-1.5 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
                        title="Remove video"
                      >
                        {deletingId === video.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {/* YouTube embed — expanded */}
                {isExpanded && ytId && (
                  <div className="aspect-video bg-black">
                    <iframe
                      src={`https://www.youtube.com/embed/${ytId}?autoplay=1`}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
