import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/fetcher";
import { queryKeys } from "./keys";

export function useMyClubsQuery() {
  return useQuery({
    queryKey: queryKeys.clubs.my(),
    queryFn: () => api<{ id: number; name: string }[]>("/api/clubs/my-clubs"),
  });
}
