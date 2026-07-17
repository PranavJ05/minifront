"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

import { getMentorship, updateMentorship } from "@/lib/api/mentorship";

import { CreateMentorshipRequest, Mentorship } from "@/lib/types/mentorship";

export default function EditMentorshipPage() {
  const params = useParams();

  const router = useRouter();

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState<CreateMentorshipRequest>({
    title: "",

    description: "",

    domain: "",

    mode: "ONLINE",

    duration: "",

    yearsOfExperience: 0,

    industry: "",

    expertise: "",

    applicationDeadline: "",
  });

  useEffect(() => {
    async function load() {
      try {
        const mentorship: Mentorship = await getMentorship(
          Number(params.id),
        );

        setForm({
          title: mentorship.title,

          description: mentorship.description,

          domain: mentorship.domain,

          mode: mentorship.mode,

          duration: mentorship.duration,

          yearsOfExperience: mentorship.yearsOfExperience,

          industry: mentorship.industry,

          expertise: mentorship.expertise,

          applicationDeadline: mentorship.applicationDeadline.substring(0, 16),
        });
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [params.id]);

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) {
    setForm({
      ...form,

      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      setSaving(true);

      await updateMentorship(
        Number(params.id),

        form,
      );

      alert("Mentorship Updated Successfully");

      router.push(`/alumni-mentorship/${params.id}`);
    } catch {
      alert("Failed to update mentorship.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <>
        <div className="max-w-3xl mx-auto py-10">Loading...</div>

        <Footer />
      </>
    );
  }

  return (
    <>
      <div className="max-w-3xl mx-auto py-10 px-6">
        <h1 className="text-4xl font-bold mb-8">Edit Mentorship</h1>

        <form
          onSubmit={handleSubmit}

          className="space-y-5"
        >
          <input
            name="title"

            value={form.title}

            onChange={handleChange}

            className="w-full border rounded p-3"

            required
          />

          <textarea
            name="description"

            value={form.description}

            onChange={handleChange}

            rows={5}

            className="w-full border rounded p-3"

            required
          />

          <input
            name="domain"

            value={form.domain}

            onChange={handleChange}

            className="w-full border rounded p-3"

            required
          />

          <select
            name="mode"

            value={form.mode}

            onChange={handleChange}

            className="w-full border rounded p-3"
          >
            <option value="ONLINE">ONLINE</option>

            <option value="OFFLINE">OFFLINE</option>

            <option value="HYBRID">HYBRID</option>
          </select>

          <input
            name="duration"

            value={form.duration}

            onChange={handleChange}

            className="w-full border rounded p-3"

            required
          />

          <input
            type="number"

            name="yearsOfExperience"

            value={form.yearsOfExperience}

            onChange={handleChange}

            className="w-full border rounded p-3"

            required
          />

          <input
            name="industry"

            value={form.industry}

            onChange={handleChange}

            className="w-full border rounded p-3"

            required
          />

          <input
            name="expertise"

            value={form.expertise}

            onChange={handleChange}

            className="w-full border rounded p-3"

            required
          />

          <label className="font-semibold">Application Deadline</label>

          <input
            type="datetime-local"

            name="applicationDeadline"

            value={form.applicationDeadline}

            onChange={handleChange}

            className="w-full border rounded p-3"

            required
          />

          <button
            disabled={saving}

            className="w-full bg-blue-600 text-white py-3 rounded-lg"
          >
            {saving ? "Updating..." : "Update Mentorship"}
          </button>
        </form>
      </div>

      <Footer />
    </>
  );
}
