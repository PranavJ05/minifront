import { QueryClient, QueryCache, MutationCache } from "@tanstack/react-query";
import { toast } from "sonner";
import { getErrorMessage } from "./get-error-message";
import { ApiError } from "./api-error";

function notifyError(err: unknown) {
  if (err instanceof ApiError && err.status === 401) {
    toast.error("Session expired. Please log in again.");
    return;
  }
  toast.error(getErrorMessage(err));
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: (failureCount, error) => {
        if (error instanceof ApiError && error.status === 401) {
          return false;
        }
        return failureCount < 1;
      },
      refetchOnWindowFocus: false,
    },
    mutations: {
      onError: notifyError,
    },
  },
  queryCache: new QueryCache({ onError: notifyError }),
  mutationCache: new MutationCache({ onError: notifyError }),
});
