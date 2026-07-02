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
  description?: string;
  eventDate: string;
  location: string;
  batchYear?: number;
  createdBy?: number;
  createdByName?: string;
  createdAt?: string;
  registrationRequired?: boolean;
  registrationLink?: string;
  photos?: EventPhoto[];
  videos?: EventVideo[];
  photoUrls?: string[];
  videoUrls?: string[];
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
  message?: string;
  eventId?: number;
  mediaId?: number;
  mediaUrl?: string;
}
