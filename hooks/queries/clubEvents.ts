import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/fetcher";
import { queryKeys } from "./keys";

export function useClubEventsQuery() {
  return useQuery({
    queryKey: queryKeys.clubEvents.all,
    queryFn: () => api<{ id: number; title: string }[]>("/club-events/all"),
  });
}

export function useClubEventQuery(id: number) {
  return useQuery({
    queryKey: queryKeys.clubEvents.detail(id),
    queryFn: () => api<{ id: number; title: string }>(`/club-events/${id}`),
    enabled: !!id,
  });
}

export function useMyClubEventsQuery() {
  return useQuery({
    queryKey: queryKeys.clubEvents.mine(),
    queryFn: () => api<{ id: number; title: string }[]>("/club-events/mine"),
  });
}

export function useCreateClubEventMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Record<string, unknown>) =>
      api<{ success: boolean }>("/club-events/create", {
        method: "POST",
        body: payload,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.clubEvents.all });
    },
  });
}

export function useUpdateClubEventMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }: Record<string, unknown>) =>
      api<{ success: boolean }>(`/club-events/${id}`, {
        method: "PUT",
        body: payload,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.clubEvents.all });
    },
  });
}

export function useDeleteClubEventMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      api<{ success: boolean }>(`/club-events/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.clubEvents.all });
    },
  });
}

export function useClubEventForEditQuery(id: number) {
  return useQuery({
    queryKey: queryKeys.clubEvents.edit(id),
    queryFn: () => api<{ id: number; title: string }>(`/club-events/${id}/edit`),
    enabled: !!id,
  });
}

export function useUploadClubEventCoverMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ eventId, file }: { eventId: number; file: File }) => {
      const formData = new FormData();
      formData.append("file", file);
      return fetch(`/club-events/${eventId}/cover`, {
        method: "POST",
        body: formData,
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.clubEvents.all });
    },
  });
}
