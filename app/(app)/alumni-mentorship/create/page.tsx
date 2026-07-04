"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import {
  CreateMentorshipRequest,
  MentorshipMode,
} from "@/lib/types/mentorship";
import { createMentorship } from "@/lib/api/mentorship";
import { getToken } from "@/lib/auth";

export default function CreateMentorshipPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

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
      setLoading(true);

      await createMentorship(
        form,

        getToken() ?? "",
      );

      alert("Mentorship Created Successfully");

      router.push("/alumni-mentorship");
    } catch {
      alert("Failed to create mentorship.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="max-w-3xl mx-auto py-10 px-6">
        <h1 className="text-4xl font-bold mb-8">Create Mentorship</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            name="title"

            placeholder="Title"

            value={form.title}

            onChange={handleChange}

            required

            className="w-full border rounded p-3"
          />

          <textarea
            name="description"

            placeholder="Description"

            rows={5}

            value={form.description}

            onChange={handleChange}

            required

            className="w-full border rounded p-3"
          />

          <input
            name="domain"

            placeholder="Domain"

            value={form.domain}

            onChange={handleChange}

            required

            className="w-full border rounded p-3"
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

            placeholder="Duration (Example: 6 Weeks)"

            value={form.duration}

            onChange={handleChange}

            required

            className="w-full border rounded p-3"
          />

          <input
            type="number"

            name="yearsOfExperience"

            placeholder="Years of Experience"

            value={form.yearsOfExperience}

            onChange={handleChange}

            required

            className="w-full border rounded p-3"
          />

          <input
            name="industry"

            placeholder="Industry"

            value={form.industry}

            onChange={handleChange}

            required

            className="w-full border rounded p-3"
          />

          <input
            name="expertise"

            placeholder="Expertise (Spring Boot, React, AWS...)"

            value={form.expertise}

            onChange={handleChange}

            required

            className="w-full border rounded p-3"
          />

          <label className="font-semibold">Application Deadline</label>

          <input
            type="datetime-local"

            name="applicationDeadline"

            value={form.applicationDeadline}

            onChange={handleChange}

            required

            className="w-full border rounded p-3"
          />

          <button
            disabled={loading}

            className="w-full bg-yellow-500 hover:bg-yellow-400 py-3 rounded-lg font-bold"
          >
            {loading ? "Creating..." : "Create Mentorship"}
          </button>
        </form>
      </div>

      <Footer />
    </>
  );
}
