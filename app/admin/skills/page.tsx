"use client";

/**
 * Admin Skills Moderation Page
 * /admin/skills
 *
 * Features:
 * - View pending skills awaiting approval
 * - Approve/Reject custom skills
 * - View all skills
 * - Delete skills
 */

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle,
  XCircle,
  Trash2,
  Loader2,
  AlertCircle,
  RefreshCw,
  Shield,
  Clock,
  Check,
  X,
  TrendingUp,
  Users,
} from "lucide-react";
import {
  getPendingSkillsAdmin,
  getAllSkillsAdmin,
  approveSkillAdmin,
  rejectSkillAdmin,
  deleteSkillAdmin,
} from "@/lib/api";
import { Skill } from "@/types";
import { isAdmin } from "@/lib/roleUtils"; // ✅ IMPORTED PROPER UTILITY

type Tab = "pending" | "all";

export default function AdminSkillsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("pending");
  const [pendingSkills, setPendingSkills] = useState<Skill[]>([]);
  const [allSkills, setAllSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isUserAdmin, setIsUserAdmin] = useState(false);

  console.log("[AdminSkills] Render:", {
    activeTab,
    pendingCount: pendingSkills.length,
    allCount: allSkills.length,
    loading,
    error,
  });

  // Check admin access on mount
  useEffect(() => {
    console.log("[AdminSkills] Checking admin access...");
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("alumni_user");

    if (!token || !storedUser) {
      console.log("[AdminSkills] No auth, redirecting to login");
      router.replace("/auth/login");
      return;
    }

    try {
      const user = JSON.parse(storedUser);

      // ✅ PROPER ROLE CHECK: Using the utility function to check the roles array
      const hasAdminRights = isAdmin(user?.roles);

      console.log(
        "[AdminSkills] User roles:",
        user?.roles,
        "Is admin:",
        hasAdminRights,
      );
      setIsUserAdmin(hasAdminRights);

      if (!hasAdminRights) {
        // Kick non-admins out to the dashboard instead of leaving them on a broken page
        console.warn("[AdminSkills] Access Denied: User is not an admin.");
        router.replace("/");
        return;
      }

      loadData(activeTab);
    } catch (err) {
      console.error("[AdminSkills] Failed to parse user:", err);
      router.replace("/auth/login");
    }
  }, [router, activeTab]); // Added activeTab to dependencies for safe re-fetching

  async function loadData(tab: Tab) {
    console.log("[AdminSkills] Loading data for tab:", tab);
    setLoading(true);
    setError(null);

    try {
      if (tab === "pending") {
        const data = await getPendingSkillsAdmin();
        console.log("[AdminSkills] Pending skills loaded:", data.length);
        setPendingSkills(data);
      } else {
        const data = await getAllSkillsAdmin();
        console.log("[AdminSkills] All skills loaded:", data.length);
        setAllSkills(data);
      }
    } catch (err: any) {
      console.error("[AdminSkills] Failed to load data:", err);
      setError(err.message || "Failed to load skills");
    } finally {
      setLoading(false);
    }
  }

  async function handleApprove(skill: Skill) {
    console.log("[AdminSkills] Approving skill:", skill.id, skill.name);
    setActionLoading(skill.id);
    setError(null);
    setSuccessMessage(null);

    try {
      await approveSkillAdmin(skill.id, skill.name);
      console.log("[AdminSkills] Skill approved:", skill.id);
      setSuccessMessage(`"${skill.name}" approved successfully!`);

      // Refresh pending list
      const updated = await getPendingSkillsAdmin();
      setPendingSkills(updated);

      // Also refresh all skills if on that tab
      if (activeTab === "all") {
        const all = await getAllSkillsAdmin();
        setAllSkills(all);
      }
    } catch (err: any) {
      console.error("[AdminSkills] Failed to approve skill:", err);
      setError(err.message || "Failed to approve skill");
    } finally {
      setActionLoading(null);
    }
  }

  async function handleReject(skill: Skill) {
    console.log("[AdminSkills] Rejecting skill:", skill.id, skill.name);
    setActionLoading(skill.id);
    setError(null);
    setSuccessMessage(null);

    try {
      await rejectSkillAdmin(skill.id, skill.name);
      console.log("[AdminSkills] Skill rejected:", skill.id);
      setSuccessMessage(`"${skill.name}" rejected`);

      // Refresh pending list
      const updated = await getPendingSkillsAdmin();
      setPendingSkills(updated);

      // Also refresh all skills if on that tab
      if (activeTab === "all") {
        const all = await getAllSkillsAdmin();
        setAllSkills(all);
      }
    } catch (err: any) {
      console.error("[AdminSkills] Failed to reject skill:", err);
      setError(err.message || "Failed to reject skill");
    } finally {
      setActionLoading(null);
    }
  }

  async function handleDelete(skill: Skill) {
    if (
      !confirm(
        `Are you sure you want to delete "${skill.name}"? This cannot be undone.`,
      )
    ) {
      return;
    }

    console.log("[AdminSkills] Deleting skill:", skill.id, skill.name);
    setActionLoading(skill.id);
    setError(null);
    setSuccessMessage(null);

    try {
      await deleteSkillAdmin(skill.id);
      console.log("[AdminSkills] Skill deleted:", skill.id);
      setSuccessMessage(`"${skill.name}" deleted successfully`);

      // Refresh lists
      if (activeTab === "pending") {
        const updated = await getPendingSkillsAdmin();
        setPendingSkills(updated);
      } else {
        const all = await getAllSkillsAdmin();
        setAllSkills(all);
      }
    } catch (err: any) {
      console.error("[AdminSkills] Failed to delete skill:", err);
      setError(err.message || "Failed to delete skill");
    } finally {
      setActionLoading(null);
    }
  }

  function handleRefresh() {
    console.log("[AdminSkills] Manual refresh clicked");
    loadData(activeTab);
  }

  const stats = {
    pending: pendingSkills.length,
    total: allSkills.length,
    approved: allSkills.filter((s) => s.isApproved).length,
    starter: allSkills.filter((s) => s.isStarter).length,
  };

  // If not admin, don't flash the UI before the redirect happens
  if (!isUserAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-navy-800" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-navy-950 text-white">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gold-500 flex items-center justify-center">
                <Shield className="h-6 w-6 text-navy-950" />
              </div>
              <div>
                <h1 className="font-serif text-2xl font-bold">
                  Skills Moderation
                </h1>
                <p className="text-gray-400 text-sm mt-0.5">
                  Review and approve alumni skill proposals
                </p>
              </div>
            </div>
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-navy-800 hover:bg-navy-700 disabled:opacity-50 transition-colors"
            >
              <RefreshCw
                className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <StatCard
              icon={Clock}
              label="Pending Review"
              value={stats.pending}
              color="amber"
            />
            <StatCard
              icon={CheckCircle}
              label="Approved"
              value={stats.approved}
              color="green"
            />
            <StatCard
              icon={TrendingUp}
              label="Total Skills"
              value={stats.total}
              color="blue"
            />
            <StatCard
              icon={Users}
              label="Starter Skills"
              value={stats.starter}
              color="purple"
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-700">
            <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-sm">Error</p>
              <p className="text-sm mt-0.5">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-400 hover:text-red-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3 text-green-700">
            <CheckCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-sm">Success</p>
              <p className="text-sm mt-0.5">{successMessage}</p>
            </div>
            <button
              onClick={() => setSuccessMessage(null)}
              className="text-green-400 hover:text-green-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Tabs */}
        <div className="flex items-center gap-2 mb-6 border-b border-gray-200">
          <button
            onClick={() => {
              setActiveTab("pending");
            }}
            className={`px-4 py-2 font-medium text-sm transition-colors border-b-2 ${
              activeTab === "pending"
                ? "border-navy-900 text-navy-900"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Pending Review ({pendingSkills.length})
          </button>
          <button
            onClick={() => {
              setActiveTab("all");
            }}
            className={`px-4 py-2 font-medium text-sm transition-colors border-b-2 ${
              activeTab === "all"
                ? "border-navy-900 text-navy-900"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            All Skills ({allSkills.length})
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="h-12 w-12 animate-spin text-navy-800 mb-4" />
            <p className="text-gray-600 font-medium">Loading skills...</p>
          </div>
        ) : activeTab === "pending" ? (
          <PendingSkillsList
            skills={pendingSkills}
            onApprove={handleApprove}
            onReject={handleReject}
            onDelete={handleDelete}
            actionLoading={actionLoading}
          />
        ) : (
          <AllSkillsList
            skills={allSkills}
            onDelete={handleDelete}
            actionLoading={actionLoading}
          />
        )}
      </main>
    </div>
  );
}

// ─── Stat Card Component ──────────────────────────────────────────────────────

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: number;
  color: "amber" | "green" | "blue" | "purple";
}

function StatCard({ icon: Icon, label, value, color }: StatCardProps) {
  const colors = {
    amber: "bg-amber-50 text-amber-700 border-amber-200",
    green: "bg-green-50 text-green-700 border-green-200",
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    purple: "bg-purple-50 text-purple-700 border-purple-200",
  };

  return (
    <div className={`p-4 rounded-xl border ${colors[color]}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide opacity-70">
            {label}
          </p>
          <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
        <Icon className="h-8 w-8 opacity-50" />
      </div>
    </div>
  );
}

// ─── Pending Skills List ──────────────────────────────────────────────────────

interface PendingSkillsListProps {
  skills: Skill[];
  onApprove: (skill: Skill) => void;
  onReject: (skill: Skill) => void;
  onDelete: (skill: Skill) => void;
  actionLoading: number | null;
}

function PendingSkillsList({
  skills,
  onApprove,
  onReject,
  onDelete,
  actionLoading,
}: PendingSkillsListProps) {
  if (skills.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="h-10 w-10 text-green-500" />
        </div>
        <h3 className="font-semibold text-navy-900 text-lg">All Caught Up!</h3>
        <p className="text-gray-500 mt-2">
          No pending skills awaiting approval
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {skills.map((skill) => (
        <PendingSkillCard
          key={skill.id}
          skill={skill}
          onApprove={() => onApprove(skill)}
          onReject={() => onReject(skill)}
          onDelete={() => onDelete(skill)}
          actionLoading={actionLoading === skill.id}
        />
      ))}
    </div>
  );
}

// ─── Pending Skill Card ───────────────────────────────────────────────────────

interface PendingSkillCardProps {
  skill: Skill;
  onApprove: () => void;
  onReject: () => void;
  onDelete: () => void;
  actionLoading: boolean;
}

function PendingSkillCard({
  skill,
  onApprove,
  onReject,
  onDelete,
  actionLoading,
}: PendingSkillCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="font-bold text-navy-900 text-lg">{skill.name}</h3>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
              Pending
            </span>
          </div>

          <div className="flex flex-wrap gap-3 text-sm text-gray-600">
            <div className="flex items-center gap-1.5">
              <span className="font-medium">Course:</span>
              <span>{skill.courseCode}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-medium">Proposed by:</span>
              <span>{skill.createdByAlumniName || "Unknown"}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-medium">Created:</span>
              <span>{new Date(skill.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onApprove}
            disabled={actionLoading}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {actionLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <CheckCircle className="h-4 w-4" />
            )}
            Approve
          </button>

          <button
            onClick={onReject}
            disabled={actionLoading}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {actionLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <XCircle className="h-4 w-4" />
            )}
            Reject
          </button>

          <button
            onClick={onDelete}
            disabled={actionLoading}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {actionLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── All Skills List ──────────────────────────────────────────────────────────

interface AllSkillsListProps {
  skills: Skill[];
  onDelete: (skill: Skill) => void;
  actionLoading: number | null;
}

function AllSkillsList({
  skills,
  onDelete,
  actionLoading,
}: AllSkillsListProps) {
  if (skills.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <TrendingUp className="h-10 w-10 text-gray-400" />
        </div>
        <h3 className="font-semibold text-navy-900 text-lg">No Skills Yet</h3>
        <p className="text-gray-500 mt-2">No skills have been created</p>
      </div>
    );
  }

  const approved = skills.filter((s) => s.isApproved);
  const pending = skills.filter((s) => !s.isApproved);

  return (
    <div className="space-y-6">
      {pending.length > 0 && (
        <section>
          <h3 className="font-bold text-navy-900 mb-3 flex items-center gap-2">
            <Clock className="h-4 w-4 text-amber-500" />
            Pending ({pending.length})
          </h3>
          <div className="space-y-3">
            {pending.map((skill) => (
              <AllSkillCard
                key={skill.id}
                skill={skill}
                onDelete={() => onDelete(skill)}
                actionLoading={actionLoading === skill.id}
              />
            ))}
          </div>
        </section>
      )}

      {approved.length > 0 && (
        <section>
          <h3 className="font-bold text-navy-900 mb-3 flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            Approved ({approved.length})
          </h3>
          <div className="space-y-3">
            {approved.map((skill) => (
              <AllSkillCard
                key={skill.id}
                skill={skill}
                onDelete={() => onDelete(skill)}
                actionLoading={actionLoading === skill.id}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

// ─── All Skill Card ───────────────────────────────────────────────────────────

interface AllSkillCardProps {
  skill: Skill;
  onDelete: () => void;
  actionLoading: boolean;
}

function AllSkillCard({ skill, onDelete, actionLoading }: AllSkillCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-sm transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`w-2 h-2 rounded-full ${skill.isApproved ? "bg-green-500" : "bg-amber-500"}`}
          />
          <div>
            <h4 className="font-medium text-navy-900">{skill.name}</h4>
            <p className="text-xs text-gray-500 mt-0.5">
              {skill.courseCode} • {skill.isStarter ? "Starter" : "Custom"} •
              {skill.createdByAlumniName
                ? ` Proposed by ${skill.createdByAlumniName}`
                : ""}
            </p>
          </div>
        </div>

        <button
          onClick={onDelete}
          disabled={actionLoading}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
        >
          {actionLoading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Trash2 className="h-3.5 w-3.5" />
          )}
          Delete
        </button>
      </div>
    </div>
  );
}
