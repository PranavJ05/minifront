"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  GraduationCap,
  Mail,
  Clock,
  CheckCircle,
  ArrowLeft,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { usePendingStatusQuery } from "@/hooks/queries/auth";

type PendingUser = {
  id: string;
  name: string;
  email: string;
  department: string;
  batchYear: string | number;
  status: string;
};

function readPendingData(): { user: PendingUser | null; userId: number | null } {
  if (typeof window === "undefined") return { user: null, userId: null };
  try {
    const raw = localStorage.getItem("pendingUserData");
    if (!raw) return { user: null, userId: null };
    const parsed = JSON.parse(raw) as { user?: PendingUser; status?: string };
    if (!parsed.user) return { user: null, userId: null };
    const userId = Number(parsed.user.id) || null;
    return { user: parsed.user, userId };
  } catch {
    return { user: null, userId: null };
  }
}

function clearPendingData() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("pendingUserData");
}

export default function PendingPage() {
  const router = useRouter();
  const [user, setUser] = useState<PendingUser | null>(null);
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const data = readPendingData();
    if (!data.user) {
      router.replace("/auth/login");
      return;
    }
    setUser(data.user);
    setUserId(data.userId);
  }, [router]);

  const { data: isPending, isFetching, isError, refetch } = usePendingStatusQuery(userId);

  useEffect(() => {
    if (isPending === false) {
      clearPendingData();
      router.push("/auth/login?approved=true");
    }
  }, [isPending, router]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-navy-950 px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-gold-500 p-1.5 rounded-lg">
              <GraduationCap className="h-5 w-5 text-navy-950" />
            </div>
            <span className="font-serif font-bold text-white text-lg">ALUMNI</span>
          </Link>

          <Link
            href="/auth/login"
            className="flex items-center gap-1.5 text-gray-400 hover:text-white text-sm transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Login
          </Link>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-14">
        <div className="card p-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-amber-100 rounded-full mb-6">
            <Clock className="h-10 w-10 text-amber-500" />
          </div>

          <h1 className="font-serif text-3xl font-bold text-navy-900 mb-3">
            You&apos;re on the List!
          </h1>

          <p className="text-gray-600 leading-relaxed mb-6 max-w-md mx-auto">
            Your account has been submitted and is currently awaiting approval
            from our admin team. This process typically takes
            <span className="font-semibold text-navy-800"> 1–3 business days</span>.
          </p>

          {isError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 text-left">
              <p className="font-semibold mb-1 flex items-center gap-1.5">
                <AlertCircle className="h-4 w-4" /> Status check failed
              </p>
              <p className="mb-3">We couldn&apos;t verify your approval status right now.</p>
              <button
                type="button"
                onClick={() => refetch()}
                className="flex items-center gap-1.5 text-red-700 underline hover:no-underline"
              >
                <RefreshCw className="h-3.5 w-3.5" /> Try again
              </button>
            </div>
          )}

          {isFetching && (
            <div className="mb-6 flex items-center justify-center gap-2 text-sm text-gray-400">
              <RefreshCw className="h-4 w-4 animate-spin" />
              Checking approval status...
            </div>
          )}

          {user && (
            <div className="bg-gray-100 rounded-lg p-6 mb-8 text-left max-w-md mx-auto">
              <div className="mb-2 font-semibold text-navy-900">Your Details:</div>
              <div className="mb-1"><b>Name:</b> {user.name}</div>
              <div className="mb-1"><b>Email:</b> {user.email}</div>
              <div className="mb-1"><b>Department:</b> {user.department}</div>
              <div className="mb-1"><b>Batch Year:</b> {user.batchYear}</div>
              <div className="mb-1"><b>Status:</b> <span className="text-amber-600">{user.status}</span></div>
              <div className="mb-1"><b>User ID:</b> {user.id}</div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            {[
              { icon: CheckCircle, label: "Account Created", done: true },
              { icon: Clock, label: "Admin Review", done: false },
              { icon: Mail, label: "Email Notification", done: false },
            ].map(({ icon: Icon, label, done }, i) => (
              <div key={label} className="flex items-center gap-2">
                <div
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
                    done
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </div>
                {i < 2 && (
                  <span className="hidden sm:block text-gray-300 text-lg">→</span>
                )}
              </div>
            ))}
          </div>

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-700 text-left">
            <p className="font-semibold mb-1">What happens next?</p>
            <p className="leading-relaxed">
              Once your account is approved, you&apos;ll be automatically redirected
              to the login page. Then simply sign in with your credentials.
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-8">
          Questions? Contact us at{" "}
          <a
            href="mailto:alumni@university.edu"
            className="text-gold-600 hover:underline"
          >
            alumni@university.edu
          </a>
        </p>
      </div>
    </div>
  );
}
