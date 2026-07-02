import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/fetcher";
import { queryKeys } from "./keys";

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

export function useMyReferralsQuery() {
  return useQuery({
    queryKey: queryKeys.referrals.mine(),
    queryFn: () => api<ReferralRequest[]>("/referrals/mine"),
  });
}

export function useReceivedReferralsQuery() {
  return useQuery({
    queryKey: queryKeys.referrals.received(),
    queryFn: () => api<ReferralRequest[]>("/referrals/received"),
  });
}

export function useRequestReferralMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: { email: string; message?: string }) =>
      api<{ success: boolean }>("/referrals/request", {
        method: "POST",
        body: payload,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["referrals"] });
    },
  });
}
