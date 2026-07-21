import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/fetcher";
import { queryKeys } from "./keys";

export function useMarkWelcomeSeenMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: queryKeys.onboarding.markWelcomeSeen(),
    mutationFn: () =>
      api<void>("/api/profile/welcome-seen", { method: "POST" }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.profile.me() });
    },
  });
}
