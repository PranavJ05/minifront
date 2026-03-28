// lib/api/events.ts

import {
  CreateEventPayload,
  Event,
  EventActionResponse,
} from "@/lib/types/events";

const BASE = "http://localhost:8080";

function authHeaders(token: string): Record<string, string> {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export async function fetchAllEvents(token: string): Promise<Event[]> {
  const res = await fetch(`${BASE}/events/all`, {
    headers: authHeaders(token),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Failed to fetch events: ${res.status}`);
  return res.json();
}

export async function fetchEventById(
  id: number,
  token: string,
): Promise<Event> {
  const res = await fetch(`${BASE}/events/${id}`, {
    headers: authHeaders(token),
    cache: "no-store",
  });
  if (res.status === 404) throw new Error("Event not found");
  if (!res.ok) throw new Error(`Failed to fetch event: ${res.status}`);
  return res.json();
}

export async function createEvent(
  payload: CreateEventPayload,
  token: string,
): Promise<EventActionResponse> {
  const res = await fetch(`${BASE}/events/create`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function addPhoto(
  eventId: number,
  file: File,
  token: string,
): Promise<EventActionResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${BASE}/events/${eventId}/photos`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
  return res.json();
}

export async function addVideo(
  eventId: number,
  url: string,
  token: string,
): Promise<EventActionResponse> {
  const res = await fetch(`${BASE}/events/${eventId}/videos`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify({ url }),
  });
  return res.json();
}

export async function deletePhoto(
  eventId: number,
  photoId: number,
  token: string,
): Promise<EventActionResponse> {
  const res = await fetch(`${BASE}/events/${eventId}/photos/${photoId}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
  return res.json();
}

export async function deleteVideo(
  eventId: number,
  videoId: number,
  token: string,
): Promise<EventActionResponse> {
  const res = await fetch(`${BASE}/events/${eventId}/videos/${videoId}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
  return res.json();
}
