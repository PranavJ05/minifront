"use client";

// components/events/PhotoGallery.tsx

import { useState } from "react";
import Image from "next/image";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Loader2,
  Plus,
} from "lucide-react";
import { EventPhoto } from "@/lib/types/events";
import { deletePhoto } from "@/lib/api/events";
import { getToken } from "@/lib/auth";

interface PhotoGalleryProps {
  eventId: number;
  photos: EventPhoto[];
  isOrganizer: boolean;
  onPhotosChanged: () => void; // refetch trigger
}

export default function PhotoGallery({
  eventId,
  photos,
  isOrganizer,
  onPhotosChanged,
}: PhotoGalleryProps) {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  if (photos.length === 0 && !isOrganizer) return null;

  const openLightbox = (i: number) => setLightboxIdx(i);
  const closeLightbox = () => setLightboxIdx(null);
  const prev = () =>
    setLightboxIdx((i) =>
      i === null ? 0 : (i - 1 + photos.length) % photos.length,
    );
  const next = () =>
    setLightboxIdx((i) => (i === null ? 0 : (i + 1) % photos.length));

  const handleDelete = async (photo: EventPhoto) => {
    if (!confirm("Remove this photo?")) return;
    setDeletingId(photo.id);
    try {
      const token = getToken() ?? "";
      await deletePhoto(eventId, photo.id, token);
      onPhotosChanged();
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <>
      <div className="card p-6">
        <h2 className="font-serif font-bold text-navy-900 text-lg mb-4 flex items-center gap-2">
          <span>📷</span> Photos
          <span className="text-sm font-normal text-gray-400">
            ({photos.length})
          </span>
        </h2>

        {photos.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-6">
            No photos yet. Add some below.
          </p>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {photos.map((photo, i) => (
              <div key={photo.id} className="relative group">
                <button
                  onClick={() => openLightbox(i)}
                  className="relative w-full aspect-square rounded-xl overflow-hidden block"
                >
                  <Image
                    src={photo.photoUrl}
                    alt={`Photo ${i + 1}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                </button>

                {/* Delete button — only for organizer */}
                {isOrganizer && (
                  <button
                    onClick={() => handleDelete(photo)}
                    disabled={deletingId === photo.id}
                    className="absolute top-1.5 right-1.5 w-7 h-7 bg-red-500 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center shadow-lg disabled:opacity-60"
                    title="Remove photo"
                  >
                    {deletingId === photo.id ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <Trash2 className="h-3 w-3" />
                    )}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxIdx !== null && photos.length > 0 && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={closeLightbox}
        >
          {/* Close */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
          >
            <X className="h-7 w-7" />
          </button>

          {/* Counter */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white/60 text-sm">
            {lightboxIdx + 1} / {photos.length}
          </div>

          {/* Prev */}
          {photos.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              className="absolute left-4 text-white/70 hover:text-white transition-colors p-2"
            >
              <ChevronLeft className="h-8 w-8" />
            </button>
          )}

          {/* Image */}
          <div
            className="relative max-w-4xl max-h-[80vh] w-full mx-16"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={photos[lightboxIdx].photoUrl}
              alt={`Photo ${lightboxIdx + 1}`}
              width={1200}
              height={800}
              className="object-contain max-h-[80vh] w-auto mx-auto rounded-lg"
            />
          </div>

          {/* Next */}
          {photos.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              className="absolute right-4 text-white/70 hover:text-white transition-colors p-2"
            >
              <ChevronRight className="h-8 w-8" />
            </button>
          )}
        </div>
      )}
    </>
  );
}
