import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/fetcher";
import { queryKeys } from "./keys";
import { isCurrentAdmin, isCurrentMainAdmin } from "@/lib/auth";

export function usePendingUsersQuery(options?: { enabled?: boolean }) {
  const isAuthorized = isCurrentAdmin();
  return useQuery({
    queryKey: queryKeys.admin.pending,
    queryFn: () => api<{ id: number; name: string; email: string }[]>("/admin/pending"),
    enabled: (options?.enabled ?? true) && isAuthorized,
  });
}

export function useApproveUserMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (userId: number) =>
      api<{ success: boolean }>(`/admin/approve/${userId}`, { method: "POST" }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.admin.pending });
    },
  });
}

export function useRejectUserMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (userId: number) =>
      api<{ success: boolean }>(`/admin/reject/${userId}`, { method: "POST" }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.admin.pending });
    },
  });
}

export function useUsersQuery(params?: Record<string, string>, options?: { enabled?: boolean }) {
  const isAuthorized = isCurrentMainAdmin();
  const searchParams = new URLSearchParams(params).toString();
  return useQuery({
    queryKey: queryKeys.admin.users(params),
    queryFn: () =>
      api<{ id: number; name: string; email: string; roles: string[] }[]>(
        `/admin/users${searchParams ? `?${searchParams}` : ""}`,
      ),
    enabled: (options?.enabled ?? true) && isAuthorized,
  });
}

export function useUserClubsQuery(userId: number, options?: { enabled?: boolean }) {
  const isAuthorized = isCurrentMainAdmin();
  return useQuery({
    queryKey: [...queryKeys.admin.users(), "clubs", userId],
    queryFn: () => api<{ id: number; name: string }[]>(`/admin/users/${userId}/clubs`),
    enabled: (options?.enabled ?? true) && isAuthorized && !!userId,
  });
}

export function useAssignClubMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, clubId }: { userId: number; clubId: number }) =>
      api<{ success: boolean }>(`/admin/users/${userId}/clubs`, {
        method: "POST",
        body: { clubId },
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin"] });
    },
  });
}

export function useRemoveClubMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, clubId }: { userId: number; clubId: number }) =>
      api<{ success: boolean }>(`/admin/users/${userId}/clubs/${clubId}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin"] });
    },
  });
}

export function useClubsQuery(options?: { enabled?: boolean }) {
  const isAuthorized = isCurrentMainAdmin();
  return useQuery({
    queryKey: queryKeys.admin.clubs(),
    queryFn: () => api<{ id: number; name: string }[]>("/admin/clubs"),
    enabled: (options?.enabled ?? true) && isAuthorized,
  });
}
