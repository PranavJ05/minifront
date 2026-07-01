"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

import ClubEventForm from "@/components/club-events/ClubEventForm";

import { Club } from "@/lib/types/mainAdmin";
import { CreateClubEventRequest } from "@/lib/types/createClubEvent";

import { getToken } from "@/lib/auth";

import {

    getMyClubs,

    getClubEventForEdit,

    updateClubEvent,

    uploadClubEventCover

} from "@/lib/api/clubEvents";

export default function EditClubEventPage() {

    const params = useParams();

    const router = useRouter();

    const token = getToken() ?? "";

    const [clubs, setClubs] =
        useState<Club[]>([]);

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

        load();

    }, []);

    async function load() {

        try {

            const [

                clubs,

                event

            ] = await Promise.all([

                getMyClubs(token),

                getClubEventForEdit(

                    Number(params.id),

                    token

                )

            ]);

            setClubs(clubs);

            setForm({

                clubId: event.clubId,

                title: event.title,

                description: event.description,

                venue: event.venue,

                mode: event.mode,

                startTime: event.startTime,

                endTime: event.endTime,

                registrationLink:

                    event.registrationLink ||

                    ""

            });

        }

        catch (err) {

            console.error(err);

        }

    }

    async function handleSubmit() {

        try {

            setLoading(true);

            await updateClubEvent(

                Number(params.id),

                form,

                token

            );

            if (coverImage) {

                await uploadClubEventCover(

                    Number(params.id),

                    coverImage,

                    token

                );

            }

            alert(
                "Updated successfully."
            );

            router.push(
                "/club-events/mine"
            );

        }

        catch (err) {

            console.error(err);

            alert(
                "Update failed."
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

                    Edit Club Event

                </h1>

                <ClubEventForm

                    form={form}

                    setForm={setForm}

                    clubs={clubs}

                    coverImage={coverImage}

                    setCoverImage={setCoverImage}

                    loading={loading}

                    submitText="Save Changes"

                    onSubmit={handleSubmit}

                    onCancel={() => router.back()}

                />

            </div>

            <Footer />

        </>

    );

}