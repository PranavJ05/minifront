"use client";

import { useEffect, useState } from "react";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

import SessionCard from "@/components/alumni-sessions/SessionCard";

import { AlumniSession } from "@/lib/types/alumniSession";

import { fetchAllSessions } from "@/lib/api/alumniSessions";
import { getUserRole } from "@/lib/auth";
import { isAlumni, isStudent } from "@/lib/roleUtils";

import { getToken } from "@/lib/auth";
import Link from "next/link";
export default function AlumniSessionsPage() {
  const [sessions, setSessions] = useState<AlumniSession[]>([]);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const token = getToken() ?? "";

        const data = await fetchAllSessions(token);
        console.log(data);

        setSessions(data);
      } catch (err: unknown) {
        setError(
          err instanceof Error ? err.message : "Failed to load sessions",
        );
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  useEffect(() => {
    const role = getUserRole();

    console.log(role);

    setUserRole(role);
  }, []);
  const is_Alumni = isAlumni(userRole);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-navy-950 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl text-white font-bold">Alumni Sessions</h1>
          {is_Alumni && (
            <Link href="/alumni-sessions/create">
              <button
                className="
        bg-yellow-500
        px-4
        py-2
        rounded
        mt-4
        font-semibold
      "
              >
                Create Session
              </button>
            </Link>
          )}

          <p className="text-gray-400 mt-2">
            Browse and register for alumni sessions.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        {loading && <p>Loading...</p>}

        {error && <p>{error}</p>}

        {!loading && !error && (
          <div className="grid md:grid-cols-2 gap-6">
            {sessions.map((session) => (
              <SessionCard key={session.id} session={session} />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
