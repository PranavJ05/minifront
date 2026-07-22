import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/fetcher";
import { queryKeys } from "./keys";

export interface AlumniProfile {
  id: number;
  name: string;
  email?: string | null;
  profileImageUrl?: string | null;
  batchYear?: number | null;
  department?: string | null;
  courseCode?: string | null;
  courseName?: string | null;
  location?: string | null;
  profession?: string | null;
  linkedinUrl?: string | null;
}

export function useAlumniSearchQuery(params?: Record<string, string>) {
  const searchParams = new URLSearchParams(params).toString();
  return useQuery({
    queryKey: queryKeys.alumni.search(params),
    queryFn: () =>
      api<AlumniProfile[]>(`/api/alumni/search${searchParams ? `?${searchParams}` : ""}`),
  });
}

export const useAlumniQuery = useAlumniSearchQuery;

export function useAlumniProfileQuery(id: number) {
  return useQuery({
    queryKey: queryKeys.alumni.detail(id),
    queryFn: () => api<AlumniProfile>(`/api/alumni/${id}`),
    enabled: !!id,
  });
}
