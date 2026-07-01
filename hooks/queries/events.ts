import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/fetcher";
import { queryKeys } from "./keys";
import type { Event, EventActionResponse, CreateEventPayload } from "@/lib/types/events";

export function useEventsQuery() {
  return useQuery({
    queryKey: queryKeys.events.all,
    queryFn: () => api<Event[]>("/events/all"),
  });
}

export function useMyEventsQuery() {
  return useQuery({
    queryKey: queryKeys.events.mine(),
    queryFn: () => api<Event[]>("/events/mine"),
  });
}

export function useEventQuery(id: number) {
  return useQuery({
    queryKey: queryKeys.events.detail(id),
    queryFn: () => api<Event>(`/events/${id}`),
    enabled: !!id,
  });
}

export function useCreateEventMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateEventPayload) =>
      api<EventActionResponse>("/events/create", {
        method: "POST",
        body: payload,
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
      return fetch(`/events/${eventId}/photos`, {
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
      api<EventActionResponse>(`/events/${eventId}/videos`, {
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
      api<EventActionResponse>(`/events/${eventId}/photos/${photoId}`, {
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
      api<EventActionResponse>(`/events/${eventId}/videos/${videoId}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.events.all });
    },
  });
}
