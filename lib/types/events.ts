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

export interface CollaboratingClub {
  id: number;
  name: string;
  description?: string;
  logoUrl?: string;
}

export interface Event {
  id: number;
  title: string;
  description?: string;
  category?: string;
  mode?: string;
  topicDomain?: string;
  speakerName?: string;
  speakerDetails?: string;
  eventDate: string;
  endTime?: string;
  location: string;
  batchYear?: number;
  maxParticipants?: number;
  registrationCount?: number;
  createdBy?: number;
  createdByName?: string;
  createdAt?: string;
  registrationRequired?: boolean;
  registrationLink?: string;
  collaboratingClubs?: CollaboratingClub[];
  photos?: EventPhoto[];
  videos?: EventVideo[];
  photoUrls?: string[];
  videoUrls?: string[];
}

export interface CreateEventPayload {
  title: string;
  description: string;
  category?: string;
  mode?: string;
  topicDomain?: string;
  speakerName?: string;
  speakerDetails?: string;
  eventDate: string;
  endTime?: string;
  location: string;
  batchYear?: number;
  maxParticipants?: number;
  registrationRequired?: boolean;
  registrationLink?: string;
  collaboratingClubIds?: number[];
}

export interface EventActionResponse {
  success: boolean;
  message?: string;
  eventId?: number;
  mediaId?: number;
  mediaUrl?: string;
}
