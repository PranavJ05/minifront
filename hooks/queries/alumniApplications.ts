import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/fetcher";
import { queryKeys } from "./keys";
import type {
  AlumniApplication,
  ApplicationActionResponse,
} from "@/lib/types/alumniApplications";

export function usePendingAlumniApplicationsQuery() {
  return useQuery({
    queryKey: queryKeys.alumniApplications.pending(),
    queryFn: () =>
      api<AlumniApplication[]>("/api/main-admin/alumni-applications/pending"),
  });
}

export function useApproveAlumniApplicationMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (applicationId: number) =>
      api<ApplicationActionResponse>(
        `/api/main-admin/alumni-applications/${applicationId}/approve`,
        {
          method: "POST",
        },
      ),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: queryKeys.alumniApplications.pending(),
      });
      qc.invalidateQueries({ queryKey: queryKeys.alumniApplications.all });
    },
  });
}

export function useRejectAlumniApplicationMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (applicationId: number) =>
      api<ApplicationActionResponse>(
        `/api/main-admin/alumni-applications/${applicationId}/reject`,
        {
          method: "POST",
        },
      ),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: queryKeys.alumniApplications.pending(),
      });
      qc.invalidateQueries({ queryKey: queryKeys.alumniApplications.all });
    },
  });
}
