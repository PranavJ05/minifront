"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

import { getToken } from "@/lib/auth";
import { fetchRegistrations } from "@/lib/api/alumniSessions";

type Registration = {
  id?: number | string;
  studentId?: number | string;
  fullName?: string;
  rollNumber?: string;
  email?: string;
  branch?: string;
  batchYear?: number | string;
  registeredAt?: string;
  student?: {
    studentId?: number | string;
    id?: number | string;
    fullName?: string;
    name?: string;
    rollNumber?: string;
    email?: string;
    branch?:
      | {
          name?: string;
        }
      | string;
    batchYear?: number | string;
  };
};

function valueOrFallback(value: unknown) {
  return value === null || value === undefined || value === ""
    ? "Not available"
    : String(value);
}

function formatRegisteredAt(value?: string) {
  if (!value) return "Not available";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString();
}

export default function RegistrationsPage() {
  const params = useParams();

  const [registrations, setRegistrations] = useState<Registration[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const token = getToken() ?? "";

        const data = await fetchRegistrations(Number(params.id), token);

        setRegistrations(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [params.id]);

  return (
    <>
      <div className="max-w-5xl mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold mb-2">Session Registrations</h1>

        <p className="text-gray-500 mb-8">
          Total Students: {registrations.length}
        </p>

        {loading && <p>Loading...</p>}

        <div className="space-y-4">
          {!loading && registrations.length === 0 && (
            <div className="bg-white border rounded-xl p-5 text-gray-600">
              No students have registered for this session yet.
            </div>
          )}

          {registrations.map((registration) => {
            const student = registration.student ?? {};

            const branch =
              typeof student.branch === "string"
                ? student.branch
                : student.branch?.name;

            const registrationKey =
              registration.id ??
              registration.studentId ??
              student.studentId ??
              student.id ??
              `${registration.email ?? student.email}-${registration.registeredAt ?? ""}`;

            return (
              <div
                key={registrationKey}
                className="
                    bg-white
                    border
                    rounded-xl
                    p-5
                    shadow-sm
                  "
              >
                <h2
                  className="
                      text-lg
                      font-semibold
                    "
                >
                  {valueOrFallback(
                    registration.fullName ?? student.fullName ?? student.name,
                  )}
                </h2>

                <div
                  className="
                      mt-3
                      grid
                      md:grid-cols-2
                      gap-2
                      text-sm
                    "
                >
                  <p>
                    <strong>Roll No:</strong>{" "}
                    {valueOrFallback(
                      registration.rollNumber ?? student.rollNumber,
                    )}
                  </p>

                  <p>
                    <strong>Email:</strong>{" "}
                    {valueOrFallback(registration.email ?? student.email)}
                  </p>

                  <p>
                    <strong>Branch:</strong>{" "}
                    {valueOrFallback(registration.branch ?? branch)}
                  </p>

                  <p>
                    <strong>Batch:</strong>{" "}
                    {valueOrFallback(
                      registration.batchYear ?? student.batchYear,
                    )}
                  </p>

                  <p>
                    <strong>Registered:</strong>{" "}
                    {formatRegisteredAt(registration.registeredAt)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Footer />
    </>
  );
}
