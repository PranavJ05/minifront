import { api } from "@/lib/fetcher";
import type {
  ApplicationStatusResponse,
  CanEditResponse,
  CreateMentorshipRequest,
  Mentorship,
  MentorshipApplication,
  UpdateApplicationStatusRequest,
  UpdateMentorshipRequest,
} from "@/lib/types/mentorship";

export async function getAllMentorships(): Promise<Mentorship[]> {
  return api("/api/mentorships");
}

export async function getMentorship(id: number): Promise<Mentorship> {
  return api(`/api/mentorships/${id}`);
}

export async function createMentorship(request: CreateMentorshipRequest) {
  return api("/api/mentorships", {
    method: "POST",
    body: request,
  });
}

export async function updateMentorship(id: number, request: UpdateMentorshipRequest) {
  return api(`/api/mentorships/${id}`, {
    method: "PUT",
    body: request,
  });
}

export async function deleteMentorship(id: number) {
  return api(`/api/mentorships/${id}`, { method: "DELETE" });
}

export async function applyMentorship(id: number, motivation: string, resume: File | null) {
  const formData = new FormData();
  formData.append(
    "data",
    new Blob([JSON.stringify({ motivation })], { type: "application/json" }),
  );
  if (resume) formData.append("resume", resume);
  return api(`/api/mentorships/${id}/apply`, {
    method: "POST",
    body: formData,
  });
}

export async function cancelApplication(id: number) {
  return api(`/api/mentorships/${id}/apply`, { method: "DELETE" });
}

export async function getApplicants(id: number): Promise<MentorshipApplication[]> {
  return api(`/api/mentorships/${id}/applications`);
}

export async function updateApplicationStatus(
  mentorshipId: number,
  applicationId: number,
  request: UpdateApplicationStatusRequest,
): Promise<MentorshipApplication> {
  return api(`/api/mentorships/${mentorshipId}/applications/${applicationId}/status`, {
    method: "PATCH",
    body: request,
  });
}

export async function forceCloseMentorshipApplications(mentorshipId: number): Promise<Mentorship> {
  return api(`/api/mentorships/${mentorshipId}/admin/force-close-applications`, {
    method: "POST",
  });
}

export async function finalSubmitMentorship(mentorshipId: number): Promise<Mentorship> {
  return api(`/api/mentorships/${mentorshipId}/final-submit`, {
    method: "POST",
  });
}

export async function getFinalMentees(id: number): Promise<MentorshipApplication[]> {
  return api(`/api/mentorships/${id}/final-mentees`);
}

export async function canEdit(id: number): Promise<CanEditResponse> {
  return api(`/api/mentorships/${id}/can-edit`);
}

export async function getApplicationStatus(id: number): Promise<ApplicationStatusResponse> {
  return api(`/api/mentorships/${id}/application-status`);
}

export async function getMyMentorships(): Promise<Mentorship[]> {
  return api("/api/mentorships/mine");
}
