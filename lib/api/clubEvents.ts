import { api } from "@/lib/fetcher";

export async function getClubEvents() {
  return api("/api/club-events");
}

export async function getClubEventById(id: number) {
  return api(`/api/club-events/${id}`);
}

export async function getMyClubEvents() {
  return api("/api/club-events/mine");
}

export async function deleteClubEvent(id: number) {
  return api(`/api/club-events/${id}`, { method: "DELETE" });
}

export async function createClubEvent(data: object) {
  return api("/api/club-events", {
    method: "POST",
    body: data,
  });
}

export async function uploadClubEventCover(eventId: number, file: File) {
  const formData = new FormData();
  formData.append("file", file);
  return api(`/api/club-events/${eventId}/cover`, {
    method: "POST",
    body: formData,
  });
}

export async function getMyClubs() {
  return api("/api/clubs/my-clubs");
}

export async function getClubEventForEdit(id: number) {
  return api(`/api/club-events/${id}/edit`);
}

export async function updateClubEvent(id: number, data: object) {
  return api(`/api/club-events/${id}`, {
    method: "PUT",
    body: data,
  });
}
