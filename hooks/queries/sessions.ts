import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/fetcher";
import { queryKeys } from "./keys";

export function useSessionsQuery() {
  return useQuery({
    queryKey: queryKeys.sessions.all,
    queryFn: () => api<{ id: number; title: string }[]>("/sessions/all"),
  });
}

export function useSessionQuery(id: number) {
  return useQuery({
    queryKey: queryKeys.sessions.detail(id),
    queryFn: () => api<{ id: number; title: string }>(`/sessions/${id}`),
    enabled: !!id,
  });
}

export function useCreateSessionMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Record<string, unknown>) =>
      api<{ success: boolean }>("/sessions/create", {
        method: "POST",
        body: payload,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.sessions.all });
    },
  });
}

export function useRegisterForSessionMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (sessionId: number) =>
      api<{ success: boolean }>(`/sessions/${sessionId}/register`, {
        method: "POST",
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.sessions.all });
    },
  });
}

export function useCancelRegistrationMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (sessionId: number) =>
      api<{ success: boolean }>(`/sessions/${sessionId}/cancel-registration`, {
        method: "POST",
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.sessions.all });
    },
  });
}

export function useDeleteSessionMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      api<{ success: boolean }>(`/sessions/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.sessions.all });
    },
  });
}

export function useRegistrationsQuery(sessionId: number) {
  return useQuery({
    queryKey: queryKeys.sessions.registrations(sessionId),
    queryFn: () =>
      api<{ id: number; name: string }[]>(`/sessions/${sessionId}/registrations`),
    enabled: !!sessionId,
  });
}

export function useUploadSessionPhotoMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ sessionId, file }: { sessionId: number; file: File }) => {
      const formData = new FormData();
      formData.append("file", file);
      return fetch(`/sessions/${sessionId}/photos`, {
        method: "POST",
        body: formData,
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.sessions.all });
    },
  });
}

export function useSessionMediaQuery(sessionId: number) {
  return useQuery({
    queryKey: queryKeys.sessions.media(sessionId),
    queryFn: () =>
      api<{ photos: string[]; videos: string[] }>(`/sessions/${sessionId}/media`),
    enabled: !!sessionId,
  });
}

export function useDeleteSessionMediaMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ sessionId, mediaId }: { sessionId: number; mediaId: number }) =>
      api<{ success: boolean }>(`/sessions/${sessionId}/media/${mediaId}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.sessions.all });
    },
  });
}
