"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

import { ClubEvent } from "@/lib/types/clubEvent";

import { getMyClubEvents, deleteClubEvent } from "@/lib/api/clubEvents";


import { getErrorMessage } from "@/lib/get-error-message";

import { getStatus } from "@/lib/utils/clubEvent";

export default function MyClubEventsPage() {
  const [events, setEvents] = useState<ClubEvent[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvents();
  }, []);
  async function handleDelete(id: number) {
    if (!confirm("Delete this event?")) {
      return;
    }

    try {
      await deleteClubEvent(id);

      loadEvents();
    } catch (err) {
      console.error(err);

      alert(getErrorMessage(err, "Failed to delete event."));
    }
  }

  async function loadEvents() {
    try {
      const data = await getMyClubEvents();

      setEvents(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div
          className="
                    flex
                    justify-between
                    items-center
                    mb-8
                    "
        >
          <h1
            className="
                        text-4xl
                        font-bold
                        "
          >
            My Club Events
          </h1>

          <Link
            href="/club-events/create"

            className="
                        bg-blue-600
                        text-white
                        px-5
                        py-3
                        rounded
                        "
          >
            Create Event
          </Link>
        </div>

        {events.length === 0 && (
          <div
            className="
                            text-center
                            py-20
                            "
          >
            <p
              className="
                                text-gray-500
                                text-lg
                                "
            >
              You haven't created any club events.
            </p>
          </div>
        )}

        <div
          className="
                    grid
                    md:grid-cols-2
                    gap-6
                    "
        >
          {events.map((event) => (
            <div
              key={event.id}

              className="
                                border
                                rounded-xl
                                overflow-hidden
                                shadow
                                "
            >
              <img
                src={event.coverImageUrl || "/placeholder-event.jpg"}

                className="
                                    h-52
                                    w-full
                                    object-cover
                                    "
              />

              <div className="p-5">
                <div
                  className="
                                        text-blue-700
                                        font-semibold
                                        "
                >
                  {event.clubName}
                </div>

                <h2
                  className="
                                        text-2xl
                                        font-bold
                                        "
                >
                  {event.title}
                </h2>

                <p className="mt-2">{getStatus(event)}</p>

                <div
                  className="
                                        flex
                                        gap-3
                                        mt-6
                                        "
                >
                  <Link
                    href={`/club-events/${event.id}`}

                    className="
                                            bg-gray-200
                                            px-4
                                            py-2
                                            rounded
                                            "
                  >
                    View
                  </Link>

                  <Link
                    href={`/club-events/${event.id}/edit`}

                    className="
                                            bg-yellow-500
                                            text-white
                                            px-4
                                            py-2
                                            rounded
                                            "
                  >
                    Edit
                  </Link>

                  <button
                    onClick={() => handleDelete(event.id)}

                    className="
    bg-red-600
    text-white
    px-4
    py-2
    rounded
    "
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </>
  );
}
