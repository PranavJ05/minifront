"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

import {
  canEdit,
  cancelApplication,
  deleteMentorship,
  getApplicationStatus,
  getMentorship,
  getMyMentorships,
} from "@/lib/api/mentorship";

import { ApplicationStatusResponse, Mentorship } from "@/lib/types/mentorship";

import { getToken, getUserRole } from "@/lib/auth";
import { isAdmin, isAlumni, isStudent } from "@/lib/roleUtils";

export default function MentorshipDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const mentorshipId = Number(params.id);
  const token = getToken() ?? "";
  const role = getUserRole();

  const [mentorship, setMentorship] = useState<Mentorship | null>(null);
  const [applicationStatus, setApplicationStatus] =
    useState<ApplicationStatusResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [editable, setEditable] = useState(false);
  const [isMentorOwner, setIsMentorOwner] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const [mentorshipData, edit] = await Promise.all([
          getMentorship(mentorshipId, token),
          canEdit(mentorshipId, token),
        ]);

        setMentorship(mentorshipData);
        setEditable(edit.canEdit);

        if (isStudent(role)) {
          const status = await getApplicationStatus(mentorshipId, token);
          setApplicationStatus(status);
        }

        if (isAlumni(role)) {
          const mine = await getMyMentorships(token);
          setIsMentorOwner(mine.some((item) => item.id === mentorshipId));
        }
      } catch (error) {
        alert(
          error instanceof Error ? error.message : "Failed to load mentorship",
        );
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [mentorshipId, role, token]);

  async function handleDelete() {
    if (!confirm("Delete this mentorship?")) return;

    try {
      await deleteMentorship(mentorshipId, token);
      alert("Deleted successfully");
      router.push("/alumni-mentorship");
    } catch (error) {
      alert(error instanceof Error ? error.message : "Delete failed");
    }
  }

  async function handleCancel() {
    try {
      await cancelApplication(mentorshipId, token);
      alert("Application cancelled");

      const latestStatus = await getApplicationStatus(mentorshipId, token);
      setApplicationStatus(latestStatus);
    } catch (error) {
      alert(
        error instanceof Error ? error.message : "Failed to cancel application",
      );
    }
  }

  if (loading) return <div>Loading...</div>;
  if (!mentorship) return <div>Not Found</div>;

  const applied = applicationStatus?.applied === true;
  const finalPublished = applicationStatus?.finalPublished === true;

  return (
    <>
      <Navbar />

      <div className="max-w-5xl mx-auto py-10 px-6">
        <h1 className="text-4xl font-bold">{mentorship.title}</h1>

        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <div>
            <p>
              <strong>Domain:</strong> {mentorship.domain}
            </p>
            <p>
              <strong>Industry:</strong> {mentorship.industry}
            </p>
            <p>
              <strong>Experience:</strong> {mentorship.yearsOfExperience} Years
            </p>
            <p>
              <strong>Duration:</strong> {mentorship.duration}
            </p>
          </div>

          <div>
            <p>
              <strong>Mode:</strong> {mentorship.mode}
            </p>
            <p>
              <strong>Deadline:</strong>{" "}
              {new Date(mentorship.applicationDeadline).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-bold">Description</h2>
          <p className="mt-3">{mentorship.description}</p>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-bold">Expertise</h2>
          <p className="mt-3">{mentorship.expertise}</p>
        </div>

        {isStudent(role) && applicationStatus && (
          <div className="mt-6">
            {!applicationStatus.applied && mentorship.applicationOpen && (
              <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded">
                Open for applications
              </div>
            )}

            {applicationStatus.applied && !applicationStatus.finalPublished && (
              <div className="bg-yellow-50 text-yellow-700 px-4 py-2 rounded">
                Application submitted and under review.
              </div>
            )}

            {applicationStatus.finalPublished && applicationStatus.message && (
              <div
                className={`px-4 py-2 rounded ${
                  applicationStatus.selected
                    ? "bg-green-50 text-green-700"
                    : "bg-slate-100 text-slate-700"
                }`}
              >
                {applicationStatus.message}
              </div>
            )}
          </div>
        )}

        <div className="flex flex-wrap gap-4 mt-10">
          {isStudent(role) && !applied && mentorship.applicationOpen && (
            <Link href={`/alumni-mentorship/${mentorship.id}/apply`}>
              <button className="bg-green-600 text-white px-5 py-2 rounded">
                Apply
              </button>
            </Link>
          )}

          {isStudent(role) && applied && !finalPublished && (
            <button
              onClick={handleCancel}
              className="bg-red-600 text-white px-5 py-2 rounded"
            >
              Cancel Application
            </button>
          )}

          {!mentorship.applicationOpen && (
            <div className="bg-red-100 text-red-700 px-4 py-2 rounded">
              Applications Closed
            </div>
          )}

          {editable && (
            <Link href={`/alumni-mentorship/${mentorship.id}/edit`}>
              <button className="bg-blue-600 text-white px-5 py-2 rounded">
                Edit
              </button>
            </Link>
          )}

          {editable && (
            <button
              onClick={handleDelete}
              className="bg-red-700 text-white px-5 py-2 rounded"
            >
              Delete
            </button>
          )}

          {isAdmin(role) && (
            <Link href={`/alumni-mentorship/${mentorship.id}/applications`}>
              <button className="bg-yellow-500 px-5 py-2 rounded font-semibold">
                View Applications
              </button>
            </Link>
          )}

          {isAlumni(role) &&
            isMentorOwner &&
            mentorship.finalListVisibleToMentor && (
              <Link href={`/alumni-mentorship/${mentorship.id}/final-mentees`}>
                <button className="bg-emerald-600 text-white px-5 py-2 rounded font-semibold">
                  View Final Mentees
                </button>
              </Link>
            )}

          {isAlumni(role) &&
            isMentorOwner &&
            !mentorship.finalListVisibleToMentor && (
              <div className="bg-slate-100 text-slate-700 px-4 py-2 rounded text-sm">
                Final mentee list will be available after ARC publishes results.
              </div>
            )}
        </div>
      </div>

      <Footer />
    </>
  );
}
