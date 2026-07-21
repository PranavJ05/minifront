"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle,
  XCircle,
  Trash2,
  Loader2,
  Shield,
  Clock,
  TrendingUp,
  Users,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";

import {
  getPendingSkillsAdmin,
  getAllSkillsAdmin,
  approveSkillAdmin,
  rejectSkillAdmin,
  deleteSkillAdmin,
} from "@/lib/api";
import type { Skill } from "@/types";
import { isMainAdmin } from "@/lib/roleUtils";
import { useAuth } from "@/contexts/auth-context";
import { getErrorMessage } from "@/lib/get-error-message";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type TabValue = "pending" | "all";

export default function AdminSkillsPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<TabValue>("pending");
  const [pendingSkills, setPendingSkills] = useState<Skill[]>([]);
  const [allSkills, setAllSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Skill | null>(null);

  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated || !user) {
      router.replace("/auth/login");
      return;
    }

    if (!isMainAdmin(user.roles)) {
      router.replace("/main-admin");
      return;
    }

    async function loadData(tab: TabValue) {
      setLoading(true);
      try {
        if (tab === "pending") {
          setPendingSkills(await getPendingSkillsAdmin());
        } else {
          setAllSkills(await getAllSkillsAdmin());
        }
      } catch (err: unknown) {
        toast.error(getErrorMessage(err, "Failed to load skills"));
      } finally {
        setLoading(false);
      }
    }

    loadData(activeTab);
  }, [authLoading, isAuthenticated, user, router, activeTab]);

  async function handleApprove(skill: Skill) {
    setActionLoading(skill.id);
    try {
      await approveSkillAdmin(skill.id, skill.name);
      toast.success(`"${skill.name}" approved`);
      const updated = await getPendingSkillsAdmin();
      setPendingSkills(updated);
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "Failed to approve skill"));
    } finally {
      setActionLoading(null);
    }
  }

  async function handleReject(skill: Skill) {
    setActionLoading(skill.id);
    try {
      await rejectSkillAdmin(skill.id, skill.name);
      toast.success(`"${skill.name}" rejected`);
      const updated = await getPendingSkillsAdmin();
      setPendingSkills(updated);
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "Failed to reject skill"));
    } finally {
      setActionLoading(null);
    }
  }

  async function handleDelete(skill: Skill) {
    setDeleteTarget(null);
    setActionLoading(skill.id);
    try {
      await deleteSkillAdmin(skill.id);
      toast.success(`"${skill.name}" deleted`);
      if (activeTab === "pending") {
        setPendingSkills(await getPendingSkillsAdmin());
      } else {
        setAllSkills(await getAllSkillsAdmin());
      }
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "Failed to delete skill"));
    } finally {
      setActionLoading(null);
    }
  }

  function handleRefresh() {
    async function refresh() {
      setLoading(true);
      try {
        if (activeTab === "pending") {
          setPendingSkills(await getPendingSkillsAdmin());
        } else {
          setAllSkills(await getAllSkillsAdmin());
        }
      } catch (err: unknown) {
        toast.error(getErrorMessage(err, "Failed to load skills"));
      } finally {
        setLoading(false);
      }
    }
    refresh();
  }

  const stats = {
    pending: pendingSkills.length,
    total: allSkills.length,
    approved: allSkills.filter((s) => s.isApproved).length,
    starter: allSkills.filter((s) => s.isStarter).length,
  };

  if (authLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Shield className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-foreground">
              Skills Moderation
            </h1>
            <p className="text-sm text-muted-foreground">
              Review and approve alumni skill proposals
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={Clock} label="Pending Review" value={stats.pending} />
        <StatCard icon={CheckCircle} label="Approved" value={stats.approved} />
        <StatCard icon={TrendingUp} label="Total Skills" value={stats.total} />
        <StatCard icon={Users} label="Starter Skills" value={stats.starter} />
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabValue)}>
        <TabsList>
          <TabsTrigger value="pending">
            Pending Review ({pendingSkills.length})
          </TabsTrigger>
          <TabsTrigger value="all">
            All Skills ({allSkills.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-6">
          {loading ? (
            <LoadingState />
          ) : pendingSkills.length === 0 ? (
            <EmptyState
              icon={CheckCircle}
              title="All Caught Up!"
              description="No pending skills awaiting approval"
            />
          ) : (
            <div className="space-y-4">
              {pendingSkills.map((skill) => (
                <PendingSkillCard
                  key={skill.id}
                  skill={skill}
                  onApprove={() => handleApprove(skill)}
                  onReject={() => handleReject(skill)}
                  onDelete={() => setDeleteTarget(skill)}
                  isLoading={actionLoading === skill.id}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="all" className="mt-6">
          {loading ? (
            <LoadingState />
          ) : allSkills.length === 0 ? (
            <EmptyState
              icon={TrendingUp}
              title="No Skills Yet"
              description="No skills have been created"
            />
          ) : (
            <AllSkillsList
              skills={allSkills}
              onDelete={(s) => setDeleteTarget(s)}
              actionLoading={actionLoading}
            />
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Skill</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &ldquo;{deleteTarget?.name}&rdquo;? This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteTarget && handleDelete(deleteTarget)}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function StatCard({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: number }) {
  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {label}
          </span>
          <Icon className="h-5 w-5 text-muted-foreground/40" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
}

function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <Loader2 className="h-10 w-10 animate-spin text-muted-foreground mb-4" />
      <p className="text-sm text-muted-foreground font-medium">Loading skills...</p>
    </div>
  );
}

function EmptyState({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center py-16">
      <div className="size-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
        <Icon className="h-8 w-8 text-muted-foreground/60" />
      </div>
      <h3 className="font-semibold text-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground mt-1">{description}</p>
    </div>
  );
}

function PendingSkillCard({
  skill,
  onApprove,
  onReject,
  onDelete,
  isLoading,
}: {
  skill: Skill;
  onApprove: () => void;
  onReject: () => void;
  onDelete: () => void;
  isLoading: boolean;
}) {
  return (
    <Card>
      <CardContent className="py-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="font-semibold text-foreground">{skill.name}</h3>
              <Badge variant="outline" className="text-amber-600 bg-amber-500/10 border-amber-200">
                Pending
              </Badge>
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
              <span>
                <span className="font-medium text-foreground">Course:</span> {skill.courseCode}
              </span>
              <span>
                <span className="font-medium text-foreground">Proposed by:</span>{" "}
                {skill.createdByAlumniName || "Unknown"}
              </span>
              <span>
                <span className="font-medium text-foreground">Created:</span>{" "}
                {new Date(skill.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button size="sm" onClick={onApprove} disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle className="h-4 w-4" />
              )}
              Approve
            </Button>
            <Button variant="secondary" size="sm" onClick={onReject} disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <XCircle className="h-4 w-4" />
              )}
              Reject
            </Button>
            <Button variant="ghost" size="icon-sm" onClick={onDelete} disabled={isLoading}>
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function AllSkillsList({
  skills,
  onDelete,
  actionLoading,
}: {
  skills: Skill[];
  onDelete: (skill: Skill) => void;
  actionLoading: number | null;
}) {
  const approved = skills.filter((s) => s.isApproved);
  const pending = skills.filter((s) => !s.isApproved);

  return (
    <div className="space-y-6">
      {pending.length > 0 && (
        <section>
          <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <Clock className="h-4 w-4 text-amber-500" />
            Pending ({pending.length})
          </h3>
          <div className="space-y-3">
            {pending.map((skill) => (
              <AllSkillCard
                key={skill.id}
                skill={skill}
                onDelete={() => onDelete(skill)}
                isLoading={actionLoading === skill.id}
              />
            ))}
          </div>
        </section>
      )}

      {approved.length > 0 && (
        <section>
          <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            Approved ({approved.length})
          </h3>
          <div className="space-y-3">
            {approved.map((skill) => (
              <AllSkillCard
                key={skill.id}
                skill={skill}
                onDelete={() => onDelete(skill)}
                isLoading={actionLoading === skill.id}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function AllSkillCard({
  skill,
  onDelete,
  isLoading,
}: {
  skill: Skill;
  onDelete: () => void;
  isLoading: boolean;
}) {
  return (
    <Card size="sm">
      <CardContent className="py-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className={`size-2 shrink-0 rounded-full ${
                skill.isApproved ? "bg-green-500" : "bg-amber-500"
              }`}
            />
            <div className="min-w-0">
              <h4 className="text-sm font-medium text-foreground truncate">{skill.name}</h4>
              <p className="text-xs text-muted-foreground truncate">
                {skill.courseCode} &bull; {skill.isStarter ? "Starter" : "Custom"}
                {skill.createdByAlumniName ? ` \u2022 Proposed by ${skill.createdByAlumniName}` : ""}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="xs" onClick={onDelete} disabled={isLoading} className="shrink-0">
            {isLoading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Trash2 className="h-3.5 w-3.5 text-destructive" />
            )}
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
