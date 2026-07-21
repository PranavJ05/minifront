import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/fetcher";
import { queryKeys } from "./keys";
import { hasAuthToken, isCurrentAlumni } from "@/lib/auth";

export interface Opportunity {
  id: number;
  title: string;
  company: string;
  description?: string;
  location: string;
  type: string;
  applyLink?: string;
  allowReferrals?: boolean;
  verified?: boolean;
  postedByName?: string;
  postedAt: string;
}

export interface CreateOpportunityInput {
  title: string;
  company: string;
  description: string;
  location: string;
  type: string;
  applyLink: string;
  allowReferrals: boolean;
}

export function useOpportunitiesQuery(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: queryKeys.opportunities.all,
    queryFn: () => api<Opportunity[]>("/api/opportunities/all"),
    enabled: (options?.enabled ?? true) && hasAuthToken(),
  });
}

export function useMyOpportunitiesQuery(options?: { enabled?: boolean }) {
  const isAuthorized = isCurrentAlumni();
  return useQuery({
    queryKey: queryKeys.opportunities.mine(),
    queryFn: () => api<Opportunity[]>("/api/opportunities/mine"),
    enabled: (options?.enabled ?? true) && isAuthorized,
  });
}

export function useCreateOpportunityMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateOpportunityInput) =>
      api<Opportunity>("/api/opportunities/create", {
        method: "POST",
        body: payload,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.opportunities.all });
      qc.invalidateQueries({ queryKey: queryKeys.opportunities.mine() });
    },
  });
}

export function useVerifyOpportunityMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      api<Opportunity>(`/api/opportunities/${id}/verify`, {
        method: "POST",
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.opportunities.all });
      qc.invalidateQueries({ queryKey: queryKeys.opportunities.mine() });
    },
  });
}
