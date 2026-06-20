"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

import { getToken } from "@/lib/auth";
import { fetchRegistrations } from "@/lib/api/alumniSessions";

export default function RegistrationsPage() {

  const params = useParams();

  const [registrations, setRegistrations] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    async function load() {

      try {

        const token =
          getToken() ?? "";

        const data =
          await fetchRegistrations(
            Number(params.id),
            token
          );

        setRegistrations(data);

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
      <Navbar />

      <div className="max-w-5xl mx-auto py-10 px-4">

        <h1 className="text-3xl font-bold mb-2">
          Session Registrations
        </h1>

        <p className="text-gray-500 mb-8">
          Total Students:
          {" "}
          {registrations.length}
        </p>

        {loading && (
          <p>Loading...</p>
        )}

        <div className="space-y-4">

          {registrations.map(
            (registration) => {

              const student =
                registration.student;

              return (

                <div
                  key={registration.id}
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
                    {student.fullName}
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
                      <strong>
                        Roll No:
                      </strong>
                      {" "}
                      {student.rollNumber}
                    </p>

                    <p>
                      <strong>
                        Email:
                      </strong>
                      {" "}
                      {student.email}
                    </p>

                    <p>
                      <strong>
                        Branch:
                      </strong>
                      {" "}
                      {student.branch?.name}
                    </p>

                    <p>
                      <strong>
                        Batch:
                      </strong>
                      {" "}
                      {student.batchYear}
                    </p>

                    

                    <p>
                      <strong>
                        Registered:
                      </strong>
                      {" "}
                      {new Date(
                        registration.registeredAt
                      ).toLocaleString()}
                    </p>

                  </div>

                </div>
              );
            }
          )}

        </div>

      </div>

      <Footer />
    </>
  );
}