import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/fetcher";
import { queryKeys } from "./keys";

export interface AlumniProfile {
  id: number;
  name: string;
  profession?: string;
  department?: string;
  location?: string;
  profileImageUrl?: string;
}

export function useAlumniSearchQuery(params?: Record<string, string>) {
  const searchParams = new URLSearchParams(params).toString();
  return useQuery({
    queryKey: queryKeys.alumni.search(params),
    queryFn: () =>
      api<AlumniProfile[]>(`/api/alumni/search${searchParams ? `?${searchParams}` : ""}`),
  });
}

export function useAlumniProfileQuery(id: number) {
  return useQuery({
    queryKey: queryKeys.alumni.detail(id),
    queryFn: () => api<AlumniProfile>(`/api/alumni/${id}`),
    enabled: !!id,
  });
}
