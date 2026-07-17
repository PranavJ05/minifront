"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  Pencil,
  Plus,
  Trash2,
  UserPlus,
  Users,
} from "lucide-react";
import {
  deleteBatchAdmin,
  getBatchAdminById,
  listBatchAdmins,
  updateBatchAdmin,
} from "../../../../lib/api/mainAdmin";
import { BatchAdminSummary } from "../../../../lib/types/mainAdmin";

import { useAuth } from "../../../../contexts/auth-context";
import { hasRole } from "../../../../lib/roleUtils";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent } from "../../../../components/ui/card";
import { Input } from "../../../../components/ui/input";
import { Badge } from "../../../../components/ui/badge";
import { Skeleton } from "../../../../components/ui/skeleton";
import { Alert, AlertDescription } from "../../../../components/ui/alert";
import { PromoteAlumniModal } from "../../../../components/main-admin/PromoteAlumniModal";
import { getErrorMessage } from "@/lib/get-error-message";

export default function ManageBatchAdminPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  const [rows, setRows] = useState<BatchAdminSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editBatchYear, setEditBatchYear] = useState("");

  const [dialogOpen, setDialogOpen] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const isMainAdmin = hasRole(user?.roles, "admin");
  const isBatchAdmin = hasRole(user?.roles, "batch_admin");

  useEffect(() => {
    if (isLoading) return;

    if (!isMainAdmin) {
      setLoading(false);
      // Redirect batch admins to the main admin portal
      if (isBatchAdmin) {
        router.replace("/main-admin");
      }
      return;
    }

    void loadBatchAdmins();
  }, [isLoading, isMainAdmin, isBatchAdmin, router]);

  useEffect(() => {
    if (!success) return;
    const timeout = setTimeout(() => setSuccess(null), 4000);
    return () => clearTimeout(timeout);
  }, [success]);

  async function loadBatchAdmins() {
    try {
      setLoading(true);
      setError(null);
      const data = await listBatchAdmins();
      setRows(data);
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Failed to load batch admins"));
    } finally {
      setLoading(false);
    }
  }

  async function handleStartEdit(id: number) {
    try {
      setError(null);
      const row = await getBatchAdminById(id);
      setEditingId(row.id);
      setEditBatchYear(row.batchYear ? String(row.batchYear) : "");
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Failed to load batch admin details"));
    }
  }

  async function handleSaveEdit(id: number) {
    const parsedBatchYear = Number(editBatchYear);
    if (!Number.isInteger(parsedBatchYear) || parsedBatchYear < 1900) {
      setError("Please enter a valid batch year.");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      setSuccess(null);
      await updateBatchAdmin(id, { batchYear: parsedBatchYear });
      setSuccess("Batch admin updated successfully.");
      setEditingId(null);
      setEditBatchYear("");
      await loadBatchAdmins();
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Failed to update batch admin"));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(row: BatchAdminSummary) {
    const confirmed = window.confirm(
      `Remove batch admin privilege for ${row.name}? This keeps alumni identity intact.`,
    );

    if (!confirmed) return;

    try {
      setSubmitting(true);
      setError(null);
      setSuccess(null);
      const message = await deleteBatchAdmin(row.id);
      setSuccess(message);
      await loadBatchAdmins();
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Failed to delete batch admin"));
    } finally {
      setSubmitting(false);
    }
  }

  function handlePromoted(message: string) {
    setError(null);
    setSuccess(message);
    void loadBatchAdmins();
  }

  const sortedRows = useMemo(
    () => [...rows].sort((a, b) => a.name.localeCompare(b.name)),
    [rows],
  );

  const batchAdminAlumniIds = useMemo(
    () => new Set(rows.map((row) => row.alumniId)),
    [rows],
  );

  if (isLoading || loading) {
    return (
      <div className="w-full px-4 sm:px-6 pb-6 space-y-6">
        <div className="py-4 space-y-1">
          <Skeleton className="h-6 w-64 rounded-md" />
          <Skeleton className="h-3 w-96 rounded-md" />
        </div>
        <Skeleton className="h-[280px] rounded-2xl" />
      </div>
    );
  }

  if (!isMainAdmin) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <h1 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Batch Admin Management
        </h1>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {isBatchAdmin
              ? "Forbidden: batch admins cannot manage batch admins."
              : "Forbidden: only the main admin can access this page."}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 pb-6 space-y-6">
      {/* Sticky header */}
      <div className="sticky top-14 z-30 bg-background/95 backdrop-blur-md py-4 border-b border-border/40 -mx-4 sm:-mx-6 px-4 sm:px-6">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-xl font-semibold tracking-tight text-foreground">
              Batch Admin Management
            </h1>
            <p className="text-xs text-muted-foreground">
              Promote existing alumni to batch admin and manage their assigned
              batch year.
            </p>
          </div>
          <Button
            onClick={() => setDialogOpen(true)}
            className="cursor-pointer"
          >
            <UserPlus className="h-4 w-4" />
            Promote Alumni
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {success && (
        <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/40 text-foreground text-sm p-3">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-foreground/70" />
          {success}
        </div>
      )}

      {/* Current batch admins */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            Current Batch Admins
          </h2>
          <Badge variant="secondary" className="text-xs font-medium">
            {sortedRows.length} {sortedRows.length === 1 ? "admin" : "admins"}
          </Badge>
        </div>

        {sortedRows.length === 0 ? (
          <Card className="rounded-xl border border-border bg-card">
            <CardContent className="flex flex-col items-center py-16 text-center">
              <Users className="h-8 w-8 text-muted-foreground/60 mb-3" />
              <p className="font-semibold text-foreground text-sm">
                No batch admins yet
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Promote an alumnus to get started.
              </p>
              <Button
                onClick={() => setDialogOpen(true)}
                variant="outline"
                className="mt-4 cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                Promote Alumni
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            <table className="w-full border-collapse text-left text-xs text-foreground min-w-[720px]">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-[10px] uppercase font-semibold text-muted-foreground tracking-wider">
                  <th className="p-3 pl-4">Name</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Batch Year</th>
                  <th className="p-3">Department</th>
                  <th className="p-3">Profession</th>
                  <th className="p-3 pr-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedRows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors"
                  >
                    <td className="p-3 pl-4 font-semibold text-foreground whitespace-nowrap">
                      {row.name}
                    </td>
                    <td className="p-3 text-muted-foreground">{row.email}</td>
                    <td className="p-3">
                      {editingId === row.id ? (
                        <Input
                          type="number"
                          min={1900}
                          value={editBatchYear}
                          onChange={(e) => setEditBatchYear(e.target.value)}
                          className="h-7 w-24 text-xs"
                          autoFocus
                        />
                      ) : (
                        <span className="text-muted-foreground">
                          {row.batchYear ?? "—"}
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-muted-foreground">
                      {row.department ?? "—"}
                    </td>
                    <td className="p-3 text-muted-foreground">
                      {row.profession ?? "—"}
                    </td>
                    <td className="p-3 pr-4">
                      <div className="flex items-center justify-end gap-2">
                        {editingId === row.id ? (
                          <>
                            <Button
                              size="sm"
                              disabled={submitting}
                              onClick={() => void handleSaveEdit(row.id)}
                              className="cursor-pointer h-7 text-xs"
                            >
                              {submitting ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                "Save"
                              )}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setEditingId(null);
                                setEditBatchYear("");
                              }}
                              className="cursor-pointer h-7 text-xs"
                            >
                              Cancel
                            </Button>
                          </>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => void handleStartEdit(row.id)}
                            className="cursor-pointer h-7 text-xs"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                            Edit
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={submitting}
                          onClick={() => void handleDelete(row)}
                          className="cursor-pointer h-7 text-xs text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Remove
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <PromoteAlumniModal
        open={dialogOpen}
        onOpenChange={setDialogOpen}

        existingAlumniIds={batchAdminAlumniIds}
        onPromoted={handlePromoted}
      />
    </div>
  );
}
