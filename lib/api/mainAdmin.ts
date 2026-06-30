import { BACKEND_URL } from "@/lib/config";

export async function getUsers(
  token: string,
  role?: string
) {
  const url = role
    ? `${BACKEND_URL}/api/main-admin/users?role=${role}`
    : `${BACKEND_URL}/api/main-admin/users`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to load users");
  }

  return res.json();
}
export async function getUserClubs(
  userId: number,
  token: string
) {
  const res = await fetch(
    `${BACKEND_URL}/api/main-admin/users/${userId}/clubs`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed");
  }

  return res.json();
}
export async function assignClub(

  userId: number,

  clubId: number,

  token: string

) {

  const res = await fetch(

    `${BACKEND_URL}/api/main-admin/users/${userId}/clubs`,

    {

      method: "POST",

      headers: {

        Authorization: `Bearer ${token}`,

        "Content-Type": "application/json",

      },

      body: JSON.stringify({

        clubId,

      }),

    }

  );

  if (!res.ok) {

    throw new Error("Assignment failed");

  }

}
export async function removeClub(

  userClubId: number,

  token: string

) {

  const res = await fetch(

    `${BACKEND_URL}/api/main-admin/users/clubs/${userClubId}`,

    {

      method: "DELETE",

      headers: {

        Authorization: `Bearer ${token}`,

      },

    }

  );

  if (!res.ok) {

    throw new Error("Remove failed");

  }

}
export async function getClubs(

  token: string

) {

  const res = await fetch(

    `${BACKEND_URL}/api/clubs`,

    {

      headers: {

        Authorization: `Bearer ${token}`,

      },

    }

  );

  if (!res.ok) {

    throw new Error("Failed");

  }
  console.log(res)
  return res.json();

}
export async function getDashboardStats(

    token: string

) {

    const res = await fetch(

        `${BACKEND_URL}/api/main-admin/dashboard`,

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