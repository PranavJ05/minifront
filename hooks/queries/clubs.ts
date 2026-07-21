import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/fetcher";
import { queryKeys } from "./keys";

export interface ClubItem {
  id: number;
  name: string;
  description?: string;
  logoUrl?: string;
}

export function useAllClubsQuery() {
  return useQuery({
    queryKey: queryKeys.clubs.all,
    queryFn: () => api<ClubItem[]>("/api/clubs"),
  });
}

export function useMyClubsQuery() {
  return useQuery({
    queryKey: queryKeys.clubs.my(),
    queryFn: () => api<ClubItem[]>("/api/clubs/my-clubs"),
  });
}
