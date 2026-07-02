import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/fetcher";
import { queryKeys } from "./keys";

export interface FacultyProfile {
  userId: number;
  name: string;
  email: string;
  profileImageUrl: string | null;
  fullName: string;
  designation: string;
  departmentCode: string;
  departmentName: string;
  officeLocation: string | null;
  qualifications: string;
  subjectsTaught: string;
  linkedinUrl: string | null;
  googleScholarUrl: string | null;
  totalExperienceYears: number;
  joinDate: string;
  bio: string | null;
}

export function useFacultyListQuery() {
  return useQuery({
    queryKey: queryKeys.faculty.all,
    queryFn: () => api<FacultyProfile[]>("/api/faculty/all"),
  });
}

export function useFacultyProfileQuery(id: number) {
  return useQuery({
    queryKey: queryKeys.faculty.detail(id),
    queryFn: () => api<FacultyProfile>(`/api/faculty/profile/${id}`),
    enabled: !!id,
  });
}
