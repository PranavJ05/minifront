"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Users, ArrowRight, Loader2, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAlumniSearchQuery } from "@/hooks/queries/alumni";
import { BACKEND_URL } from "@/lib/config";

interface DirectorySnapshotProps {
  title?: string;
  linkHref?: string;
  linkLabel?: string;
}

const resolveImageUrl = (value: string | null) => {
  if (!value) return null;
  return value.startsWith("http") ? value : `${BACKEND_URL}${value}`;
};

export default function DirectorySnapshot({
  title = "Directory Snapshot",
  linkHref = "/alumni",
  linkLabel = "View All",
}: DirectorySnapshotProps) {
  const {
    data: directoryData,
    isLoading: directoryLoading,
    error: directoryError,
  } = useAlumniSearchQuery();

  const directory = useMemo(() => {
    const data = Array.isArray(directoryData) ? directoryData : [];
    return data.map((item) => ({
      id: item.id,
      name: item.name || "Unknown",
      profession: item.profession ?? null,
      department: item.department ?? null,
      location: item.location ?? null,
      profileImageUrl: item.profileImageUrl ?? null,
    }));
  }, [directoryData]);

  const directoryPreview = useMemo(() => directory.slice(0, 3), [directory]);

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
        <Link
          href={linkHref}
          className="text-xs text-muted-foreground hover:text-foreground font-medium flex items-center gap-1"
        >
          {linkLabel} <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      {directoryLoading ? (
        <Card>
          <CardContent className="flex items-center justify-center py-10 gap-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-xs">Loading directory...</span>
          </CardContent>
        </Card>
      ) : directoryError ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-xs">
            {directoryError?.message || "Could not load directory"}
          </AlertDescription>
        </Alert>
      ) : directoryPreview.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center py-10 text-center gap-1">
            <Users className="h-6 w-6 text-muted-foreground/60 mb-1" />
            <p className="text-xs font-semibold text-foreground">No directory entries</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-3 gap-4">
          {directoryPreview.map((alumni) => {
            const avatar = resolveImageUrl(alumni.profileImageUrl);
            return (
              <Card key={alumni.id} className="p-4 flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-muted overflow-hidden flex items-center justify-center shrink-0 border border-border">
                  {avatar ? (
                    <img src={avatar} alt={alumni.name} className="w-full h-full object-cover" />
                  ) : (
                    <Users className="h-4 w-4 text-muted-foreground/60" />
                  )}
                </div>
                <div className="min-w-0 flex-1 space-y-0.5">
                  <p className="font-semibold text-xs text-foreground truncate">
                    {alumni.name}
                  </p>
                  <p className="text-[10px] text-muted-foreground truncate">
                    {alumni.profession || "Alumni"}
                  </p>
                  <p className="text-[10px] text-muted-foreground/60 truncate">
                    {alumni.location || alumni.department || "Alumni"}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </section>
  );
}
