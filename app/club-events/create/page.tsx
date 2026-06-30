"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

import ClubEventForm from "@/components/club-events/ClubEventForm";

import { getToken } from "@/lib/auth";

import {
  createClubEvent,
  uploadClubEventCover,
  getMyClubs,
} from "@/lib/api/clubEvents";

import { Club } from "@/lib/types/mainAdmin";
import { CreateClubEventRequest } from "@/lib/types/createClubEvent";

export default function CreateClubEventPage() {

  const router = useRouter();

  const token = getToken() ?? "";

  const [clubs, setClubs] = useState<Club[]>([]);

  const [coverImage, setCoverImage] =
    useState<File | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [form, setForm] =
    useState<CreateClubEventRequest>({

      clubId: 0,

      title: "",

      description: "",

      venue: "",

      mode: "OFFLINE",

      startTime: "",

      endTime: "",

      registrationLink: "",

    });

  useEffect(() => {

    loadClubs();

  }, []);

  async function loadClubs() {

    try {

      const data =
        await getMyClubs(token);

      setClubs(data);

    }

    catch (err) {

      console.error(err);

    }

  }

  async function handleSubmit() {

    if (form.clubId === 0) {

      alert("Please select a club.");

      return;

    }

    if (!form.title.trim()) {

      alert("Please enter an event title.");

      return;

    }

    if (!form.description.trim()) {

      alert("Please enter the event description.");

      return;

    }

    if (!form.venue.trim()) {

      alert("Please enter the venue.");

      return;

    }

    if (!form.startTime) {

      alert("Please select the start time.");

      return;

    }

    if (!form.endTime) {

      alert("Please select the end time.");

      return;

    }

    const start =
      new Date(form.startTime);

    const end =
      new Date(form.endTime);

    if (start >= end) {

      alert(
        "End time must be after start time."
      );

      return;

    }

    if (form.registrationLink.trim() !== "") {

      try {

        new URL(
          form.registrationLink
        );

      }

      catch {

        alert(
          "Please enter a valid registration link."
        );

        return;

      }

    }

    try {

      setLoading(true);

      const event =
        await createClubEvent(
          form,
          token
        );

      if (coverImage) {

        await uploadClubEventCover(

          event.id,

          coverImage,

          token

        );

      }

      alert(
        "Event created successfully!"
      );

      router.push(
        "/club-events/mine"
      );

    }

    catch (err) {

      console.error(err);

      alert(
        "Failed to create event."
      );

    }

    finally {

      setLoading(false);

    }

  }

  return (

    <>

      <Navbar />

      <div className="max-w-4xl mx-auto px-6 py-8">

        <h1 className="text-4xl font-bold mb-8">

          Create Club Event

        </h1>

        <ClubEventForm

          form={form}

          setForm={setForm}

          clubs={clubs}

          coverImage={coverImage}

          setCoverImage={setCoverImage}

          loading={loading}

          submitText="Create Event"

          onSubmit={handleSubmit}

          onCancel={() => router.back()}

        />

      </div>

      <Footer />

    </>

  );

}