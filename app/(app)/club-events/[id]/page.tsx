"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

import { getToken } from "@/lib/auth";

import { ClubEvent } from "@/lib/types/clubEvent";

import { getClubEventById } from "@/lib/api/clubEvents";

import { getStatus } from "@/lib/utils/clubEvent";

export default function ClubEventDetailsPage() {
  const params = useParams();

  const token = getToken() ?? "";

  const [event, setEvent] = useState<ClubEvent | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvent();
  }, []);

  async function loadEvent() {
    try {
      const data = await getClubEventById(
        Number(params.id),

        token,
      );

      setEvent(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!event) {
    return <div>Event not found.</div>;
  }

  return (
    <>
      <div className="max-w-5xl mx-auto px-6 py-8">
        <img
          src={event.coverImageUrl || "/placeholder-event.jpg"}

          className="
                    w-full
                    h-96
                    object-cover
                    rounded-xl
                    "
        />

        <div className="mt-8">
          <div
            className="
                        text-blue-600
                        font-semibold
                        text-lg
                        "
          >
            {event.clubName}
          </div>

          <h1
            className="
                        text-4xl
                        font-bold
                        mt-2
                        "
          >
            {event.title}
          </h1>

          <div
            className="
                        mt-6
                        space-y-3
                        "
          >
            <p>
              <strong>Status:</strong> {getStatus(event)}
            </p>

            <p>
              <strong>Mode:</strong> {event.mode}
            </p>

            <p>
              <strong>Venue:</strong> {event.venue}
            </p>

            <p>
              <strong>Starts:</strong>{" "}
              {new Date(event.startTime).toLocaleString()}
            </p>

            <p>
              <strong>Ends:</strong> {new Date(event.endTime).toLocaleString()}
            </p>
          </div>

          <div className="mt-8">
            <h2
              className="
                            text-2xl
                            font-semibold
                            mb-3
                            "
            >
              Description
            </h2>

            <p>{event.description}</p>
          </div>

          <div className="mt-8">
            {event.registrationLink ? (
              <a
                href={event.registrationLink}

                target="_blank"

                className="
                                        bg-blue-600
                                        text-white
                                        px-5
                                        py-3
                                        rounded
                                        "
              >
                Register
              </a>
            ) : (
              <div
                className="
                                        bg-green-100
                                        text-green-700
                                        px-4
                                        py-3
                                        rounded
                                        "
              >
                Registration Not Required
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
