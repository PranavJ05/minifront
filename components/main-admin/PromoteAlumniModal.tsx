"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Loader2,
  Search,
  X,
} from "lucide-react";
import { getErrorMessage } from "@/lib/get-error-message";
import {
  createBatchAdmin,
  listAlumniForBatchAdminPicker,
} from "../../lib/api/mainAdmin";
import { AlumniPromotionCandidate } from "../../lib/types/mainAdmin";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Skeleton } from "../ui/skeleton";
import { Alert, AlertDescription } from "../ui/alert";
import { Separator } from "../ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const PAGE_SIZE = 8;

interface PromoteAlumniModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  existingAlumniIds: Set<number>;
  onPromoted: (message: string) => void;
}

export function PromoteAlumniModal({
  open,
  onOpenChange,
  existingAlumniIds,
  onPromoted,
}: PromoteAlumniModalProps) {
  const [alumniCandidates, setAlumniCandidates] = useState<
    AlumniPromotionCandidate[]
  >([]);
  const [alumniLoading, setAlumniLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedCandidate, setSelectedCandidate] =
    useState<AlumniPromotionCandidate | null>(null);
  const [manualAlumniId, setManualAlumniId] = useState("");
  const [batchYear, setBatchYear] = useState("");

  const [search, setSearch] = useState("");
  const [batchYearFilter, setBatchYearFilter] = useState("ALL");
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!open) return;
    resetForm();
    void loadAlumniCandidates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    setPage(1);
  }, [search, batchYearFilter]);

  async function loadAlumniCandidates() {
    try {
      setAlumniLoading(true);
      setError(null);
      const data = await listAlumniForBatchAdminPicker();
      setAlumniCandidates(data);
    } catch (err: unknown) {
      setError(
        getErrorMessage(err, "Failed to load alumni list"),
      );
    } finally {
      setAlumniLoading(false);
    }
  }

  function resetForm() {
    setSelectedCandidate(null);
    setManualAlumniId("");
    setBatchYear("");
    setSearch("");
    setBatchYearFilter("ALL");
    setPage(1);
    setError(null);
  }

  function handleClose() {
    onOpenChange(false);
    resetForm();
  }

  function handleSelectCandidate(candidate: AlumniPromotionCandidate) {
    setSelectedCandidate(candidate);
    setManualAlumniId(String(candidate.alumniId));
    setBatchYear(candidate.batchYear ? String(candidate.batchYear) : "");
  }

  function handleClearSelection() {
    setSelectedCandidate(null);
    setManualAlumniId("");
    setBatchYear("");
  }

  async function handleCreate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const parsedAlumniId = Number(
      selectedCandidate ? selectedCandidate.alumniId : manualAlumniId,
    );
    if (!Number.isInteger(parsedAlumniId) || parsedAlumniId <= 0) {
      setError("Please select a valid alumni.");
      return;
    }

    const parsedBatchYear = batchYear.trim() ? Number(batchYear) : undefined;
    if (
      parsedBatchYear !== undefined &&
      (!Number.isInteger(parsedBatchYear) || parsedBatchYear < 1900)
    ) {
      setError("Please enter a valid batch year.");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      await createBatchAdmin(
        {
          alumniId: parsedAlumniId,
          batchYear: parsedBatchYear,
        },
      );

      onPromoted("Batch admin created successfully.");
      handleClose();
    } catch (err: unknown) {
      setError(
        getErrorMessage(err, "Failed to create batch admin"),
      );
    } finally {
      setSubmitting(false);
    }
  }

  const batchYears = useMemo(() => {
    const values = Array.from(
      new Set(
        alumniCandidates
          .map((candidate) => candidate.batchYear)
          .filter((value): value is number => typeof value === "number"),
      ),
    );
    return values.sort((a, b) => b - a);
  }, [alumniCandidates]);

  const filteredCandidates = useMemo(() => {
    const searchNormalized = search.trim().toLowerCase();

    return alumniCandidates
      .filter((candidate) => {
        if (existingAlumniIds.has(candidate.alumniId)) return false;

        const searchMatch =
          !searchNormalized ||
          candidate.name.toLowerCase().includes(searchNormalized) ||
          candidate.email.toLowerCase().includes(searchNormalized) ||
          (candidate.department ?? "")
            .toLowerCase()
            .includes(searchNormalized) ||
          (candidate.profession ?? "").toLowerCase().includes(searchNormalized);

        const batchYearMatch =
          batchYearFilter === "ALL" ||
          String(candidate.batchYear ?? "") === batchYearFilter;

        return searchMatch && batchYearMatch;
      })
      .sort((a, b) => {
        const yearA = a.batchYear ?? -1;
        const yearB = b.batchYear ?? -1;

        if (yearA !== yearB) {
          return yearB - yearA; // default sort: year desc
        }

        return a.name.localeCompare(b.name); // then name A-Z
      });
  }, [alumniCandidates, existingAlumniIds, search, batchYearFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredCandidates.length / PAGE_SIZE),
  );
  const currentPage = Math.min(page, totalPages);

  const paginatedCandidates = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredCandidates.slice(start, start + PAGE_SIZE);
  }, [filteredCandidates, currentPage]);

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => (next ? onOpenChange(true) : handleClose())}
    >
      <DialogContent className="sm:max-w-3xl p-0 gap-0 overflow-hidden">
        <DialogHeader className="p-5 pb-4 border-b border-border">
          <DialogTitle className="flex items-center gap-2 text-base">
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
            Promote Alumni to Batch Admin
          </DialogTitle>
          <DialogDescription className="text-xs">
            Search for an alumnus, select them, then confirm the batch year
            they&apos;ll manage.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleCreate}>
          <div className="p-5 space-y-4 max-h-[65vh] overflow-y-auto">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-[1fr_160px] gap-3">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/60" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search name, email, department, profession..."
                  className="h-8 pl-8 text-xs bg-muted/30 border-border focus-visible:ring-1"
                />
              </div>

              <Select
                value={batchYearFilter}
                onValueChange={(value) => setBatchYearFilter(value ?? "ALL")}
              >
                <SelectTrigger className="h-8 text-xs bg-muted/30 border-border">
                  <SelectValue placeholder="All Years" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Years</SelectItem>
                  {batchYears.map((year) => (
                    <SelectItem key={year} value={String(year)}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Candidate list */}
            {alumniLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-9 rounded-lg" />
                ))}
              </div>
            ) : paginatedCandidates.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border p-8 text-center">
                <p className="text-sm font-semibold text-foreground">
                  No matching alumni found
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Try a different search term or year.
                </p>
              </div>
            ) : (
              <div className="rounded-lg border border-border bg-card overflow-hidden">
                <div className="grid grid-cols-[1.4fr_60px_1fr_1.6fr] gap-3 px-3 py-2 border-b border-border bg-muted/40 text-[10px] uppercase font-semibold text-muted-foreground tracking-wider">
                  <span>Name</span>
                  <span>Year</span>
                  <span>Class</span>
                  <span>Email</span>
                </div>
                <div className="divide-y divide-border">
                  {paginatedCandidates.map((candidate) => {
                    const isSelected =
                      selectedCandidate?.alumniId === candidate.alumniId;

                    return (
                      <button
                        key={candidate.alumniId}
                        type="button"
                        onClick={() => handleSelectCandidate(candidate)}
                        className={cn(
                          "w-full grid grid-cols-[1.4fr_60px_1fr_1.6fr] gap-3 items-center px-3 py-2.5 text-left text-xs transition-colors cursor-pointer",
                          isSelected ? "bg-accent" : "hover:bg-muted/20",
                        )}
                      >
                        <span className="flex items-center gap-1.5 min-w-0 font-semibold text-foreground">
                          {isSelected && (
                            <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
                          )}
                          <span className="truncate">{candidate.name}</span>
                        </span>
                        <span className="text-muted-foreground">
                          {candidate.batchYear ?? "—"}
                        </span>
                        <span className="text-muted-foreground truncate">
                          {candidate.department ?? "—"}
                        </span>
                        <span className="text-muted-foreground truncate">
                          {candidate.email || "—"}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Pagination */}
            {!alumniLoading && filteredCandidates.length > 0 && (
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>
                  {filteredCandidates.length}{" "}
                  {filteredCandidates.length === 1 ? "result" : "results"}
                </span>
                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    disabled={currentPage === 1}
                    onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                    className="cursor-pointer h-7 w-7"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    disabled={currentPage === totalPages}
                    onClick={() =>
                      setPage((prev) => Math.min(totalPages, prev + 1))
                    }
                    className="cursor-pointer h-7 w-7"
                  >
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <span className="text-right">
                  Page {currentPage} of {totalPages}
                </span>
              </div>
            )}

            <Separator />

            {/* Confirm selection */}
            <div className="space-y-3">
              <Label className="text-xs font-semibold text-foreground">
                Selected Alumni
              </Label>

              <div className="flex h-14 items-center justify-between rounded-lg border border-border bg-muted/30 px-3">
                {selectedCandidate ? (
                  <>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-foreground">
                        {selectedCandidate.name}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {batchYear} • {selectedCandidate.department}
                      </p>
                    </div>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={handleClearSelection}
                      className="h-7 w-7 shrink-0 cursor-pointer"
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </>
                ) : (
                  <div className="text-sm text-muted-foreground">
                    No alumni selected.
                  </div>
                )}
              </div>
            </div>
          </div>

          <DialogFooter className="p-5 pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="cursor-pointer"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Promoting...
                </>
              ) : (
                "Confirm Promote"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
