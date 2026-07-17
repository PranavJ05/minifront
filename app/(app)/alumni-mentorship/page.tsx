"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

import { useAuth } from "@/contexts/auth-context";
import { isAlumni, isStudent } from "@/lib/roleUtils";

import { useMentorshipsQuery, useGetApplicationStatusQuery } from "@/hooks/queries/mentorships";

import type { ApplicationStatusResponse, Mentorship } from "@/lib/types/mentorship";

export default function MentorshipPage() {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");

  const roles = user?.roles;
  const { data: mentorships, isLoading: loading } = useMentorshipsQuery();

  const filtered = useMemo(() => {
    if (!mentorships) return [];
    return mentorships.filter((m) => {
      const matchSearch =
        m.title.toLowerCase().includes(search.toLowerCase()) ||
        m.domain.toLowerCase().includes(search.toLowerCase());
      const matchMode = filter === "ALL" || m.mode === filter;
      return matchSearch && matchMode;
    });
  }, [mentorships, search, filter]);

  function renderStudentStatusCard(mentorshipId: number) {
    if (!isStudent(roles)) return null;
    return <ApplicationStatusWrapper mentorshipId={mentorshipId} />;
  }

  return (
    <>
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold">Alumni Mentorship</h1>
            <p className="text-gray-500 mt-2">
              Learn directly from experienced alumni.
            </p>
          </div>

          {isAlumni(roles) && (
            <Link href="/alumni-mentorship/create">
              <button type="button" className="bg-yellow-500 px-5 py-3 rounded font-semibold">
                Create Mentorship
              </button>
            </Link>
          )}
        </div>

        <div className="mt-8 flex gap-4 flex-wrap">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className="border rounded px-4 py-2 flex-1"
          />

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border rounded px-4 py-2"
          >
            <option>ALL</option>
            <option>ONLINE</option>
            <option>OFFLINE</option>
            <option>HYBRID</option>
          </select>
        </div>

        {loading ? (
          <div className="mt-10">Loading...</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
            {filtered.map((m) => (
              <div key={m.id} className="border rounded-xl p-6 shadow-sm">
                <h2 className="text-2xl font-bold">{m.title}</h2>

                <p className="mt-3">{m.domain}</p>
                <p>{m.industry}</p>
                <p>{m.yearsOfExperience} Years Experience</p>

                <p className="mt-3">{m.expertise}</p>
                <p className="mt-3">{m.duration}</p>

                <p>Deadline</p>
                <p>{new Date(m.applicationDeadline).toLocaleDateString()}</p>

                {!m.applicationOpen && (
                  <div className="bg-red-100 text-red-700 mt-4 p-2 rounded">
                    Applications Closed
                  </div>
                )}

                {renderStudentStatusCard(m.id)}

                <Link href={`/alumni-mentorship/${m.id}`}>
                  <button type="button" className="w-full mt-5 bg-blue-600 text-white py-2 rounded">
                    View Details
                  </button>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}

function ApplicationStatusWrapper({ mentorshipId }: { mentorshipId: number }) {
  const { data: status } = useGetApplicationStatusQuery(mentorshipId);
  if (!status) return null;

  if (!status.applied) return null;

  if (!status.finalPublished) {
    return (
      <div className="bg-yellow-50 text-yellow-700 mt-4 p-2 rounded text-sm">
        Application submitted / under review
      </div>
    );
  }

  if (status.selected === true) {
    return (
      <div className="bg-green-50 text-green-700 mt-4 p-2 rounded text-sm">
        {status.message ?? "Congratulations! You are selected."}
      </div>
    );
  }

  if (status.selected === false) {
    return (
      <div className="bg-slate-100 text-slate-700 mt-4 p-2 rounded text-sm">
        {status.message ?? "Not selected this time."}
      </div>
    );
  }

  return null;
}
