"use client";

import { Club } from "@/lib/types/mainAdmin";
import { CreateClubEventRequest } from "@/lib/types/createClubEvent";

interface ClubEventFormProps {

    form: CreateClubEventRequest;

    setForm: React.Dispatch<
        React.SetStateAction<CreateClubEventRequest>
    >;

    clubs: Club[];

    coverImage: File | null;

    setCoverImage: React.Dispatch<
        React.SetStateAction<File | null>
    >;

    loading: boolean;

    submitText: string;

    onSubmit: () => void;

    onCancel: () => void;

}

export default function ClubEventForm({

    form,

    setForm,

    clubs,

    coverImage,

    setCoverImage,

    loading,

    submitText,

    onSubmit,

    onCancel,

}: ClubEventFormProps) {

    return (

        <div className="space-y-6">

            <div>

                <label className="block mb-2 font-semibold">

                    Club

                </label>

                <select

                    value={form.clubId}

                    onChange={(e) =>
                        setForm({

                            ...form,

                            clubId: Number(
                                e.target.value
                            ),

                        })
                    }

                    className="w-full border rounded px-4 py-3"

                >

                    <option value={0}>

                        Select Club

                    </option>

                    {

                        clubs.map(club => (

                            <option

                                key={club.id}

                                value={club.id}

                            >

                                {club.name}

                            </option>

                        ))

                    }

                </select>

            </div>

            <div>

                <label className="block mb-2 font-semibold">

                    Event Title

                </label>

                <input

                    type="text"

                    value={form.title}

                    onChange={(e) =>
                        setForm({

                            ...form,

                            title: e.target.value,

                        })
                    }

                    className="w-full border rounded px-4 py-3"

                />

            </div>

            <div>

                <label className="block mb-2 font-semibold">

                    Description

                </label>

                <textarea

                    rows={6}

                    value={form.description}

                    onChange={(e) =>
                        setForm({

                            ...form,

                            description:
                                e.target.value,

                        })
                    }

                    className="w-full border rounded px-4 py-3"

                />

            </div>

            <div className="grid grid-cols-2 gap-6">

                <div>

                    <label className="block mb-2 font-semibold">

                        Venue

                    </label>

                    <input

                        type="text"

                        value={form.venue}

                        onChange={(e) =>
                            setForm({

                                ...form,

                                venue:
                                    e.target.value,

                            })
                        }

                        className="w-full border rounded px-4 py-3"

                    />

                </div>

                <div>

                    <label className="block mb-2 font-semibold">

                        Mode

                    </label>

                    <select

                        value={form.mode}

                        onChange={(e) =>
                            setForm({

                                ...form,

                                mode:
                                    e.target.value,

                            })
                        }

                        className="w-full border rounded px-4 py-3"

                    >

                        <option value="OFFLINE">

                            Offline

                        </option>

                        <option value="ONLINE">

                            Online

                        </option>

                        <option value="HYBRID">

                            Hybrid

                        </option>

                    </select>

                </div>

            </div>

            <div className="grid grid-cols-2 gap-6">

                <div>

                    <label className="block mb-2 font-semibold">

                        Start Time

                    </label>

                    <input

                        type="datetime-local"

                        value={form.startTime}

                        onChange={(e) =>
                            setForm({

                                ...form,

                                startTime:
                                    e.target.value,

                            })
                        }

                        className="w-full border rounded px-4 py-3"

                    />

                </div>

                <div>

                    <label className="block mb-2 font-semibold">

                        End Time

                    </label>

                    <input

                        type="datetime-local"

                        value={form.endTime}

                        onChange={(e) =>
                            setForm({

                                ...form,

                                endTime:
                                    e.target.value,

                            })
                        }

                        className="w-full border rounded px-4 py-3"

                    />

                </div>

            </div>

            <div>

                <label className="block mb-2 font-semibold">

                    Registration Link (Optional)

                </label>

                <input

                    type="url"

                    value={form.registrationLink}

                    onChange={(e) =>
                        setForm({

                            ...form,

                            registrationLink:
                                e.target.value,

                        })
                    }

                    className="w-full border rounded px-4 py-3"

                />

            </div>

            <div>

                <label className="block mb-2 font-semibold">

                    Cover Image

                </label>

                <input

                    type="file"

                    accept="image/*"

                    onChange={(e) =>
                        setCoverImage(

                            e.target.files?.[0] ||

                            null

                        )
                    }

                />

                {

                    coverImage && (

                        <p className="text-sm text-gray-600 mt-2">

                            Selected:

                            {" "}

                            {coverImage.name}

                        </p>

                    )

                }

            </div>

            <div className="flex justify-end gap-4 pt-6">

                <button

                    type="button"

                    onClick={onCancel}

                    className="px-6 py-3 rounded bg-gray-300"

                >

                    Cancel

                </button>

                <button

                    type="button"

                    disabled={loading}

                    onClick={onSubmit}

                    className="px-6 py-3 rounded bg-blue-600 text-white disabled:bg-gray-400"

                >

                    {

                        loading

                            ? "Please wait..."

                            : submitText

                    }

                </button>

            </div>

        </div>

    );

}