import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/fetcher";
import { queryKeys } from "./keys";

export function useCoursesQuery() {
  return useQuery({
    queryKey: queryKeys.skills.courses(),
    queryFn: () => api<{ id: number; name: string }[]>("/courses"),
  });
}

export function useStarterSkillsQuery() {
  return useQuery({
    queryKey: ["skills", "starter"],
    queryFn: () => api<{ id: number; name: string }[]>("/skills/starter"),
  });
}

export function useApprovedSkillsQuery() {
  return useQuery({
    queryKey: ["skills", "approved"],
    queryFn: () => api<{ id: number; name: string }[]>("/skills/approved"),
  });
}

export function useSearchSkillsQuery(query: string) {
  return useQuery({
    queryKey: queryKeys.skills.search(query),
    queryFn: () =>
      api<{ id: number; name: string }[]>(
        `/skills/search?q=${encodeURIComponent(query)}`,
      ),
    enabled: query.length > 0,
  });
}

export function useAlumniSkillsQuery(alumniId: number) {
  return useQuery({
    queryKey: queryKeys.skills.alumni(alumniId),
    queryFn: () => api<{ id: number; name: string }[]>(`/alumni/${alumniId}/skills`),
    enabled: !!alumniId,
  });
}

export function useAlumniSkillsSummaryQuery(alumniId: number) {
  return useQuery({
    queryKey: queryKeys.skills.summary(alumniId),
    queryFn: () =>
      api<{ category: string; skills: { id: number; name: string }[] }[]>(
        `/alumni/${alumniId}/skills/summary`,
      ),
    enabled: !!alumniId,
  });
}

export function useAddSkillToAlumniMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ alumniId, skillId }: { alumniId: number; skillId: number }) =>
      api<{ success: boolean }>(`/alumni/${alumniId}/skills`, {
        method: "POST",
        body: { skillId },
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["skills"] });
    },
  });
}

export function useRemoveSkillFromAlumniMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ alumniId, skillId }: { alumniId: number; skillId: number }) =>
      api<{ success: boolean }>(`/alumni/${alumniId}/skills/${skillId}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["skills"] });
    },
  });
}

export function usePendingSkillsQuery() {
  return useQuery({
    queryKey: queryKeys.skills.pending(),
    queryFn: () => api<{ id: number; name: string }[]>("/skills/pending"),
  });
}

export function useApproveSkillMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (skillId: number) =>
      api<{ success: boolean }>(`/skills/${skillId}/approve`, {
        method: "POST",
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.skills.pending() });
    },
  });
}

export function useRejectSkillMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (skillId: number) =>
      api<{ success: boolean }>(`/skills/${skillId}/reject`, {
        method: "POST",
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.skills.pending() });
    },
  });
}
