"use client";

import { useEffect, useState } from "react";

import { getErrorMessage } from "@/lib/get-error-message";
import {
  assignClub,
  getClubs,
  getUserClubs,
  removeClub,
} from "@/lib/api/mainAdmin";

import {
  Club,
  UserClubAssignment,
} from "@/lib/types/mainAdmin";

interface Props {

  open: boolean;

  onClose: () => void;

  userId: number;

  userName: string;

}

export default function ManageClubsModal({

  open,

  onClose,

  userId,

  userName,

}: Props) {

  const [clubs, setClubs] =
    useState<Club[]>([]);

  const [assignedClubs, setAssignedClubs] =
    useState<UserClubAssignment[]>([]);

  const availableClubs = clubs.filter(

    club =>

        !assignedClubs.some(

            assigned =>

                assigned.clubId === club.id

        )

);
  const [selectedClub, setSelectedClub] =
    useState("");

  useEffect(() => {

    if (open) {

      load();

    }

  }, [open]);

  async function load() {

    try {

      const [

        allClubs,

        userClubs,

      ] = await Promise.all([

        getClubs(),

        getUserClubs(
          userId
        ),

      ]);

      setClubs(allClubs);

      setAssignedClubs(userClubs);

    }

    catch (err) {

      console.error(err);

    }

  }

  async function handleAssign() {

    if (!selectedClub) {

      return;

    }

    try {

      await assignClub(

        userId,

        Number(selectedClub)

      );

      setSelectedClub("");

      load();

    }

    catch (err) {

      alert(getErrorMessage(err, "Assignment failed"));

    }

  }

  async function handleRemove(

    userClubId: number

  ) {

    if (

      !confirm(
        "Remove this club?"
      )

    ) {

      return;

    }

    try {

      await removeClub(

        userClubId

      );

      load();

    }

    catch (err) {

      alert(getErrorMessage(err, "Failed"));

    }

  }

  if (!open) {

    return null;

  }

  return (

    <div
      className="
      fixed
      inset-0
      bg-black/50
      flex
      items-center
      justify-center
      z-50
      "
    >

      <div
        className="
        bg-white
        rounded-lg
        w-full
        max-w-lg
        p-6
        "
      >

        <h2
          className="
          text-2xl
          font-bold
          mb-4
          "
        >

          Manage Clubs

        </h2>

        <p className="mb-5">

          {userName}

        </p>

        <h3
          className="
          font-semibold
          mb-2
          "
        >

          Current Clubs

        </h3>

        {

          assignedClubs.length === 0 && (

            <p
              className="
              text-gray-500
              mb-4
              "
            >

              No clubs assigned.

            </p>

          )

        }

        <div
          className="
          space-y-2
          mb-6
          "
        >

          {

            assignedClubs.map(club => (

              <div

                key={club.userClubId}

                className="
                flex
                justify-between
                items-center
                border
                rounded
                p-2
                "

              >

                <span>

                  {club.clubName}

                </span>

                <button

                  onClick={() =>
                    handleRemove(
                      club.userClubId
                    )
                  }

                  className="
                  bg-red-600
                  text-white
                  px-3
                  py-1
                  rounded
                  "

                >

                  Remove

                </button>

              </div>

            ))

          }

        </div>

        <h3
          className="
          font-semibold
          mb-2
          "
        >

          Assign Club

        </h3>

        <div
          className="
          flex
          gap-2
          "
        >

          <select

            value={selectedClub}

            onChange={(e) =>
              setSelectedClub(
                e.target.value
              )
            }

            className="
            border
            rounded
            px-3
            py-2
            flex-1
            "

          >

            <option value="">

              Select Club

            </option>

            {

              

              availableClubs.map(club => (

                <option

                  key={club.id}

                  value={club.id}

                >

                  {club.name}

                </option>

              ))

            }

          </select>

          <button

    disabled={
        availableClubs.length === 0
    }

    onClick={handleAssign}

    className="
    bg-blue-600
    text-white
    px-4
    rounded
    disabled:bg-gray-400
    "

></button>

        </div>

        <div
          className="
          flex
          justify-end
          mt-8
          "
        >

          <button

            onClick={onClose}

            className="
            bg-gray-300
            px-4
            py-2
            rounded
            "

          >

            Close

          </button>

        </div>

      </div>

    </div>

  );

}