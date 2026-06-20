"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

import { getToken } from "@/lib/auth";

import { createSession } from "@/lib/api/alumniSessions";

export default function CreateSessionPage() {

  const router = useRouter();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    topicDomain: "",
    mode: "OFFLINE",
    venue: "",
    startTime: "",
    endTime: "",
    maxParticipants: 50,
  });

  const [loading, setLoading] =
    useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement |
      HTMLTextAreaElement |
      HTMLSelectElement
    >
  ) => {

    setFormData({
      ...formData,
      [e.target.name]:
      e.target.value,
    });
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    try {

      setLoading(true);

      const token =
        getToken() ?? "";

      await createSession(
        formData,
        token
      );

      alert(
        "Session Created Successfully"
      );

      router.push(
        "/alumni-sessions"
      );

    } catch (err) {

      console.error(err);

      alert(
        "Failed to create session"
      );

    } finally {

      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="max-w-4xl mx-auto py-10 px-4">

        <h1 className="text-3xl font-bold mb-6">
          Create Alumni Session
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >

          <input
            name="title"
            placeholder="Title"
            value={formData.title}
            onChange={handleChange}
            className="w-full border p-3 rounded"
            required
          />

          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border p-3 rounded"
            rows={4}
            required
          />

          <input
            name="topicDomain"
            placeholder="Topic Domain"
            value={formData.topicDomain}
            onChange={handleChange}
            className="w-full border p-3 rounded"
            required
          />

          <select
            name="mode"
            value={formData.mode}
            onChange={handleChange}
            className="w-full border p-3 rounded"
          >
            <option value="ONLINE">
              ONLINE
            </option>

            <option value="OFFLINE">
              OFFLINE
            </option>

            <option value="HYBRID">
              HYBRID
            </option>
          </select>

          <input
            name="venue"
            placeholder="Venue"
            value={formData.venue}
            onChange={handleChange}
            className="w-full border p-3 rounded"
          />

          <input
            type="datetime-local"
            name="startTime"
            value={formData.startTime}
            onChange={handleChange}
            className="w-full border p-3 rounded"
            required
          />

          <input
            type="datetime-local"
            name="endTime"
            value={formData.endTime}
            onChange={handleChange}
            className="w-full border p-3 rounded"
            required
          />

          <input
            type="number"
            name="maxParticipants"
            value={formData.maxParticipants}
            onChange={handleChange}
            className="w-full border p-3 rounded"
            min={1}
          />

          <button
            type="submit"
            disabled={loading}
            className="
              bg-yellow-500
              text-black
              px-5
              py-3
              rounded
              font-semibold
            "
          >
            {
              loading
              ? "Creating..."
              : "Create Session"
            }
          </button>

        </form>

      </div>

      <Footer />
    </>
  );
}