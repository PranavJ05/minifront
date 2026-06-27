import { BACKEND_URL } from "@/lib/config";

import {

  Mentorship,

  CreateMentorshipRequest,

  UpdateMentorshipRequest,

  MentorshipApplication,

  ApplicationStatusResponse,

  CanEditResponse

} from "@/lib/types/mentorship";

export async function getAllMentorships(token: string): Promise<Mentorship[]> {

  const res = await fetch(

    `${BACKEND_URL}/api/mentorships`,

    {

      headers: {

        Authorization: `Bearer ${token}`

      }

    }

  );

  if (!res.ok)
    throw new Error();

  return res.json();

}

export async function getMentorship(id: number,token: string): Promise<Mentorship> {

  const res = await fetch(

    `${BACKEND_URL}/api/mentorships/${id}`,

    {

      headers: {

        Authorization: `Bearer ${token}`

      }

    }

  );

  if (!res.ok)
    throw new Error();

  return res.json();

}

export async function createMentorship(request: CreateMentorshipRequest,token: string) {

  const res = await fetch(

    `${BACKEND_URL}/api/mentorships`,

    {

      method: "POST",

      headers: {

        "Content-Type": "application/json",

        Authorization:
          `Bearer ${token}`

      },

      body: JSON.stringify(request)

    }

  );

  if (!res.ok)
    throw new Error();

  return res.json();

}
export async function updateMentorship(id: number,request: UpdateMentorshipRequest,token: string) {

  const res = await fetch(

    `${BACKEND_URL}/api/mentorships/${id}`,

    {

      method: "PUT",

      headers: {

        "Content-Type": "application/json",

        Authorization:
          `Bearer ${token}`

      },

      body: JSON.stringify(request)

    }

  );

  if (!res.ok)
    throw new Error();

  return res.json();

}
export async function deleteMentorship(id: number,token: string) {

  const res = await fetch(

    `${BACKEND_URL}/api/mentorships/${id}`,

    {

      method: "DELETE",

      headers: {

        Authorization:
          `Bearer ${token}`

      }

    }

  );

  if (!res.ok)
    throw new Error();

}
export async function applyMentorship(id: number,motivation: string,resume: File | null,token: string) {

  const formData =
    new FormData();

  formData.append(

    "data",

    new Blob(

      [

        JSON.stringify({

          motivation

        })

      ],

      {

        type:
          "application/json"

      }

    )

  );

  if (resume) {

    formData.append(
      "resume",
      resume
    );

  }

  const res =
    await fetch(

      `${BACKEND_URL}/api/mentorships/${id}/apply`,

      {

        method: "POST",

        headers: {

          Authorization:
            `Bearer ${token}`

        },

        body: formData

      }

    );

  if (!res.ok)
    throw new Error();

  return res.json();

}

export async function cancelApplication(id: number,token: string) {

  const res =
    await fetch(

      `${BACKEND_URL}/api/mentorships/${id}/apply`,

      {

        method: "DELETE",

        headers: {

          Authorization:
            `Bearer ${token}`

        }

      }

    );

  if (!res.ok)
    throw new Error();

}

export async function getApplicants(id: number,token: string): Promise<MentorshipApplication[]> {

  const res =
    await fetch(

      `${BACKEND_URL}/api/mentorships/${id}/applications`,

      {

        headers: {

          Authorization:
            `Bearer ${token}`

        }

      }

    );

  if (!res.ok)
    throw new Error();

  return res.json();

}

export async function canEdit(id: number,token: string): Promise<CanEditResponse> {

  const res =
    await fetch(

      `${BACKEND_URL}/api/mentorships/${id}/can-edit`,

      {

        headers: {

          Authorization:
            `Bearer ${token}`

        }

      }

    );

  if (!res.ok)
    throw new Error();

  return res.json();

}

export async function getApplicationStatus(id: number,token: string): Promise<ApplicationStatusResponse> {

  const res =
    await fetch(

      `${BACKEND_URL}/api/mentorships/${id}/application-status`,

      {

        headers: {

          Authorization:
            `Bearer ${token}`

        }

      }

    );

  if (!res.ok)
    throw new Error();

  return res.json();

}

export async function getMyMentorships(token: string): Promise<Mentorship[]> {

  const res =
    await fetch(

      `${BACKEND_URL}/api/mentorships/mine`,

      {

        headers: {

          Authorization:
            `Bearer ${token}`

        }

      }

    );

  if (!res.ok)
    throw new Error();

  return res.json();

}


