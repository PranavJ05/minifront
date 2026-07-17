import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/fetcher";
import { queryKeys } from "./keys";
import type { Mentorship, MentorshipApplication, ApplicationStatusResponse, CanEditResponse } from "@/lib/types/mentorship";

export function useMentorshipsQuery() {
  return useQuery({
    queryKey: queryKeys.mentorships.all,
    queryFn: () => api<Mentorship[]>("/api/mentorships"),
  });
}

export function useMentorshipQuery(id: number) {
  return useQuery({
    queryKey: queryKeys.mentorships.detail(id),
    queryFn: () => api<Mentorship>(`/api/mentorships/${id}`),
    enabled: !!id,
  });
}

export function useCreateMentorshipMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Record<string, unknown>) =>
      api<{ success: boolean }>("/api/mentorships", {
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
      api<{ success: boolean }>(`/api/mentorships/${id}`, {
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
      api<{ success: boolean }>(`/api/mentorships/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.mentorships.all });
    },
  });
}

export function useApplyMentorshipMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ mentorshipId, motivation, resume }: { mentorshipId: number; motivation: string; resume: File | null }) => {
      const formData = new FormData();
      formData.append("data", new Blob([JSON.stringify({ motivation })], { type: "application/json" }));
      if (resume) formData.append("resume", resume);
      return api<{ success: boolean }>(`/api/mentorships/${mentorshipId}/apply`, {
        method: "POST",
        body: formData,
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.mentorships.all });
    },
  });
}

export function useCancelApplicationMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (mentorshipId: number) =>
      api<{ success: boolean }>(`/api/mentorships/${mentorshipId}/apply`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.mentorships.all });
    },
  });
}

export function useGetApplicantsQuery(mentorshipId: number) {
  return useQuery({
    queryKey: queryKeys.mentorships.applicants(mentorshipId),
    queryFn: () => api<MentorshipApplication[]>(`/api/mentorships/${mentorshipId}/applications`),
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
      api<MentorshipApplication>(
        `/api/mentorships/${mentorshipId}/applications/${applicationId}/status`,
        { method: "PATCH", body: { status } },
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
      api<Mentorship>(`/api/mentorships/${mentorshipId}/admin/force-close-applications`, {
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
      api<Mentorship>(`/api/mentorships/${mentorshipId}/final-submit`, {
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
    queryFn: () => api<MentorshipApplication[]>(`/api/mentorships/${mentorshipId}/final-mentees`),
    enabled: !!mentorshipId,
  });
}

export function useGetApplicationStatusQuery(mentorshipId: number) {
  return useQuery({
    queryKey: queryKeys.mentorships.applicationStatus(mentorshipId),
    queryFn: () => api<ApplicationStatusResponse>(`/api/mentorships/${mentorshipId}/application-status`),
    enabled: !!mentorshipId,
  });
}

export function useMyMentorshipsQuery() {
  return useQuery({
    queryKey: queryKeys.mentorships.my(),
    queryFn: () => api<Mentorship[]>("/api/mentorships/mine"),
  });
}

export function useCanEditQuery(mentorshipId: number) {
  return useQuery({
    queryKey: [...queryKeys.mentorships.detail(mentorshipId), "can-edit"],
    queryFn: () => api<CanEditResponse>(`/api/mentorships/${mentorshipId}/can-edit`),
    enabled: !!mentorshipId,
  });
}
