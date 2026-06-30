import { BACKEND_URL } from "@/lib/config";

export async function getMyClubs(token: string) {

    const res = await fetch(

        `${BACKEND_URL}/api/clubs/my-clubs`,

        {

            headers: {

                Authorization: `Bearer ${token}`

            }

        }

    );

    if (!res.ok) {

        throw new Error();

    }

    return res.json();

}