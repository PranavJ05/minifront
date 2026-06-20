"use client";

import Link from "next/link";
import { AlumniSession } from "@/lib/types/alumniSession";

interface Props {
  session: AlumniSession;
}

export default function SessionCard({
  session,
}: Props) {

  return (
    <div className="card p-6">

      <div className="flex justify-between items-start">

        <div>
          <h2 className="font-bold text-xl text-navy-900">
            {session.title}
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            {session.topicDomain}
          </p>
        </div>

        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            session.status === "OPEN"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {session.status}
        </span>
      </div>

      <p className="mt-4 text-gray-600">
        {session.description}
      </p>

      <div className="mt-4 space-y-1 text-sm text-gray-500">
        <p>
          Venue: {session.venue}
        </p>

        <p>
          Mode: {session.mode}
        </p>

        <p>
          Seats:
          {" "}
          {session.registrationCount}
          /
          {session.maxParticipants}
        </p>
      </div>

      <div className="mt-5 flex gap-3">

        <Link
          href={`/alumni-sessions/${session.id}`}
        >
          <button className="btn-outline">
            View Details
          </button>
        </Link>

        {session.mediaAvailable && (
          <Link
             href={`/alumni-sessions/${session.id}/media`}
          >
            <button className="btn-primary">
              View Media
            </button>
          </Link>
        )}

      </div>
    </div>
  );
}