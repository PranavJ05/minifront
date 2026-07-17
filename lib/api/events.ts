import { api } from "@/lib/fetcher";
import type { CreateEventPayload, Event, EventActionResponse } from "@/lib/types/events";

export async function fetchAllEvents(): Promise<Event[]> {
  return api("/api/events/all");
}

export async function fetchEventById(id: number): Promise<Event> {
  return api(`/api/events/${id}`);
}

export async function createEvent(payload: CreateEventPayload): Promise<EventActionResponse> {
  return api("/api/events/create", {
    method: "POST",
    body: payload,
  });
}

export async function addPhoto(eventId: number, file: File): Promise<EventActionResponse> {
  const formData = new FormData();
  formData.append("file", file);
  return api(`/api/events/${eventId}/photos`, {
    method: "POST",
    body: formData,
  });
}

export async function addVideo(eventId: number, url: string): Promise<EventActionResponse> {
  return api(`/api/events/${eventId}/videos`, {
    method: "POST",
    body: { url },
  });
}

export async function deletePhoto(eventId: number, photoId: number): Promise<EventActionResponse> {
  return api(`/api/events/${eventId}/photos/${photoId}`, {
    method: "DELETE",
  });
}

export async function deleteVideo(eventId: number, videoId: number): Promise<EventActionResponse> {
  return api(`/api/events/${eventId}/videos/${videoId}`, {
    method: "DELETE",
  });
}
