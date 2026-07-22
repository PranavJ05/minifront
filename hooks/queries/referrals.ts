import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/fetcher";
import { queryKeys } from "./keys";
import { hasAuthToken, isCurrentAlumni } from "@/lib/auth";

export interface ReferralRequest {
  id: number;
  opportunityId: number;
  requesterUserId: number;
  referrerUserId: number;
  message: string | null;
  resumeLink: string | null;
  status: "PENDING" | "APPROVED" | "REJECTED";
  responseMessage: string | null;
  requestedAt: string;
  reviewedAt: string | null;
}

export function useMyReferralsQuery(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: queryKeys.referrals.mine(),
    queryFn: () => api<ReferralRequest[]>("/api/referrals/mine"),
    enabled: (options?.enabled ?? true) && hasAuthToken(),
  });
}

export function useReceivedReferralsQuery(options?: { enabled?: boolean }) {
  const isAuthorized = isCurrentAlumni();
  return useQuery({
    queryKey: queryKeys.referrals.received(),
    queryFn: () => api<ReferralRequest[]>("/api/referrals/received"),
    enabled: (options?.enabled ?? true) && isAuthorized,
  });
}

export function useRequestReferralMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: { email: string; message?: string }) =>
      api<{ success: boolean }>("/api/referrals/request", {
        method: "POST",
        body: payload,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["referrals"] });
    },
  });
}
