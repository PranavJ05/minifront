import { AlumniSession } from "@/lib/types/alumniSession";

const BASE_URL = "http://localhost:8080/api/sessions";

export async function fetchAllSessions(
  token: string
): Promise<AlumniSession[]> {

  const response = await fetch(BASE_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch sessions");
  }

  return response.json();
}

export async function fetchSessionById(
  id: number,
  token: string
): Promise<AlumniSession> {

  const response = await fetch(
    `${BASE_URL}/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch session");
  }

  return response.json();
}

export async function registerForSession(
  id: number,
  token: string
) {

  const response = await fetch(
    `${BASE_URL}/${id}/register`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to register");
  }

  return response.text();
}
export async function createSession(
  sessionData: any,
  token: string
) {
  const response = await fetch(
    "http://localhost:8080/api/sessions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(sessionData),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to create session");
  }

  return response.json();
}
export async function cancelRegistration(
  id: number,
  token: string
) {

  const response = await fetch(
    `http://localhost:8080/api/sessions/${id}/register`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Cancel failed");
  }

  return response.text();
}
export async function deleteSession(
  id: number,
  token: string
) {

  const response = await fetch(
    `http://localhost:8080/api/sessions/${id}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Delete failed");
  }

  return response.text();
}
export async function fetchRegistrations(
  sessionId: number,
  token: string
) {

  const response = await fetch(
    `http://localhost:8080/api/sessions/${sessionId}/registrations`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to load registrations"
    );
  }

  return response.json();
}
export async function uploadSessionPhoto(
  sessionId: number,
  file: File,
  token: string
) {

  const formData = new FormData();

  formData.append("file", file);

  const response = await fetch(
    `http://localhost:8080/api/sessions/${sessionId}/media/photo`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error("Upload failed");
  }

  return response.text();
}

export async function fetchSessionMedia(
  sessionId: number,
  token: string
) {

  const response = await fetch(
    `http://localhost:8080/api/sessions/${sessionId}/media`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed");
  }

  return response.json();
}
export async function deleteMedia(
  mediaId:number,
  token:string
) {

  const response =
    await fetch(
      `http://localhost:8080/api/sessions/media/${mediaId}`,
      {
        method:"DELETE",
        headers:{
          Authorization:`Bearer ${token}`
        }
      }
    );

  if(!response.ok){
    throw new Error();
  }
}