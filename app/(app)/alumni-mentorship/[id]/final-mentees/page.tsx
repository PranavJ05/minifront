"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

import {
  getFinalMentees,
  getMentorship,
  getMyMentorships,
} from "@/lib/api/mentorship";
import { getToken, getUserRole } from "@/lib/auth";
import { isAlumni } from "@/lib/roleUtils";
import { Mentorship, MentorshipApplication } from "@/lib/types/mentorship";

export default function FinalMenteesPage() {
  const params = useParams();
  const mentorshipId = Number(params.id);
  const token = getToken() ?? "";
  const role = getUserRole();

  const [mentorship, setMentorship] = useState<Mentorship | null>(null);
  const [mentees, setMentees] = useState<MentorshipApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const didLoad = useRef(false);

  useEffect(() => {
    if (didLoad.current) return;
    didLoad.current = true;

    async function load() {
      try {
        if (!isAlumni(role)) {
          setError("Only mentors can view final mentees.");
          return;
        }

        const mentorshipData = await getMentorship(mentorshipId, token);
        setMentorship(mentorshipData);

        const mine = await getMyMentorships(token);
        const isOwner = mine.some((item) => item.id === mentorshipId);

        if (!isOwner) {
          setError(
            "You can only view final mentees for mentorships created by you.",
          );
          return;
        }

        if (!mentorshipData.finalListVisibleToMentor) {
          setError("Final mentee list is not published yet.");
          return;
        }

        const finalMentees = await getFinalMentees(mentorshipId, token);
        setMentees(finalMentees);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load final mentees.",
        );
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [mentorshipId, role, token]);

  return (
    <>
      <div className="max-w-6xl mx-auto py-10 px-6">
        <h1 className="text-4xl font-bold mb-2">Final Selected Mentees</h1>
        {mentorship && <p className="text-gray-600 mb-8">{mentorship.title}</p>}

        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="bg-red-50 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        ) : mentees.length === 0 ? (
          <div className="text-gray-600">No final selected mentees found.</div>
        ) : (
          <div className="overflow-auto">
            <table className="min-w-full border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-3">Student</th>
                  <th className="border p-3">Roll Number</th>
                  <th className="border p-3">Email</th>
                  <th className="border p-3">Branch</th>
                  <th className="border p-3">Batch</th>
                  <th className="border p-3">Motivation</th>
                  <th className="border p-3">Resume</th>
                </tr>
              </thead>
              <tbody>
                {mentees.map((app) => (
                  <tr key={app.applicationId}>
                    <td className="border p-3">{app.fullName}</td>
                    <td className="border p-3">{app.rollNumber}</td>
                    <td className="border p-3">{app.email}</td>
                    <td className="border p-3">{app.branch}</td>
                    <td className="border p-3">{app.batchYear}</td>
                    <td className="border p-3 max-w-md whitespace-pre-wrap">
                      {app.motivation}
                    </td>
                    <td className="border p-3">
                      {app.resumeUrl ? (
                        <a
                          href={app.resumeUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 underline"
                        >
                          View Resume
                        </a>
                      ) : (
                        "No Resume"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}
