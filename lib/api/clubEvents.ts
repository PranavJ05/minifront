import { BACKEND_URL } from "@/lib/config";

export async function getClubEvents(
    token:string
){

    const res = await fetch(

        `${BACKEND_URL}/api/club-events`,

        {

            headers:{

                Authorization:`Bearer ${token}`

            }

        }

    );

    if(!res.ok){

        throw new Error(
            "Failed"
        );

    }

    return res.json();

}
export async function getClubEventById(

    id: number,

    token: string

) {

    const res = await fetch(

        `${BACKEND_URL}/api/club-events/${id}`,

        {

            headers: {

                Authorization: `Bearer ${token}`

            }

        }

    );

    if (!res.ok) {

        throw new Error("Failed to load event.");

    }

    return res.json();

}
export async function getMyClubEvents(
    token: string
) {

    const res = await fetch(

        `${BACKEND_URL}/api/club-events/mine`,

        {

            headers: {

                Authorization: `Bearer ${token}`

            }

        }

    );

    if (!res.ok) {

        throw new Error(
            "Failed to load events."
        );

    }

    return res.json();

}
export async function deleteClubEvent(
    id: number,
    token: string
) {

    const res = await fetch(

        `${BACKEND_URL}/api/club-events/${id}`,

        {

            method: "DELETE",

            headers: {

                Authorization: `Bearer ${token}`

            }

        }

    );

    if (!res.ok) {

        throw new Error("Delete failed.");

    }

}
export async function createClubEvent(

    data: any,

    token: string

) {

    const res = await fetch(

        `${BACKEND_URL}/api/club-events`,

        {

            method: "POST",

            headers: {

                Authorization: `Bearer ${token}`,

                "Content-Type": "application/json"

            },

            body: JSON.stringify(data)

        }

    );

    if (!res.ok) {

        throw new Error("Failed to create event.");

    }

    return res.json();

}
export async function uploadClubEventCover(

    eventId: number,

    file: File,

    token: string

) {

    const formData = new FormData();

    formData.append("file", file);

    const res = await fetch(

        `${BACKEND_URL}/api/club-events/${eventId}/cover`,

        {

            method: "POST",

            headers: {

                Authorization: `Bearer ${token}`

            },

            body: formData

        }

    );

    if (!res.ok) {

        throw new Error(
            "Upload failed."
        );

    }

    return res.json();

}
export async function getMyClubs(
    token:string
){

    const res=await fetch(

        `${BACKEND_URL}/api/clubs/my-clubs`,

        {

            headers:{

                Authorization:`Bearer ${token}`

            }

        }

    );

    if(!res.ok){

        throw new Error("Failed");

    }

    return res.json();

}
export async function getClubEventForEdit(

    id: number,

    token: string

) {

    const res = await fetch(

        `${BACKEND_URL}/api/club-events/${id}/edit`,

        {

            headers: {

                Authorization: `Bearer ${token}`

            }

        }

    );

    if (!res.ok) {

        throw new Error(
            "Failed to load event."
        );

    }

    return res.json();

}
export async function updateClubEvent(

    id: number,

    data: any,

    token: string

) {

    const res = await fetch(

        `${BACKEND_URL}/api/club-events/${id}`,

        {

            method: "PUT",

            headers: {

                Authorization: `Bearer ${token}`,

                "Content-Type": "application/json"

            },

            body: JSON.stringify(data)

        }

    );

    if (!res.ok) {

        throw new Error(
            "Update failed."
        );

    }

    return res.json();

}