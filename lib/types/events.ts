// lib/types/events.ts

export interface EventPhoto {
  id: number;
  eventId: number;
  photoUrl: string;
  photoPublicId?: string;
}

export interface EventVideo {
  id: number;
  eventId: number;
  videoUrl: string;
}

export interface Event {
  id: number;
  title: string;
  description: string;
  eventDate: string; // ISO 8601
  location: string;
  batchYear: number;
  createdBy: number;
  createdByName: string | null;
  createdAt: string;
  registrationRequired: boolean;
  registrationLink: string | null;
  photos: EventPhoto[];
  videos: EventVideo[];
  photoUrls: string[];
  videoUrls: string[];
}

export interface CreateEventPayload {
  title: string;
  description: string;
  eventDate: string;
  location: string;
  batchYear: number;
  registrationRequired: boolean;
  registrationLink?: string;
}

export interface EventActionResponse {
  success: boolean;
  message: string;
  eventId: number | null;
  mediaId?: number | null;
  mediaUrl?: string | null;
}
