import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/fetcher";
import { queryKeys } from "./keys";
import type {
  Mentorship,
  MentorshipApplication,
  ApplicationStatusResponse,
  CanEditResponse,
  MentorshipUpdate,
  MyApplication,
} from "@/lib/types/mentorship";

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
    mutationFn: ({ mentorshipId, motivation, cgpaAtApplication, resume }: { mentorshipId: number; motivation: string; cgpaAtApplication: number; resume: File | null }) => {
      const formData = new FormData();
      formData.append("data", new Blob([JSON.stringify({ motivation, cgpaAtApplication })], { type: "application/json" }));
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

export function useGetFinalMenteesQuery(mentorshipId: number, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: queryKeys.mentorships.finalMentees(mentorshipId),
    queryFn: () => api<MentorshipApplication[]>(`/api/mentorships/${mentorshipId}/final-mentees`),
    enabled: !!mentorshipId && (options?.enabled ?? true),
  });
}

export function useGetApplicationStatusQuery(mentorshipId: number, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: queryKeys.mentorships.applicationStatus(mentorshipId),
    queryFn: () => api<ApplicationStatusResponse>(`/api/mentorships/${mentorshipId}/application-status`),
    enabled: !!mentorshipId && (options?.enabled ?? true),
  });
}

export function useMyMentorshipsQuery() {
  return useQuery({
    queryKey: queryKeys.mentorships.my(),
    queryFn: () => api<Mentorship[]>("/api/mentorships/mine"),
  });
}

export function useMyApplicationsQuery(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: queryKeys.mentorships.myApplications(),
    queryFn: () => api<MyApplication[]>("/api/mentorships/my-applications"),
    enabled: options?.enabled ?? true,
  });
}

export function useCanEditQuery(mentorshipId: number) {
  return useQuery({
    queryKey: [...queryKeys.mentorships.detail(mentorshipId), "can-edit"],
    queryFn: () => api<CanEditResponse>(`/api/mentorships/${mentorshipId}/can-edit`),
    enabled: !!mentorshipId,
  });
}

export function useConfirmMatchMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (applicationId: number) =>
      api<void>(`/api/mentorships/applications/${applicationId}/confirm`, {
        method: "POST",
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.mentorships.all });
    },
  });
}

export function useDeclineMatchMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (applicationId: number) =>
      api<void>(`/api/mentorships/applications/${applicationId}/decline`, {
        method: "POST",
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.mentorships.all });
    },
  });
}

export function usePostUpdateMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      applicationId,
      content,
      isMilestone,
    }: {
      applicationId: number;
      content: string;
      isMilestone?: boolean;
    }) =>
      api<MentorshipUpdate>(`/api/mentorships/applications/${applicationId}/updates`, {
        method: "POST",
        body: { content, isMilestone },
      }),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({
        queryKey: queryKeys.mentorships.updates(variables.applicationId),
      });
    },
  });
}

export function useGetUpdatesQuery(applicationId: number) {
  return useQuery({
    queryKey: queryKeys.mentorships.updates(applicationId),
    queryFn: () =>
      api<MentorshipUpdate[]>(
        `/api/mentorships/applications/${applicationId}/updates`,
      ),
    enabled: !!applicationId,
  });
}

export function useMarkCompleteMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (applicationId: number) =>
      api<void>(`/api/mentorships/applications/${applicationId}/complete`, {
        method: "POST",
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.mentorships.all });
    },
  });
}

export function useSubmitFeedbackMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      applicationId,
      rating,
      comment,
    }: {
      applicationId: number;
      rating: number;
      comment?: string;
    }) =>
      api<void>(`/api/mentorships/applications/${applicationId}/feedback`, {
        method: "POST",
        body: { rating, comment },
      }),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({
        queryKey: queryKeys.mentorships.feedbackExists(variables.applicationId),
      });
      qc.invalidateQueries({ queryKey: queryKeys.mentorships.all });
    },
  });
}
