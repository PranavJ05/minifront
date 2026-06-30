import { BACKEND_URL } from "@/lib/config";
import {
  ApplicationStatusResponse,
  CanEditResponse,
  CreateMentorshipRequest,
  Mentorship,
  MentorshipApplication,
  UpdateApplicationStatusRequest,
  UpdateMentorshipRequest,
} from "@/lib/types/mentorship";

async function parseError(res: Response): Promise<Error> {
  try {
    const body = await res.json();
    if (typeof body === "string") return new Error(body);
    if (body?.message) return new Error(body.message);
  } catch {
    try {
      const text = await res.text();
      if (text) return new Error(text);
    } catch {
      // ignore
    }
  }

  return new Error("Request failed");
}

export async function getAllMentorships(token: string): Promise<Mentorship[]> {
  const res = await fetch(`${BACKEND_URL}/api/mentorships`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw await parseError(res);
  return res.json();
}

export async function getMentorship(
  id: number,
  token: string,
): Promise<Mentorship> {
  const res = await fetch(`${BACKEND_URL}/api/mentorships/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw await parseError(res);
  return res.json();
}

export async function createMentorship(
  request: CreateMentorshipRequest,
  token: string,
) {
  const res = await fetch(`${BACKEND_URL}/api/mentorships`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(request),
  });

  if (!res.ok) throw await parseError(res);
  return res.json();
}

export async function updateMentorship(
  id: number,
  request: UpdateMentorshipRequest,
  token: string,
) {
  const res = await fetch(`${BACKEND_URL}/api/mentorships/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(request),
  });

  if (!res.ok) throw await parseError(res);
  return res.json();
}

export async function deleteMentorship(id: number, token: string) {
  const res = await fetch(`${BACKEND_URL}/api/mentorships/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw await parseError(res);
}

export async function applyMentorship(
  id: number,
  motivation: string,
  resume: File | null,
  token: string,
) {
  const formData = new FormData();
  formData.append(
    "data",
    new Blob([JSON.stringify({ motivation })], {
      type: "application/json",
    }),
  );

  if (resume) {
    formData.append("resume", resume);
  }

  const res = await fetch(`${BACKEND_URL}/api/mentorships/${id}/apply`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  if (!res.ok) throw await parseError(res);
  return res.json();
}

export async function cancelApplication(id: number, token: string) {
  const res = await fetch(`${BACKEND_URL}/api/mentorships/${id}/apply`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw await parseError(res);

  try {
    return await res.json();
  } catch {
    return null;
  }
}

export async function getApplicants(
  id: number,
  token: string,
): Promise<MentorshipApplication[]> {
  const res = await fetch(`${BACKEND_URL}/api/mentorships/${id}/applications`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw await parseError(res);
  return res.json();
}

export async function updateApplicationStatus(
  mentorshipId: number,
  applicationId: number,
  request: UpdateApplicationStatusRequest,
  token: string,
): Promise<MentorshipApplication> {
  const res = await fetch(
    `${BACKEND_URL}/api/mentorships/${mentorshipId}/applications/${applicationId}/status`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(request),
    },
  );

  if (!res.ok) throw await parseError(res);
  return res.json();
}

export async function forceCloseMentorshipApplications(
  mentorshipId: number,
  token: string,
): Promise<Mentorship> {
  const res = await fetch(
    `${BACKEND_URL}/api/mentorships/${mentorshipId}/admin/force-close-applications`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  if (!res.ok) throw await parseError(res);
  return res.json();
}

export async function finalSubmitMentorship(
  mentorshipId: number,
  token: string,
): Promise<Mentorship> {
  const res = await fetch(
    `${BACKEND_URL}/api/mentorships/${mentorshipId}/final-submit`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  if (!res.ok) throw await parseError(res);
  return res.json();
}

export async function getFinalMentees(
  id: number,
  token: string,
): Promise<MentorshipApplication[]> {
  const res = await fetch(
    `${BACKEND_URL}/api/mentorships/${id}/final-mentees`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  if (!res.ok) throw await parseError(res);
  return res.json();
}

export async function canEdit(
  id: number,
  token: string,
): Promise<CanEditResponse> {
  const res = await fetch(`${BACKEND_URL}/api/mentorships/${id}/can-edit`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw await parseError(res);
  return res.json();
}

export async function getApplicationStatus(
  id: number,
  token: string,
): Promise<ApplicationStatusResponse> {
  const res = await fetch(
    `${BACKEND_URL}/api/mentorships/${id}/application-status`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  if (!res.ok) throw await parseError(res);
  return res.json();
}

export async function getMyMentorships(token: string): Promise<Mentorship[]> {
  const res = await fetch(`${BACKEND_URL}/api/mentorships/mine`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw await parseError(res);
  return res.json();
}
