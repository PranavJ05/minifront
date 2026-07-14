import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/fetcher";
import { queryKeys } from "./keys";

export function useProfileQuery() {
  return useQuery({
    queryKey: queryKeys.profile.me(),
    queryFn: () => api<Record<string, unknown>>("/api/profile/me"),
  });
}

export function usePendingStatusQuery(userId: number | null) {
  return useQuery({
    queryKey: queryKeys.auth.pendingStatus(userId ?? 0),
    queryFn: () => api<boolean>(`/api/auth/pending-status/${userId}`),
    enabled: userId !== null && userId > 0,
  });
}
