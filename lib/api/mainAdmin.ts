import { api } from "@/lib/fetcher";
import type {
  AlumniPromotionCandidate,
  BatchAdminCreateRequest,
  BatchAdminSummary,
  BatchAdminUpdateRequest,
} from "@/lib/types/mainAdmin";

export async function getUsers(role?: string) {
  const params = role ? `?role=${role}` : "";
  return api(`/api/main-admin/users${params}`);
}

export async function getUserClubs(userId: number) {
  return api(`/api/main-admin/users/${userId}/clubs`);
}

export async function assignClub(userId: number, clubId: number) {
  return api(`/api/main-admin/users/${userId}/clubs`, {
    method: "POST",
    body: { clubId },
  });
}

export async function removeClub(userClubId: number) {
  return api(`/api/main-admin/users/clubs/${userClubId}`, {
    method: "DELETE",
  });
}

export async function getClubs() {
  return api("/api/clubs");
}

export async function getDashboardStats() {
  return api("/api/main-admin/dashboard");
}

export async function listBatchAdmins(): Promise<BatchAdminSummary[]> {
  return api("/api/admin/batch-admins");
}

export async function getBatchAdminById(id: number): Promise<BatchAdminSummary> {
  return api(`/api/admin/batch-admins/${id}`);
}

export async function createBatchAdmin(request: BatchAdminCreateRequest): Promise<BatchAdminSummary> {
  return api("/api/admin/batch-admins", {
    method: "POST",
    body: request,
  });
}

export async function updateBatchAdmin(id: number, request: BatchAdminUpdateRequest): Promise<BatchAdminSummary> {
  return api(`/api/admin/batch-admins/${id}`, {
    method: "PUT",
    body: request,
  });
}

export async function deleteBatchAdmin(id: number): Promise<string> {
  return api(`/api/admin/batch-admins/${id}`, { method: "DELETE" });
}

export async function listAlumniForBatchAdminPicker(): Promise<AlumniPromotionCandidate[]> {
  const data = await api<Array<Record<string, unknown>>>("/api/alumni/search");
  return data.map((item) => ({
    alumniId: Number(item.id),
    name: typeof item.name === "string" ? item.name : "Unknown",
    email: typeof item.email === "string" ? item.email : "",
    batchYear:
      typeof item.batchYear === "number"
        ? item.batchYear
        : typeof item.batchYear === "string"
          ? Number(item.batchYear)
          : null,
    department:
      typeof item.department === "string"
        ? item.department
        : typeof item.departmentName === "string"
          ? item.departmentName
          : null,
    profession:
      typeof item.profession === "string"
        ? item.profession
        : typeof item.currentRole === "string"
          ? item.currentRole
          : null,
  }));
}
