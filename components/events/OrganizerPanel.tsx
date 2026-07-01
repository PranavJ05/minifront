"use client";

import { useState } from "react";
import { ImagePlus, Video, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { addPhoto, addVideo } from "@/lib/api/events";
import { getToken } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface OrganizerPanelProps {
  eventId: number;
  onMediaAdded: () => void;
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
      setTimeout(() => setStatus("idle"), 2500);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to add media.");
      setStatus("error");
    }
  };

  return (
    <div className="space-y-4">
      <Tabs value={tab} onValueChange={(v) => resetState(v as Tab)} className="w-full">
        <TabsList className="grid grid-cols-2 bg-muted h-9 p-0.5 w-full">
          <TabsTrigger value="photo" className="h-8 text-xs flex items-center gap-1.5 cursor-pointer">
            <ImagePlus className="h-3.5 w-3.5" />
            Add Photo
          </TabsTrigger>
          <TabsTrigger value="video" className="h-8 text-xs flex items-center gap-1.5 cursor-pointer">
            <Video className="h-3.5 w-3.5" />
            Add Video
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <form onSubmit={handleSubmit} className="space-y-4">
        {tab === "photo" ? (
          <div className="space-y-2">
            <Label htmlFor="photo-upload" className="text-xs font-medium text-foreground">
              Upload event image
            </Label>
            <Input
              id="photo-upload"
              type="file"
              accept="image/png,image/jpeg,image/webp"
              disabled={status === "submitting"}
              onChange={(e) => {
                setSelectedPhoto(e.target.files?.[0] ?? null);
                setStatus("idle");
                setErrorMsg("");
              }}
              className="text-xs bg-card h-9 file:text-xs file:font-semibold file:bg-muted file:text-foreground file:border-0 file:rounded file:px-2.5 file:py-1 cursor-pointer file:cursor-pointer"
            />
            <p className="text-[10px] text-muted-foreground leading-normal">
              Supported formats: JPG, PNG, WEBP. Images are stored directly.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <Label htmlFor="video-url" className="text-xs font-medium text-foreground">
              Video URL
            </Label>
            <Input
              id="video-url"
              type="url"
              value={videoUrl}
              onChange={(e) => {
                setVideoUrl(e.target.value);
                setStatus("idle");
                setErrorMsg("");
              }}
              placeholder="https://youtube.com/watch?v=..."
              required
              disabled={status === "submitting"}
              className="text-xs bg-card h-9"
            />
            <p className="text-[10px] text-muted-foreground leading-normal">
              YouTube video link or any MP4/embedded video URL.
            </p>
          </div>
        )}

        <Button
          type="submit"
          disabled={
            status === "submitting" ||
            (tab === "photo" ? !selectedPhoto : !videoUrl.trim())
          }
          className="w-full cursor-pointer h-9 text-xs"
        >
          {status === "submitting" ? (
            <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Uploading</>
          ) : status === "success" ? (
            <><CheckCircle2 className="h-3.5 w-3.5" /> Added Successfully</>
          ) : (
            "Add Media Content"
          )}
        </Button>
      </form>

      {status === "error" && (
        <Alert variant="destructive" className="py-2.5 px-3">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-xs">{errorMsg}</AlertDescription>
        </Alert>
      )}

      {status === "success" && (
        <Alert className="py-2.5 px-3 border-emerald-500/30 bg-emerald-500/5 text-emerald-500">
          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          <AlertDescription className="text-xs">
            {tab === "photo" ? "Photo" : "Video"} added successfully!
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
