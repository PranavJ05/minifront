"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

import { getClubEvents } from "@/lib/api/clubEvents";
import { ClubEvent } from "@/lib/types/clubEvent";
import { getStatus } from "@/lib/utils/clubEvent";
import { getToken } from "@/lib/auth";

export default function ClubEventsPage() {

    const [events, setEvents] =
        useState<ClubEvent[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [search, setSearch] =
        useState("");

    const token =
        getToken() ?? "";

    useEffect(() => {

        loadEvents();

    }, []);

    async function loadEvents() {

        try {

            const data =
                await getClubEvents(token);

            setEvents(data);

        }

        catch (err) {

            console.error(err);

        }

        finally {

            setLoading(false);

        }

    }

    const filteredEvents =
        useMemo(() => {

            return events.filter(event =>

                event.title
                    .toLowerCase()
                    .includes(search.toLowerCase())

                ||

                event.clubName
                    .toLowerCase()
                    .includes(search.toLowerCase())

            );

        }, [events, search]);

    if (loading) {

        return <div>Loading...</div>;

    }

    return (

        <>

            <Navbar />

            <div className="max-w-7xl mx-auto px-6 py-8">

                <h1 className="text-4xl font-bold mb-6">

                    Club Events

                </h1>

                <input

                    type="text"

                    placeholder="Search by title or club..."

                    value={search}

                    onChange={(e) =>
                        setSearch(e.target.value)
                    }

                    className="
                    border
                    rounded
                    px-4
                    py-2
                    w-full
                    mb-8
                    "

                />

                <div
                    className="
                    grid
                    md:grid-cols-2
                    lg:grid-cols-3
                    gap-6
                    "
                >

                    {

                        filteredEvents.map(event => (

                            <div

                                key={event.id}

                                className="
                                border
                                rounded-xl
                                overflow-hidden
                                shadow-sm
                                "

                            >

                                <img

                                    src={
                                        event.coverImageUrl ||

                                        "/placeholder-event.jpg"
                                    }

                                    alt={event.title}

                                    className="
                                    h-48
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
                                        text-xl
                                        font-bold
                                        mt-2
                                        "
                                    >

                                        {event.title}

                                    </h2>

                                    <p
                                        className="
                                        text-gray-600
                                        mt-3
                                        line-clamp-3
                                        "
                                    >

                                        {event.description}

                                    </p>

                                    <div className="mt-4 space-y-1">

                                        <p>

                                            📍 {event.venue}

                                        </p>

                                        <p>

                                            🖥 {event.mode}

                                        </p>

                                        <p>

                                            📅 {

                                                new Date(

                                                    event.startTime

                                                ).toLocaleString()

                                            }

                                        </p>

                                       <span
                                        className={`px-2 py-1 rounded-full text-sm ${
                                            getStatus(event) === "Upcoming"
                                            ? "bg-green-100 text-green-700"
                                            : getStatus(event) === "Ongoing"
                                            ? "bg-yellow-100 text-yellow-700"
                                            : "bg-gray-200 text-gray-700"
                                        }`}
                                        >
                                        {getStatus(event)}
                                        </span>
                                    </div>

                                    <div
                                         className="
                                        mt-6
                                        flex
                                        justify-between
                                        items-center
                                        "
                                    >

                                        <Link

                                            href={`/club-events/${event.id}`}

                                            className="
                                            text-blue-600
                                            font-semibold
                                            "

                                        >

                                            View Details

                                        </Link>

                                        {

                                            event.registrationLink ?

                                                (

                                                    <a

                                                        href={
                                                            event.registrationLink
                                                        }

                                                        target="_blank"

                                                        className="
                                                        bg-blue-600
                                                        text-white
                                                        px-3
                                                        py-2
                                                        rounded
                                                        "

                                                    >

                                                        Register

                                                    </a>

                                                )

                                                :

                                                (

                                                    <span
                                                        className="
                                                        text-gray-500
                                                        text-sm
                                                        "
                                                    >

                                                        Registration Not Required

                                                    </span>

                                                )

                                        }

                                    </div>

                                </div>

                            </div>

                        ))

                    }

                </div>

            </div>

            <Footer />

        </>

    );

}