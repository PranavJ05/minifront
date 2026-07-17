"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { Play, Trash2, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { EventPhoto, EventVideo } from "@/lib/types/events";
import { deletePhoto, deleteVideo } from "@/lib/api/events";

interface EventMediaCarouselProps {
  eventId: number;
  photos: EventPhoto[];
  videos: EventVideo[];
  isOrganizer: boolean;
  onPhotosChanged: () => void;
  onVideosChanged: () => void;
}

interface MediaItem {
  id: number;
  type: "photo" | "video";
  url: string;
}

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

export default function EventMediaCarousel({
  eventId,
  photos,
  videos,
  isOrganizer,
  onPhotosChanged,
  onVideosChanged,
}: EventMediaCarouselProps) {
  const [playingVideoId, setPlayingVideoId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Combine photos and videos
  const mediaItems: MediaItem[] = [
    ...photos.map((p) => ({ id: p.id, type: "photo" as const, url: p.photoUrl })),
    ...videos.map((v) => ({ id: v.id, type: "video" as const, url: v.videoUrl })),
  ];

  const updateScrollButtons = useCallback(() => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 2);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 2);
    }
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      const timer = setTimeout(updateScrollButtons, 300);
      el.addEventListener("scroll", updateScrollButtons);
      window.addEventListener("resize", updateScrollButtons);
      return () => {
        clearTimeout(timer);
        el.removeEventListener("scroll", updateScrollButtons);
        window.removeEventListener("resize", updateScrollButtons);
      };
    }
  }, [mediaItems.length, updateScrollButtons]);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === "left" 
        ? scrollLeft - clientWidth * 0.75 
        : scrollLeft + clientWidth * 0.75;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  const handleDelete = async (e: React.MouseEvent, item: MediaItem) => {
    e.stopPropagation();
    if (!confirm(`Remove this ${item.type}?`)) return;
    setDeletingId(item.id);
    try {
      if (item.type === "photo") {
        await deletePhoto(eventId, item.id);
        onPhotosChanged();
      } else {
        await deleteVideo(eventId, item.id);
        onVideosChanged();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingId(null);
      setPlayingVideoId(null);
    }
  };

  if (mediaItems.length === 0) return null;

  return (
    <div className="relative w-full space-y-3 select-none">
      <style>{`
        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-none {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* Header controls row */}
      {(canScrollLeft || canScrollRight) && (
        <div className="flex items-center justify-end gap-1.5 pb-1 min-h-[28px]">
          {canScrollLeft && (
            <button
              onClick={() => scroll("left")}
              className="w-7 h-7 rounded-full bg-background border border-border shadow-xs hover:bg-accent flex items-center justify-center text-foreground cursor-pointer transition-all active:scale-95"
              title="Scroll Left"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          )}
          {canScrollRight && (
            <button
              onClick={() => scroll("right")}
              className="w-7 h-7 rounded-full bg-background border border-border shadow-xs hover:bg-accent flex items-center justify-center text-foreground cursor-pointer transition-all active:scale-95"
              title="Scroll Right"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          )}
        </div>
      )}

      {/* Horizontal scroll track */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-2 scrollbar-none snap-x snap-mandatory scroll-smooth w-full"
      >
        {mediaItems.map((item) => {
          const ytId = item.type === "video" ? getYouTubeId(item.url) : null;

          return (
            <div
              key={item.id}
              className="snap-start shrink-0 h-[240px] md:h-[280px] relative group"
            >
              {item.type === "photo" ? (
                <img
                  src={item.url}
                  alt=""
                  className="h-full w-auto object-cover rounded-xl border border-border bg-card shadow-xs select-none"
                />
              ) : (
                <div className="h-full aspect-video rounded-xl border border-border overflow-hidden bg-black shadow-xs relative">
                  {playingVideoId === item.id && ytId ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${ytId}?autoplay=1`}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                      {ytId ? (
                        <img
                          src={`https://img.youtube.com/vi/${ytId}/mqdefault.jpg`}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-muted" />
                      )}
                      <button
                        onClick={() => setPlayingVideoId(item.id)}
                        className="absolute z-20 w-11 h-11 rounded-full bg-white/95 hover:bg-white text-black flex items-center justify-center shadow-lg transition-transform hover:scale-105 cursor-pointer"
                      >
                        <Play className="h-4.5 w-4.5 fill-current ml-0.5" />
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Hover Delete Action */}
              {isOrganizer && (
                <button
                  onClick={(e) => handleDelete(e, item)}
                  disabled={deletingId === item.id}
                  className="absolute top-2.5 right-2.5 z-30 w-7 h-7 bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-60 cursor-pointer"
                  title={`Remove ${item.type}`}
                >
                  {deletingId === item.id ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="h-3.5 w-3.5" />
                  )}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
