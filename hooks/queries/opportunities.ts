import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/fetcher";
import { queryKeys } from "./keys";

export interface Opportunity {
  id: number;
  title: string;
  company: string;
  location: string;
  type: string;
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

export function useOpportunitiesQuery() {
  return useQuery({
    queryKey: queryKeys.opportunities.all,
    queryFn: () => api<Opportunity[]>("/api/opportunities/all"),
  });
}

export function useMyOpportunitiesQuery() {
  return useQuery({
    queryKey: queryKeys.opportunities.mine(),
    queryFn: () => api<Opportunity[]>("/api/opportunities/mine"),
  });
}

export function useCreateOpportunityMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateOpportunityInput) =>
      api<{ success: boolean }>("/api/opportunities/create", {
        method: "POST",
        body: payload,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.opportunities.all });
      qc.invalidateQueries({ queryKey: queryKeys.opportunities.mine() });
    },
  });
}
