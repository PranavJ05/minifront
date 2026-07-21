import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/fetcher";
import { queryKeys } from "./keys";
import type { Event, EventActionResponse, CreateEventPayload } from "@/lib/types/events";

export function useEventsQuery(params?: { category?: string; clubId?: number }) {
  const searchParams = new URLSearchParams();
  if (params?.category) searchParams.set("category", params.category);
  if (params?.clubId) searchParams.set("clubId", params.clubId.toString());
  const queryStr = searchParams.toString();

  return useQuery({
    queryKey: [...queryKeys.events.all, params],
    queryFn: () => api<Event[]>(`/api/events/all${queryStr ? `?${queryStr}` : ""}`),
  });
}

export function useMyEventsQuery() {
  return useQuery({
    queryKey: queryKeys.events.mine(),
    queryFn: () => api<Event[]>("/api/events/mine"),
  });
}

export function useEventQuery(id: number) {
  return useQuery({
    queryKey: queryKeys.events.detail(id),
    queryFn: () => api<Event>(`/api/events/${id}`),
    enabled: !!id,
  });
}

export function useCreateEventMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateEventPayload) =>
      api<EventActionResponse>("/api/events/create", {
        method: "POST",
        body: payload,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.events.all });
    },
  });
}

export function useAssignCollaboratingClubsMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ eventId, clubIds }: { eventId: number; clubIds: number[] }) =>
      api<EventActionResponse>(`/api/events/${eventId}/collaborating-clubs`, {
        method: "POST",
        body: clubIds,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.events.all });
    },
  });
}

export function useAddPhotoMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ eventId, file }: { eventId: number; file: File }) => {
      const formData = new FormData();
      formData.append("file", file);
      return fetch(`/api/events/${eventId}/photos`, {
        method: "POST",
        body: formData,
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.events.all });
    },
  });
}

export function useAddVideoMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ eventId, url }: { eventId: number; url: string }) =>
      api<EventActionResponse>(`/api/events/${eventId}/videos`, {
        method: "POST",
        body: { url },
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.events.all });
    },
  });
}

export function useDeletePhotoMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ eventId, photoId }: { eventId: number; photoId: number }) =>
      api<EventActionResponse>(`/api/events/${eventId}/photos/${photoId}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.events.all });
    },
  });
}

export function useDeleteVideoMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ eventId, videoId }: { eventId: number; videoId: number }) =>
      api<EventActionResponse>(`/api/events/${eventId}/videos/${videoId}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.events.all });
    },
  });
}
