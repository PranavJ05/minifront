"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

import { applyMentorship } from "@/lib/api/mentorship";

import { getToken } from "@/lib/auth";

export default function ApplyMentorshipPage() {
  const params = useParams();

  const router = useRouter();

  const [motivation, setMotivation] = useState("");

  const [resume, setResume] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);

      if (motivation.trim().length < 20) {
        alert("Motivation should be at least 20 characters.");

        return;
      }

      await applyMentorship(
        Number(params.id),

        motivation.trim(),

        resume,

        getToken() ?? "",
      );

      alert("Application Submitted Successfully");

      router.push(`/alumni-mentorship/${params.id}`);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Submission Failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar />

      <div className="max-w-3xl mx-auto py-10 px-6">
        <h1 className="text-4xl font-bold">Apply for Mentorship</h1>

        <form onSubmit={handleSubmit} className="space-y-6 mt-8">
          <div>
            <label className="font-semibold">
              Why do you want this mentorship?
            </label>

            <textarea
              value={motivation}

              onChange={(e) => setMotivation(e.target.value)}

              rows={8}

              required

              className="w-full border rounded-lg p-4 mt-2"
            />
          </div>

          <div>
            <label className="font-semibold">Resume (Optional)</label>

            <input
              type="file"

              accept=".pdf,.doc,.docx"

              onChange={(e) => setResume(e.target.files?.[0] || null)}

              className="mt-3"
            />
          </div>

          <button
            disabled={loading}

            className="bg-green-600 text-white px-6 py-3 rounded-lg"
          >
            {loading ? "Submitting..." : "Submit Application"}
          </button>
        </form>
      </div>

      <Footer />
    </>
  );
}
