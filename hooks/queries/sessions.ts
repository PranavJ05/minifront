import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/fetcher";
import { queryKeys } from "./keys";

export function useSessionsQuery() {
  return useQuery({
    queryKey: queryKeys.sessions.all,
    queryFn: () => api<{ id: number; title: string }[]>("/api/sessions"),
  });
}

export function useSessionQuery(id: number) {
  return useQuery({
    queryKey: queryKeys.sessions.detail(id),
    queryFn: () => api<{ id: number; title: string }>(`/api/sessions/${id}`),
    enabled: !!id,
  });
}

export function useCreateSessionMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Record<string, unknown>) =>
      api<{ success: boolean }>("/api/sessions", {
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
      api<{ success: boolean }>(`/api/sessions/${sessionId}/register`, {
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
      api<{ success: boolean }>(`/api/sessions/${sessionId}/register`, {
        method: "DELETE",
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
      api<{ success: boolean }>(`/api/sessions/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.sessions.all });
    },
  });
}

export function useRegistrationsQuery(sessionId: number) {
  return useQuery({
    queryKey: queryKeys.sessions.registrations(sessionId),
    queryFn: () =>
      api<{ id: number; name: string }[]>(`/api/sessions/${sessionId}/registrations`),
    enabled: !!sessionId,
  });
}

export function useUploadSessionPhotoMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ sessionId, file }: { sessionId: number; file: File }) => {
      const formData = new FormData();
      formData.append("file", file);
      return api(`/api/sessions/${sessionId}/media/photo`, {
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
      api<{ photos: string[]; videos: string[] }>(`/api/sessions/${sessionId}/media`),
    enabled: !!sessionId,
  });
}

export function useDeleteSessionMediaMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ mediaId }: { mediaId: number }) =>
      api<{ success: boolean }>(`/api/sessions/media/${mediaId}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.sessions.all });
    },
  });
}
