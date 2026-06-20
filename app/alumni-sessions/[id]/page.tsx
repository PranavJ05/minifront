"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

import {
  fetchSessionById,
  registerForSession,
  cancelRegistration,
  deleteSession,
} from "@/lib/api/alumniSessions";

import { AlumniSession } from "@/lib/types/alumniSession";

import {
  getToken,
  getUserRole,
} from "@/lib/auth";

import {
  isAdmin,
  isAlumni,
  isStudent,
} from "@/lib/roleUtils";
import Link from "next/link";
export default function SessionDetailsPage() {

  const params = useParams();

  const router = useRouter();

  const [session, setSession] =
    useState<AlumniSession | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [registered, setRegistered] =
    useState(false);

  const token =
    getToken() ?? "";

  const userRole =
    getUserRole();

  useEffect(() => {

    async function loadSession() {

      try {

        const data =
          await fetchSessionById(
            Number(params.id),
            token
          );

        setSession(data);

      } catch (error) {

        console.error(error);

      } finally {

        setLoading(false);
      }
    }

    loadSession();

  }, [params.id, token]);

  const handleRegister =
    async () => {

      try {

        await registerForSession(
          Number(params.id),
          token
        );

        alert(
          "Registered Successfully"
        );

        setRegistered(true);

      } catch (error) {

        alert(
          "Registration Failed"
        );
      }
    };

  const handleCancel =
    async () => {

      try {

        await cancelRegistration(
          Number(params.id),
          token
        );

        alert(
          "Registration Cancelled"
        );

        setRegistered(false);

      } catch (error) {

        alert(
          "Failed"
        );
      }
    };

  const handleDelete =
    async () => {

      if(
        !confirm(
          "Delete Session?"
        )
      ) {
        return;
      }

      try {

        await deleteSession(
          Number(params.id),
          token
        );

        alert(
          "Deleted"
        );

        router.push(
          "/alumni-sessions"
        );

      } catch (error) {

        alert(
          "Delete Failed"
        );
      }
    };

  if (loading) {

    return (
      <div>
        Loading...
      </div>
    );
  }

  if (!session) {

    return (
      <div>
        Session Not Found
      </div>
    );
  }

  const registrationClosed =
    session.registrationCount >=
    session.maxParticipants;

  const currentUser = JSON.parse(
  localStorage.getItem("alumni_user") || "{}"
);

const isCreator =session.createdBy?.email === currentUser.email;
  const canDelete =isAdmin(userRole)||isCreator;


  return (
    <>
      <Navbar />

      <div className="max-w-5xl mx-auto py-10 px-4">

        <h1 className="text-4xl font-bold">
          {session.title}
        </h1>

        <div className="mt-6 space-y-3">

          <p>
            <strong>
              Topic Domain:
            </strong>
            {" "}
            {session.topicDomain}
          </p>

          <p>
            <strong>
              Mode:
            </strong>
            {" "}
            {session.mode}
          </p>

          <p>
            <strong>
              Venue:
            </strong>
            {" "}
            {session.venue}
          </p>

          <p>
            <strong>
              Start:
            </strong>
            {" "}
            {session.startTime}
          </p>

          <p>
            <strong>
              End:
            </strong>
            {" "}
            {session.endTime}
          </p>

          <p>
            <strong>
              Registrations:
            </strong>
            {" "}
            {session.registrationCount}
            /
            {session.maxParticipants}
          </p>

          <p>
            <strong>
              Created By:
            </strong>
            {" "}
            {session.createdBy?.name}
          </p>

        </div>

        <div className="mt-8">

          <h2 className="text-xl font-semibold mb-3">
            Description
          </h2>

          <p>
            {session.description}
          </p>

        </div>

        <div className="flex gap-3 mt-8 flex-wrap">

          {isStudent(userRole) &&
            !registrationClosed &&
            !registered && (

            <button
              onClick={handleRegister}
              className="
                bg-green-600
                text-white
                px-4
                py-2
                rounded
              "
            >
              Register
            </button>
          )}
          

          {isStudent(userRole) &&
            registered && (

            <button
              onClick={handleCancel}
              className="
                bg-red-600
                text-white
                px-4
                py-2
                rounded
              "
            >
              Cancel Registration
            </button>
          )}

          {registrationClosed && (

            <div
              className="
                bg-red-100
                text-red-700
                px-4
                py-2
                rounded
              "
            >
              Registration Closed
            </div>
          )}

          {(canDelete) && (

            <button
              onClick={handleDelete}
              className="
                bg-red-600
                text-white
                px-4
                py-2
                rounded
              "
            >
              Delete Session
            </button>
          )}
          {isCreator && (

  <Link
    href={`/alumni-sessions/${session.id}/upload-media`}
  >
    <button
      className="
        bg-green-600
        text-white
        px-4
        py-2
        rounded
      "
    >
      Upload Media
    </button>
  </Link>

)}
          {isCreator && (

            <Link
                href={`/alumni-sessions/${session.id}/registrations`}
            >
                <button
                className="
                    bg-blue-600
                    text-white
                    px-4
                    py-2
                    rounded
                "
                >
                View Registrations
                </button>
            </Link>

            )}

        </div>

      </div>

      <Footer />
    </>
  );
}