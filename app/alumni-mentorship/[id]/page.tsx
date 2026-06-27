"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import { useParams, useRouter } from "next/navigation";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

import {
  getMentorship,
  deleteMentorship,
  getApplicationStatus,
  canEdit,
  cancelApplication
} from "@/lib/api/mentorship";

import {
  Mentorship
} from "@/lib/types/mentorship";

import {
  getToken,
  getUserRole
} from "@/lib/auth";

import {
  isAdmin,
  isStudent
} from "@/lib/roleUtils";

export default function MentorshipDetailsPage() {

  const params = useParams();

  const router = useRouter();

  const token = getToken() ?? "";

  const role = getUserRole();

  const [mentorship,setMentorship] =
      useState<Mentorship>();

  const [loading,setLoading] =
      useState(true);

  const [applied,setApplied] =
      useState(false);

  const [editable,setEditable] =
      useState(false);

  useEffect(()=>{

      async function load(){

          try{

              const data =
                  await getMentorship(
                      Number(params.id),
                      token
                  );

              setMentorship(data);

              if(isStudent(role)){

                  const status =
                      await getApplicationStatus(
                          Number(params.id),
                          token
                      );

                  setApplied(
                      status.applied
                  );

              }

              const edit =
                  await canEdit(
                      Number(params.id),
                      token
                  );

              setEditable(
                  edit.canEdit
              );

          }finally{

              setLoading(false);

          }

      }

      load();

  },[]);

  async function handleDelete(){

      if(
          !confirm(
              "Delete this mentorship?"
          )
      ){

          return;

      }

      try{

          await deleteMentorship(
              Number(params.id),
              token
          );

          alert(
              "Deleted Successfully"
          );

          router.push(
              "/alumni-mentorship"
          );

      }catch{

          alert(
              "Delete Failed"
          );

      }

  }

  async function handleCancel(){

      try{

          await cancelApplication(
              Number(params.id),
              token
          );

          alert(
              "Application Cancelled"
          );

          setApplied(false);

      }catch{

          alert(
              "Failed"
          );

      }

  }

  if(loading){

      return(
          <div>
              Loading...
          </div>
      );

  }

  if(!mentorship){

      return(
          <div>
              Not Found
          </div>
      );

  }

  return(

      <>

      <Navbar/>

      <div
      className="max-w-5xl mx-auto py-10 px-6">

          <h1
          className="text-4xl font-bold">

              {mentorship.title}

          </h1>

          <div
          className="mt-8 grid md:grid-cols-2 gap-6">

              <div>

                  <p>

                      <strong>
                          Domain:
                      </strong>

                      {" "}

                      {mentorship.domain}

                  </p>

                  <p>

                      <strong>
                          Industry:
                      </strong>

                      {" "}

                      {mentorship.industry}

                  </p>

                  <p>

                      <strong>
                          Experience:
                      </strong>

                      {" "}

                      {mentorship.yearsOfExperience}

                      Years

                  </p>

                  <p>

                      <strong>
                          Duration:
                      </strong>

                      {" "}

                      {mentorship.duration}

                  </p>

              </div>

              <div>

                  <p>

                      <strong>
                          Mode:
                      </strong>

                      {" "}

                      {mentorship.mode}

                  </p>

                  <p>

                      <strong>
                          Deadline:
                      </strong>

                      {" "}

                      {

                          new Date(
                              mentorship.applicationDeadline
                          )
                          .toLocaleString()

                      }

                  </p>

              </div>

          </div>

          <div
          className="mt-8">

              <h2
              className="text-2xl font-bold">

                  Description

              </h2>

              <p
              className="mt-3">

                  {mentorship.description}

              </p>

          </div>

          <div
          className="mt-8">

              <h2
              className="text-2xl font-bold">

                  Expertise

              </h2>

              <p
              className="mt-3">

                  {mentorship.expertise}

              </p>

          </div>

          <div
          className="flex flex-wrap gap-4 mt-10">

              {

                  isStudent(role)

                  &&

                  mentorship.applicationOpen

                  &&

                  !applied

                  &&

                  <Link

                  href={`/alumni-mentorship/${mentorship.id}/apply`}

                  >

                      <button
                      className="bg-green-600 text-white px-5 py-2 rounded">

                          Apply

                      </button>

                  </Link>

              }

              {

                  isStudent(role)

                  &&

                  applied

                  &&

                  <button

                  onClick={handleCancel}

                  className="bg-red-600 text-white px-5 py-2 rounded">

                      Cancel Application

                  </button>

              }

              {

                  !mentorship.applicationOpen

                  &&

                  <div
                  className="bg-red-100 text-red-700 px-4 py-2 rounded">

                      Applications Closed

                  </div>

              }

              {

                  editable

                  &&

                  <Link

                  href={`/alumni-mentorship/${mentorship.id}/edit`}

                  >

                      <button
                      className="bg-blue-600 text-white px-5 py-2 rounded">

                          Edit

                      </button>

                  </Link>

              }

              {

                  editable

                  &&

                  <button

                  onClick={handleDelete}

                  className="bg-red-700 text-white px-5 py-2 rounded">

                      Delete

                  </button>

              }

              {

                  isAdmin(role)

                  &&

                  <Link

                  href={`/alumni-mentorship/${mentorship.id}/applications`}

                  >

                      <button
                      className="bg-yellow-500 px-5 py-2 rounded font-semibold">

                          View Applications

                      </button>

                  </Link>

              }

          </div>

      </div>

      <Footer/>

      </>

  );

}