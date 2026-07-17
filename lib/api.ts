// lib/api.ts
// API utilities for interacting with the Spring Boot backend

import { api } from "@/lib/fetcher";
import { ApiError } from "@/lib/api-error";
import type {
  Skill,
  AlumniSkill,
  AlumniSkillSummary,
  CreateSkillRequest,
  UpdateSkillRequest,
  Course,
} from "@/types";

// ==================== Skills API ====================

export async function getStarterSkills(courseId: number): Promise<Skill[]> {
  if (!courseId) throw new Error("courseId is required");
  return api(`/api/skills/starters?courseId=${courseId}`);
}

export async function getApprovedSkills(courseId: number): Promise<Skill[]> {
  if (!courseId) throw new Error("courseId is required");
  return api(`/api/skills/approved?courseId=${courseId}`);
}

export async function searchSkills(
  query: string,
  options?: {
    courseId?: number;
    approvedOnly?: boolean;
    starterOnly?: boolean;
  },
): Promise<Skill[]> {
  const params = new URLSearchParams();
  if (query) params.append("query", query);
  if (options?.courseId) params.append("courseId", options.courseId.toString());
  if (options?.approvedOnly !== undefined)
    params.append("approvedOnly", options.approvedOnly.toString());
  if (options?.starterOnly !== undefined)
    params.append("starterOnly", options.starterOnly.toString());
  return api(`/api/skills/search?${params}`);
}

export async function getSkill(skillId: number): Promise<Skill> {
  if (!skillId) throw new Error("skillId is required");
  return api(`/api/skills/${skillId}`);
}

export async function createSkill(data: CreateSkillRequest): Promise<Skill> {
  if (!data.name || !data.courseId)
    throw new Error("name and courseId are required");
  return api("/api/skills", { method: "POST", body: data });
}

export async function updateSkill(
  skillId: number,
  data: UpdateSkillRequest,
): Promise<Skill> {
  if (!skillId) throw new Error("skillId is required");
  return api(`/api/skills/${skillId}`, { method: "PUT", body: data });
}

export async function deleteSkill(skillId: number): Promise<void> {
  await api(`/api/skills/${skillId}`, { method: "DELETE" });
}

export async function getPendingSkills(): Promise<Skill[]> {
  return api("/api/skills/pending");
}

// ==================== Alumni Skills API ====================

export async function getAlumniSkills(
  alumniId: number,
): Promise<AlumniSkill[]> {
  if (!alumniId) throw new Error("alumniId is required");
  return api(`/api/alumni-skills/alumni/${alumniId}`);
}

export async function getAlumniSkillsSummary(
  alumniId: number,
): Promise<AlumniSkillSummary> {
  if (!alumniId) throw new Error("alumniId is required");
  try {
    return await api(`/api/alumni-skills/alumni/${alumniId}/summary`);
  } catch (err: unknown) {
    if (err instanceof ApiError && err.status === 404) {
      return {
        alumniId,
        alumniName: "",
        courseId: 0,
        courseCode: "",
        skills: [],
      };
    }
    throw err;
  }
}

export async function getAlumniBySkill(
  skillId: number,
): Promise<AlumniSkill[]> {
  if (!skillId) throw new Error("skillId is required");
  return api(`/api/alumni-skills/skill/${skillId}`);
}

export async function addSkillToAlumni(
  alumniId: number,
  skillId: number,
): Promise<AlumniSkill> {
  if (!alumniId) throw new Error("alumniId is required");
  if (!skillId) throw new Error("skillId is required");
  return api(`/api/alumni-skills/alumni/${alumniId}`, {
    method: "POST",
    body: { skillId },
  });
}

export async function removeSkillFromAlumni(
  alumniId: number,
  skillId: number,
): Promise<void> {
  if (!alumniId) throw new Error("alumniId is required");
  if (!skillId) throw new Error("skillId is required");
  await api(`/api/alumni-skills/alumni/${alumniId}/skill/${skillId}`, {
    method: "DELETE",
  });
}

export async function getAllAlumniSkills(): Promise<AlumniSkill[]> {
  return api("/api/alumni-skills/all");
}

// ==================== Courses API ====================

export async function getCourses(): Promise<Course[]> {
  return api("/api/courses");
}

export async function getCourse(courseId: number): Promise<Course> {
  if (!courseId) throw new Error("courseId is required");
  return api(`/api/courses/${courseId}`);
}

// ==================== Admin Skills API ====================

export async function getPendingSkillsAdmin(): Promise<Skill[]> {
  return api("/api/skills/pending");
}

export async function getAllSkillsAdmin(): Promise<Skill[]> {
  return api("/api/skills/all");
}

export async function updateSkillAdmin(
  skillId: number,
  data: UpdateSkillRequest,
): Promise<Skill> {
  if (!skillId) throw new Error("skillId is required");
  return api(`/api/skills/${skillId}`, { method: "PUT", body: data });
}

export async function approveSkillAdmin(
  skillId: number,
  skillName: string,
): Promise<Skill> {
  return updateSkillAdmin(skillId, { name: skillName, isApproved: true });
}

export async function rejectSkillAdmin(
  skillId: number,
  skillName: string,
): Promise<Skill> {
  return updateSkillAdmin(skillId, { name: skillName, isApproved: false });
}

export async function deleteSkillAdmin(skillId: number): Promise<void> {
  await api(`/api/skills/${skillId}`, { method: "DELETE" });
}
