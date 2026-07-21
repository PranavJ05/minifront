import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/fetcher";
import { queryKeys } from "./keys";
import type { MyProfileResponse } from "@/lib/types/profile";

export function useMyProfileQuery() {
  return useQuery({
    queryKey: queryKeys.profile.me(),
    queryFn: () => api<MyProfileResponse>("/api/profile/me"),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}

export function useUpdateProfileMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: queryKeys.profile.update(),
    mutationFn: (payload: Record<string, unknown>) =>
      api<MyProfileResponse>("/api/profile/me", { method: "PUT", body: payload }),
    onSuccess: (data) => {
      qc.setQueryData(queryKeys.profile.me(), data);
    },
  });
}
