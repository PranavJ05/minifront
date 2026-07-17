import { api } from "@/lib/fetcher";
import type { AlumniSession } from "@/lib/types/alumniSession";

export async function fetchAllSessions(): Promise<AlumniSession[]> {
  return api("/api/sessions");
}

export async function fetchSessionById(id: number): Promise<AlumniSession> {
  return api(`/api/sessions/${id}`);
}

export async function registerForSession(id: number) {
  return api(`/api/sessions/${id}/register`, { method: "POST" });
}

export async function createSession(sessionData: Record<string, unknown>) {
  return api("/api/sessions", {
    method: "POST",
    body: sessionData,
  });
}

export async function cancelRegistration(id: number) {
  return api(`/api/sessions/${id}/register`, { method: "DELETE" });
}

export async function deleteSession(id: number) {
  return api(`/api/sessions/${id}`, { method: "DELETE" });
}

export async function fetchRegistrations(sessionId: number) {
  return api(`/api/sessions/${sessionId}/registrations`);
}

export async function uploadSessionPhoto(sessionId: number, file: File) {
  const formData = new FormData();
  formData.append("file", file);
  return api(`/api/sessions/${sessionId}/media/photo`, {
    method: "POST",
    body: formData,
  });
}

export async function fetchSessionMedia(sessionId: number) {
  return api(`/api/sessions/${sessionId}/media`);
}

export async function deleteMedia(mediaId: number) {
  return api(`/api/sessions/media/${mediaId}`, { method: "DELETE" });
}
