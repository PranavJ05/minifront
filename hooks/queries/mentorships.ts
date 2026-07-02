import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/fetcher";
import { queryKeys } from "./keys";

export interface Mentorship {
  id: number;
  title: string;
  description?: string;
  mentorName?: string;
  mentorId?: number;
}

export interface Applicant {
  id: number;
  name: string;
  status: string;
}

export function useMentorshipsQuery() {
  return useQuery({
    queryKey: queryKeys.mentorships.all,
    queryFn: () => api<Mentorship[]>("/mentorships/all"),
  });
}

export function useMentorshipQuery(id: number) {
  return useQuery({
    queryKey: queryKeys.mentorships.detail(id),
    queryFn: () => api<Mentorship>(`/mentorships/${id}`),
    enabled: !!id,
  });
}

export function useCreateMentorshipMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Record<string, unknown>) =>
      api<{ success: boolean }>("/mentorships/create", {
        method: "POST",
        body: payload,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.mentorships.all });
    },
  });
}

export function useUpdateMentorshipMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }: Record<string, unknown>) =>
      api<{ success: boolean }>(`/mentorships/${id}`, {
        method: "PUT",
        body: payload,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.mentorships.all });
    },
  });
}

export function useDeleteMentorshipMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      api<{ success: boolean }>(`/mentorships/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.mentorships.all });
    },
  });
}

export function useApplyMentorshipMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (mentorshipId: number) =>
      api<{ success: boolean }>(`/mentorships/${mentorshipId}/apply`, {
        method: "POST",
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.mentorships.all });
    },
  });
}

export function useCancelApplicationMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (mentorshipId: number) =>
      api<{ success: boolean }>(`/mentorships/${mentorshipId}/cancel`, {
        method: "POST",
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.mentorships.all });
    },
  });
}

export function useGetApplicantsQuery(mentorshipId: number) {
  return useQuery({
    queryKey: queryKeys.mentorships.applicants(mentorshipId),
    queryFn: () => api<Applicant[]>(`/mentorships/${mentorshipId}/applicants`),
    enabled: !!mentorshipId,
  });
}

export function useUpdateApplicationStatusMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      mentorshipId,
      applicationId,
      status,
    }: {
      mentorshipId: number;
      applicationId: number;
      status: string;
    }) =>
      api<{ success: boolean }>(
        `/mentorships/${mentorshipId}/applications/${applicationId}`,
        { method: "PUT", body: { status } },
      ),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.mentorships.all });
    },
  });
}

export function useForceCloseApplicationsMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (mentorshipId: number) =>
      api<{ success: boolean }>(`/mentorships/${mentorshipId}/close`, {
        method: "POST",
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.mentorships.all });
    },
  });
}

export function useFinalSubmitMentorshipMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (mentorshipId: number) =>
      api<{ success: boolean }>(`/mentorships/${mentorshipId}/final-submit`, {
        method: "POST",
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.mentorships.all });
    },
  });
}

export function useGetFinalMenteesQuery(mentorshipId: number) {
  return useQuery({
    queryKey: queryKeys.mentorships.finalMentees(mentorshipId),
    queryFn: () => api<Applicant[]>(`/mentorships/${mentorshipId}/final-mentees`),
    enabled: !!mentorshipId,
  });
}

export function useGetApplicationStatusQuery(mentorshipId: number) {
  return useQuery({
    queryKey: queryKeys.mentorships.applicationStatus(mentorshipId),
    queryFn: () => api<{ status: string }>(`/mentorships/${mentorshipId}/application-status`),
    enabled: !!mentorshipId,
  });
}

export function useMyMentorshipsQuery() {
  return useQuery({
    queryKey: queryKeys.mentorships.my(),
    queryFn: () => api<Mentorship[]>("/mentorships/mine"),
  });
}

export function useCanEditQuery(mentorshipId: number) {
  return useQuery({
    queryKey: [...queryKeys.mentorships.detail(mentorshipId), "can-edit"],
    queryFn: () => api<{ canEdit: boolean }>(`/mentorships/${mentorshipId}/can-edit`),
    enabled: !!mentorshipId,
  });
}
