"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

import {
  finalSubmitMentorship,
  forceCloseMentorshipApplications,
  getApplicants,
  getMentorship,
  updateApplicationStatus,
} from "@/lib/api/mentorship";

import {
  Mentorship,
  MentorshipApplication,
  ReviewableMentorshipApplicationStatus,
} from "@/lib/types/mentorship";

import { getToken } from "@/lib/auth";

const REVIEW_STATUSES: ReviewableMentorshipApplicationStatus[] = [
  "PROVISIONAL_SELECTED",
  "DROPPED_OUT",
];

export default function ApplicationsPage() {
  const params = useParams();
  const mentorshipId = Number(params.id);
  const token = getToken() ?? "";

  const [applications, setApplications] = useState<MentorshipApplication[]>([]);
  const [mentorship, setMentorship] = useState<Mentorship | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingApplicationId, setUpdatingApplicationId] = useState<
    number | null
  >(null);
  const [submittingFinal, setSubmittingFinal] = useState(false);
  const [forceClosing, setForceClosing] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const [applicationsData, mentorshipData] = await Promise.all([
          getApplicants(mentorshipId, token),
          getMentorship(mentorshipId, token),
        ]);

        setApplications(applicationsData);
        setMentorship(mentorshipData);
      } catch (error) {
        alert(
          error instanceof Error
            ? error.message
            : "Failed to load applications",
        );
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [mentorshipId, token]);

  async function handleStatusUpdate(
    applicationId: number,
    status: ReviewableMentorshipApplicationStatus,
  ) {
    try {
      setUpdatingApplicationId(applicationId);

      const updated = await updateApplicationStatus(
        mentorshipId,
        applicationId,
        { status },
        token,
      );

      setApplications((prev) =>
        prev.map((item) =>
          item.applicationId === applicationId ? updated : item,
        ),
      );
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to update status");
    } finally {
      setUpdatingApplicationId(null);
    }
  }

  async function handleForceCloseApplications() {
    if (
      !confirm(
        "This will immediately close applications for testing. Continue?",
      )
    ) {
      return;
    }

    try {
      setForceClosing(true);
      const updatedMentorship = await forceCloseMentorshipApplications(
        mentorshipId,
        token,
      );
      setMentorship(updatedMentorship);

      const refreshedApplications = await getApplicants(mentorshipId, token);
      setApplications(refreshedApplications);

      alert("Applications closed for this mentorship.");
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to force close");
    } finally {
      setForceClosing(false);
    }
  }

  async function handleFinalSubmit() {
    if (!confirm("Final submit will publish results to mentor. Continue?")) {
      return;
    }

    try {
      setSubmittingFinal(true);
      const updatedMentorship = await finalSubmitMentorship(
        mentorshipId,
        token,
      );
      setMentorship(updatedMentorship);

      const refreshedApplications = await getApplicants(mentorshipId, token);
      setApplications(refreshedApplications);

      alert("Final submit completed and published.");
    } catch (error) {
      alert(error instanceof Error ? error.message : "Final submit failed");
    } finally {
      setSubmittingFinal(false);
    }
  }

  const isPublished = mentorship?.finalListVisibleToMentor === true;

  return (
    <>
      <div className="max-w-7xl mx-auto py-10 px-6">
        <h1 className="text-4xl font-bold mb-3">Applications</h1>

        {mentorship && (
          <div className="mb-8 flex flex-wrap gap-4 items-center">
            <span
              className={`px-3 py-1 rounded text-sm font-semibold ${
                isPublished
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {isPublished ? "Final list published" : "Review in progress"}
            </span>

            <button
              onClick={handleForceCloseApplications}
              disabled={forceClosing || isPublished}
              className="bg-orange-600 text-white px-4 py-2 rounded disabled:opacity-60"
            >
              {forceClosing
                ? "Force Closing..."
                : isPublished
                  ? "Testing Utility Disabled"
                  : "Force Close Applications (Testing)"}
            </button>

            <button
              onClick={handleFinalSubmit}
              disabled={submittingFinal || isPublished}
              className="bg-indigo-600 text-white px-4 py-2 rounded disabled:opacity-60"
            >
              {submittingFinal
                ? "Submitting..."
                : isPublished
                  ? "Already Published"
                  : "Final Submit"}
            </button>
          </div>
        )}

        {loading ? (
          <div>Loading...</div>
        ) : applications.length === 0 ? (
          <div className="text-gray-600">No applications yet.</div>
        ) : (
          <div className="overflow-auto">
            <table className="min-w-full border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-3">Student</th>
                  <th className="border p-3">Email</th>
                  <th className="border p-3">Branch</th>
                  <th className="border p-3">Batch</th>
                  <th className="border p-3">Motivation</th>
                  <th className="border p-3">Resume</th>
                  <th className="border p-3">Status</th>
                  <th className="border p-3">Actions</th>
                </tr>
              </thead>

              <tbody>
                {applications.map((app) => (
                  <tr key={app.applicationId}>
                    <td className="border p-3">{app.fullName}</td>
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
                    <td className="border p-3 font-semibold">{app.status}</td>
                    <td className="border p-3">
                      <div className="flex flex-wrap gap-2">
                        {REVIEW_STATUSES.map((status) => (
                          <button
                            key={status}
                            disabled={
                              isPublished ||
                              updatingApplicationId === app.applicationId ||
                              app.status === status
                            }
                            onClick={() =>
                              handleStatusUpdate(app.applicationId, status)
                            }
                            className="px-3 py-1 rounded border text-sm hover:bg-gray-50 disabled:opacity-60"
                          >
                            {status}
                          </button>
                        ))}
                      </div>
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
