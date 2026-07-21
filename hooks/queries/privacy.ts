import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/fetcher";
import { queryKeys } from "./keys";
import { hasAuthToken, isCurrentAlumni } from "@/lib/auth";
import type { AlumniPrivacySettings } from "@/lib/types/privacy";

export function useAlumniPrivacyQuery(options?: { enabled?: boolean }) {
  const isAuthorized = isCurrentAlumni() && hasAuthToken();
  return useQuery({
    queryKey: queryKeys.privacy.settings(),
    queryFn: () => api<AlumniPrivacySettings>("/api/alumni/privacy"),
    enabled: (options?.enabled ?? true) && isAuthorized,
  });
}

export function useUpdateAlumniPrivacyMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<AlumniPrivacySettings>) =>
      api<AlumniPrivacySettings>("/api/alumni/privacy", {
        method: "PUT",
        body: payload,
      }),
    onSuccess: (data) => {
      qc.setQueryData(queryKeys.privacy.settings(), data);
      qc.invalidateQueries({ queryKey: queryKeys.alumni.all });
    },
  });
}
