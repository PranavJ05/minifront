// lib/api.ts
// API utilities for interacting with the Spring Boot backend
// Updated to match backend API documentation

import { BACKEND_URL } from "./config";
import {
  Skill,
  AlumniSkill,
  AlumniSkillSummary,
  CreateSkillRequest,
  UpdateSkillRequest,
} from "@/types";

const API_BASE = BACKEND_URL;

// Helper to get auth token
const getAuthHeaders = (contentType = "application/json"): HeadersInit => {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
    ...(contentType ? { "Content-Type": contentType } : {}),
  };
};

// ==================== Skills API ====================

/**
 * Get starter skills for a course (Public)
 * GET /api/skills/starters?courseId={id}
 */
export async function getStarterSkills(courseId: number): Promise<Skill[]> {
  console.log("========== [API] getStarterSkills CALLED ==========");
  console.log("[API] courseId:", courseId);

  if (!courseId) {
    console.error("[API] courseId is required but was:", courseId);
    throw new Error("courseId is required");
  }

  const res = await fetch(
    `${API_BASE}/api/skills/starters?courseId=${courseId}`,
    {
      headers: getAuthHeaders(),
    },
  );

  console.log("[API] Starter skills response status:", res.status);

  if (!res.ok) {
    const errorText = await res.text().catch(() => "Unknown error");
    console.error("[API] Starter skills error:", errorText);
    throw new Error(`Failed to fetch starter skills: ${res.status}`);
  }

  const data = await res.json();
  console.log("[API] Starter skills received:", data);
  console.log("[API] Starter skills count:", data.length);

  // Validate response
  if (!Array.isArray(data)) {
    console.error("[API] Starter skills response is not an array:", data);
    throw new Error("Invalid starter skills response format");
  }

  console.log("========== [API] getStarterSkills COMPLETE ==========");
  return data;
}

/**
 * Get all approved skills for a course (Public)
 * GET /api/skills/approved?courseId={id}
 */
export async function getApprovedSkills(courseId: number): Promise<Skill[]> {
  console.log("========== [API] getApprovedSkills CALLED ==========");
  console.log("[API] courseId:", courseId);

  if (!courseId) {
    console.error("[API] courseId is required but was:", courseId);
    throw new Error("courseId is required");
  }

  const res = await fetch(
    `${API_BASE}/api/skills/approved?courseId=${courseId}`,
    {
      headers: getAuthHeaders(),
    },
  );

  console.log("[API] Approved skills response status:", res.status);

  if (!res.ok) {
    const errorText = await res.text().catch(() => "Unknown error");
    console.error("[API] Approved skills error:", errorText);
    throw new Error(`Failed to fetch approved skills: ${res.status}`);
  }

  const data = await res.json();
  console.log("[API] Approved skills received:", data);
  console.log("[API] Approved skills count:", data.length);

  // Validate response
  if (!Array.isArray(data)) {
    console.error("[API] Approved skills response is not an array:", data);
    throw new Error("Invalid approved skills response format");
  }

  console.log("========== [API] getApprovedSkills COMPLETE ==========");
  return data;
}

/**
 * Search skills with fuzzy matching (Public)
 * GET /api/skills/search?query={q}&courseId={id}&approvedOnly={bool}&starterOnly={bool}
 */
export async function searchSkills(
  query: string,
  options?: {
    courseId?: number;
    approvedOnly?: boolean;
    starterOnly?: boolean;
  },
): Promise<Skill[]> {
  console.log("========== [API] searchSkills CALLED ==========");
  console.log("[API] query:", query);
  console.log("[API] options:", options);

  const params = new URLSearchParams();
  if (query) params.append("query", query);
  if (options?.courseId) params.append("courseId", options.courseId.toString());
  if (options?.approvedOnly !== undefined)
    params.append("approvedOnly", options.approvedOnly.toString());
  if (options?.starterOnly !== undefined)
    params.append("starterOnly", options.starterOnly.toString());

  const res = await fetch(`${API_BASE}/api/skills/search?${params}`, {
    headers: getAuthHeaders(),
  });

  console.log("[API] Search response status:", res.status);

  if (!res.ok) {
    const errorText = await res.text().catch(() => "Unknown error");
    console.error("[API] Search error:", errorText);
    throw new Error(`Failed to search skills: ${res.status}`);
  }

  const data = await res.json();
  console.log("[API] Search results received:", data);
  console.log("[API] Search results count:", data.length);

  // Validate response
  if (!Array.isArray(data)) {
    console.error("[API] Search response is not an array:", data);
    throw new Error("Invalid search response format");
  }

  console.log("========== [API] searchSkills COMPLETE ==========");
  return data;
}

/**
 * Get a specific skill by ID (Public)
 * GET /api/skills/{skillId}
 */
export async function getSkill(skillId: number): Promise<Skill> {
  console.log("========== [API] getSkill CALLED ==========");
  console.log("[API] skillId:", skillId);

  if (!skillId) {
    console.error("[API] skillId is required but was:", skillId);
    throw new Error("skillId is required");
  }

  const res = await fetch(`${API_BASE}/api/skills/${skillId}`, {
    headers: getAuthHeaders(),
  });

  console.log("[API] Skill response status:", res.status);

  if (!res.ok) {
    const errorText = await res.text().catch(() => "Unknown error");
    console.error("[API] Skill error:", errorText);
    throw new Error(`Skill not found: ${res.status}`);
  }

  const data = await res.json();
  console.log("[API] Skill data received:", data);

  // Validate response
  if (!data || !data.id || !data.name) {
    console.error("[API] Skill data is missing required fields:", data);
    throw new Error("Invalid skill data");
  }

  console.log("========== [API] getSkill COMPLETE ==========");
  return data;
}

/**
 * Create a new skill / Propose custom skill (Auth Required)
 * POST /api/skills
 */
export async function createSkill(data: CreateSkillRequest): Promise<Skill> {
  console.log("========== [API] createSkill CALLED ==========");
  console.log("[API] Request data:", data);

  // Validate request
  if (!data.name || !data.courseId) {
    console.error("[API] name and courseId are required:", data);
    throw new Error("name and courseId are required");
  }

  const res = await fetch(`${API_BASE}/api/skills`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  console.log("[API] Create skill response status:", res.status);

  if (!res.ok) {
    const errorBody = await res.json().catch(() => null);
    console.error("[API] Create skill error:", errorBody);
    throw new Error(errorBody?.message || "Failed to create skill");
  }

  const result = await res.json();
  console.log("[API] Skill created:", result);
  console.log("========== [API] createSkill COMPLETE ==========");
  return result;
}

/**
 * Update a skill (Admin only)
 * PUT /api/skills/{skillId}
 */
export async function updateSkill(
  skillId: number,
  data: UpdateSkillRequest,
): Promise<Skill> {
  console.log("========== [API] updateSkill CALLED ==========");
  console.log("[API] skillId:", skillId);
  console.log("[API] Update data:", data);

  if (!skillId) {
    console.error("[API] skillId is required:", skillId);
    throw new Error("skillId is required");
  }

  const res = await fetch(`${API_BASE}/api/skills/${skillId}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  console.log("[API] Update skill response status:", res.status);

  if (!res.ok) {
    const errorBody = await res.json().catch(() => null);
    console.error("[API] Update skill error:", errorBody);
    throw new Error(errorBody?.message || "Failed to update skill");
  }

  const result = await res.json();
  console.log("[API] Skill updated:", result);
  console.log("========== [API] updateSkill COMPLETE ==========");
  return result;
}

/**
 * Delete a skill (Admin only)
 * DELETE /api/skills/{skillId}
 */
export async function deleteSkill(skillId: number): Promise<void> {
  console.log("========== [API] deleteSkill CALLED ==========");
  console.log("[API] skillId:", skillId);

  const res = await fetch(`${API_BASE}/api/skills/${skillId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  console.log("[API] Delete skill response status:", res.status);

  if (!res.ok) {
    console.error("[API] Delete skill failed");
    throw new Error("Failed to delete skill");
  }

  console.log("========== [API] deleteSkill COMPLETE ==========");
}

/**
 * Get pending skills (Admin only)
 * GET /api/skills/pending
 */
export async function getPendingSkills(): Promise<Skill[]> {
  console.log("========== [API] getPendingSkills CALLED ==========");

  const res = await fetch(`${API_BASE}/api/skills/pending`, {
    headers: getAuthHeaders(),
  });

  console.log("[API] Pending skills response status:", res.status);

  if (!res.ok) {
    throw new Error("Failed to fetch pending skills");
  }

  const data = await res.json();
  console.log("[API] Pending skills received:", data);
  console.log("[API] Pending skills count:", data.length);

  return data;
}

// ==================== Alumni Skills API ====================

/**
 * Get all skills for an alumni (Public)
 * GET /api/alumni-skills/alumni/{alumniId}
 */
export async function getAlumniSkills(
  alumniId: number,
): Promise<AlumniSkill[]> {
  console.log("========== [API] getAlumniSkills CALLED ==========");
  console.log("[API] alumniId:", alumniId);

  if (!alumniId) {
    console.error("[API] alumniId is required:", alumniId);
    throw new Error("alumniId is required");
  }

  const res = await fetch(`${API_BASE}/api/alumni-skills/alumni/${alumniId}`, {
    headers: getAuthHeaders(),
  });

  console.log("[API] Alumni skills response status:", res.status);

  if (!res.ok) {
    const errorText = await res.text().catch(() => "Unknown error");
    console.error("[API] Alumni skills error:", errorText);
    throw new Error("Failed to fetch alumni skills");
  }

  const data = await res.json();
  console.log("[API] Alumni skills received:", data);
  console.log("[API] Alumni skills count:", data.length);

  // Validate response
  if (!Array.isArray(data)) {
    console.error("[API] Alumni skills response is not an array:", data);
    throw new Error("Invalid alumni skills response format");
  }

  console.log("========== [API] getAlumniSkills COMPLETE ==========");
  return data;
}

/**
 * Get skills summary for an alumni (Public)
 * GET /api/alumni-skills/alumni/{alumniId}/summary
 */
export async function getAlumniSkillsSummary(
  alumniId: number,
): Promise<AlumniSkillSummary> {
  console.log("========== [API] getAlumniSkillsSummary CALLED ==========");
  console.log("[API] alumniId:", alumniId);

  if (!alumniId) {
    console.error("[API] alumniId is required:", alumniId);
    throw new Error("alumniId is required");
  }

  const res = await fetch(
    `${API_BASE}/api/alumni-skills/alumni/${alumniId}/summary`,
    {
      headers: getAuthHeaders(),
    },
  );

  console.log("[API] Skills summary response status:", res.status);

  if (!res.ok) {
    // If 404, return empty skills array
    if (res.status === 404) {
      console.log("[API] Alumni skills not found, returning empty");
      return {
        alumniId,
        alumniName: "",
        courseId: 0,
        courseCode: "",
        skills: [],
      };
    }
    const errorText = await res.text().catch(() => "Unknown error");
    console.error("[API] Skills summary error:", errorText);
    throw new Error("Failed to fetch alumni skills summary");
  }

  const data = await res.json();
  console.log("[API] Skills summary received:", data);

  // Validate response structure
  if (!data) {
    console.error("[API] Skills summary data is null/undefined");
    throw new Error("Invalid skills summary response");
  }

  if (!Array.isArray(data.skills)) {
    console.error("[API] Skills summary skills is not an array:", data);
    throw new Error("Invalid skills summary format");
  }

  console.log("[API] Skills count:", data.skills.length);
  console.log("========== [API] getAlumniSkillsSummary COMPLETE ==========");
  return data;
}

/**
 * Get all alumni who have a specific skill (Public)
 * GET /api/alumni-skills/skill/{skillId}
 */
export async function getAlumniBySkill(
  skillId: number,
): Promise<AlumniSkill[]> {
  console.log("========== [API] getAlumniBySkill CALLED ==========");
  console.log("[API] skillId:", skillId);

  if (!skillId) {
    console.error("[API] skillId is required:", skillId);
    throw new Error("skillId is required");
  }

  const res = await fetch(`${API_BASE}/api/alumni-skills/skill/${skillId}`, {
    headers: getAuthHeaders(),
  });

  console.log("[API] Alumni by skill response status:", res.status);

  if (!res.ok) {
    const errorText = await res.text().catch(() => "Unknown error");
    console.error("[API] Alumni by skill error:", errorText);
    throw new Error("Failed to fetch alumni by skill");
  }

  const data = await res.json();
  console.log("[API] Alumni by skill received:", data);
  console.log("[API] Alumni count:", data.length);

  return data;
}

/**
 * Add a skill to alumni profile (Auth Required)
 * POST /api/alumni-skills/alumni/{alumniId}
 * Body: { "skillId": number }
 */
export async function addSkillToAlumni(
  alumniId: number,
  skillId: number,
): Promise<AlumniSkill> {
  console.log("========== [API] addSkillToAlumni CALLED ==========");
  console.log("[API] alumniId:", alumniId);
  console.log("[API] skillId:", skillId);

  // Validate parameters
  if (!alumniId) {
    console.error("[API] alumniId is required:", alumniId);
    throw new Error("alumniId is required");
  }

  if (!skillId) {
    console.error("[API] skillId is required:", skillId);
    throw new Error("skillId is required");
  }

  const token = localStorage.getItem("token");
  console.log("[API] Token exists:", !!token);
  console.log(
    "[API] Token preview:",
    token ? token.substring(0, 20) + "..." : "NO TOKEN",
  );

  const endpoint = `${API_BASE}/api/alumni-skills/alumni/${alumniId}`;
  console.log("[API] Full endpoint:", endpoint);
  console.log("[API] Request body:", JSON.stringify({ skillId }));

  const res = await fetch(endpoint, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ skillId }),
  });

  console.log("[API] Response status:", res.status);
  console.log(
    "[API] Response headers:",
    Object.fromEntries(res.headers.entries()),
  );

  if (!res.ok) {
    const errorText = await res.text().catch(() => "Unknown error");
    console.error("[API] Error response:", errorText);
    try {
      const errorJson = JSON.parse(errorText);
      console.error("[API] Error JSON:", errorJson);
      throw new Error(
        errorJson?.message || errorJson?.error || "Failed to add skill",
      );
    } catch (parseErr) {
      throw new Error(`HTTP ${res.status}: ${errorText}`);
    }
  }

  const data = await res.json();
  console.log("[API] Success response:", data);

  // Validate response
  if (!data) {
    console.error("[API] Response data is null/undefined");
    throw new Error("Invalid response from server");
  }

  if (!data.skillId && !data.id) {
    console.error("[API] Response missing skillId:", data);
  }

  console.log("========== [API] addSkillToAlumni COMPLETE ==========");
  return data;
}

/**
 * Remove a skill from alumni profile (Auth Required)
 * DELETE /api/alumni-skills/alumni/{alumniId}/skill/{skillId}
 */
export async function removeSkillFromAlumni(
  alumniId: number,
  skillId: number,
): Promise<void> {
  console.log("========== [API] removeSkillFromAlumni CALLED ==========");
  console.log("[API] alumniId:", alumniId);
  console.log("[API] skillId:", skillId);

  // Validate parameters
  if (!alumniId) {
    console.error("[API] alumniId is required:", alumniId);
    throw new Error("alumniId is required");
  }

  if (!skillId) {
    console.error("[API] skillId is required:", skillId);
    throw new Error("skillId is required");
  }

  const endpoint = `${API_BASE}/api/alumni-skills/alumni/${alumniId}/skill/${skillId}`;
  console.log("[API] Full endpoint:", endpoint);

  const res = await fetch(endpoint, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  console.log("[API] Response status:", res.status);

  if (!res.ok) {
    const errorText = await res.text().catch(() => "Unknown error");
    console.error("[API] Error response:", errorText);
    throw new Error("Failed to remove skill");
  }

  const text = await res.text();
  console.log("[API] Success response:", text || "(no content)");
  console.log("========== [API] removeSkillFromAlumni COMPLETE ==========");
}

/**
 * Get all alumni skills (Admin only)
 * GET /api/alumni-skills/all
 */
export async function getAllAlumniSkills(): Promise<AlumniSkill[]> {
  console.log("========== [API] getAllAlumniSkills CALLED ==========");

  const res = await fetch(`${API_BASE}/api/alumni-skills/all`, {
    headers: getAuthHeaders(),
  });

  console.log("[API] All alumni skills response status:", res.status);

  if (!res.ok) {
    throw new Error("Failed to fetch all alumni skills");
  }

  const data = await res.json();
  console.log("[API] All alumni skills received:", data);
  console.log("[API] Count:", data.length);

  return data;
}

// ==================== Courses API ====================

/**
 * Get all courses (Public)
 * GET /api/courses
 */
export async function getCourses(): Promise<
  Array<{
    id: number;
    departmentId: number;
    code: string;
    name: string;
    department: {
      id: number;
      code: string;
      name: string;
    };
  }>
> {
  console.log("========== [API] getCourses CALLED ==========");

  const token = localStorage.getItem("token");
  console.log("[API] Token exists:", !!token);

  const res = await fetch(`${API_BASE}/api/courses`, {
    headers: getAuthHeaders(),
  });

  console.log("[API] Courses response status:", res.status);

  if (!res.ok) {
    const errorText = await res.text().catch(() => "Unknown error");
    console.error("[API] Courses error response:", errorText);
    throw new Error(`Failed to fetch courses: ${res.status} - ${errorText}`);
  }

  const data = await res.json();
  console.log("[API] Courses data received:", data);
  console.log("[API] Courses count:", data.length);

  // Validate data structure
  if (!Array.isArray(data)) {
    console.error("[API] Courses response is not an array:", data);
    throw new Error("Invalid courses response format");
  }

  data.forEach((course, index) => {
    if (!course.id || !course.code || !course.name) {
      console.error(
        `[API] Course at index ${index} is missing required fields:`,
        course,
      );
    }
  });

  console.log("========== [API] getCourses COMPLETE ==========");
  return data;
}

/**
 * Get course by ID (Public)
 * GET /api/courses/{courseId}
 */
export async function getCourse(courseId: number): Promise<{
  id: number;
  departmentId: number;
  code: string;
  name: string;
  department: {
    id: number;
    code: string;
    name: string;
  };
}> {
  console.log("========== [API] getCourse CALLED ==========");
  console.log("[API] courseId:", courseId);

  if (!courseId) {
    console.error("[API] courseId is required:", courseId);
    throw new Error("courseId is required");
  }

  const res = await fetch(`${API_BASE}/api/courses/${courseId}`, {
    headers: getAuthHeaders(),
  });

  console.log("[API] Course response status:", res.status);

  if (!res.ok) {
    const errorText = await res.text().catch(() => "Unknown error");
    console.error("[API] Course error:", errorText);
    throw new Error(`Course not found: ${res.status}`);
  }

  const data = await res.json();
  console.log("[API] Course data received:", data);

  // Validate response
  if (!data || !data.id || !data.code || !data.name) {
    console.error("[API] Course data is missing required fields:", data);
    throw new Error("Invalid course data");
  }

  console.log("========== [API] getCourse COMPLETE ==========");
  return data;
}

// ==================== Admin Skills API ====================
// Note: All admin functions have 'Admin' suffix to distinguish from user functions

/**
 * Get all pending skills awaiting approval (Admin only)
 * GET /api/skills/pending
 */
export async function getPendingSkillsAdmin(): Promise<Skill[]> {
  console.log("========== [API] getPendingSkillsAdmin CALLED ==========");

  const token = localStorage.getItem("token");
  console.log("[API] Token exists:", !!token);

  const res = await fetch(`${API_BASE}/api/skills/pending`, {
    headers: getAuthHeaders(),
  });

  console.log("[API] Pending skills response status:", res.status);

  if (!res.ok) {
    const errorText = await res.text().catch(() => "Unknown error");
    console.error("[API] Pending skills error:", errorText);

    if (res.status === 403) {
      throw new Error("Admin access required");
    }
    throw new Error(`Failed to fetch pending skills: ${res.status}`);
  }

  const data = await res.json();
  console.log("[API] Pending skills received:", data);
  console.log("[API] Pending skills count:", data.length);

  // Validate response
  if (!Array.isArray(data)) {
    console.error("[API] Pending skills response is not an array:", data);
    throw new Error("Invalid pending skills response format");
  }

  console.log("========== [API] getPendingSkillsAdmin COMPLETE ==========");
  return data;
}

/**
 * Get all skills (Admin view)
 * GET /api/skills/all
 */
export async function getAllSkillsAdmin(): Promise<Skill[]> {
  console.log("========== [API] getAllSkillsAdmin CALLED ==========");

  const token = localStorage.getItem("token");
  console.log("[API] Token exists:", !!token);

  const res = await fetch(`${API_BASE}/api/skills/all`, {
    headers: getAuthHeaders(),
  });

  console.log("[API] All skills response status:", res.status);

  if (!res.ok) {
    const errorText = await res.text().catch(() => "Unknown error");
    console.error("[API] All skills error:", errorText);

    if (res.status === 403) {
      throw new Error("Admin access required");
    }
    throw new Error(`Failed to fetch all skills: ${res.status}`);
  }

  const data = await res.json();
  console.log("[API] All skills received:", data);
  console.log("[API] All skills count:", data.length);

  return data;
}

/**
 * Update a skill - approve/reject (Admin only)
 * PUT /api/skills/{skillId}
 */
export async function updateSkillAdmin(
  skillId: number,
  data: UpdateSkillRequest,
): Promise<Skill> {
  console.log("========== [API] updateSkillAdmin CALLED ==========");
  console.log("[API] skillId:", skillId);
  console.log("[API] Update data:", data);

  if (!skillId) {
    console.error("[API] skillId is required:", skillId);
    throw new Error("skillId is required");
  }

  const token = localStorage.getItem("token");
  console.log("[API] Token exists:", !!token);

  const res = await fetch(`${API_BASE}/api/skills/${skillId}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  console.log("[API] Update skill response status:", res.status);

  if (!res.ok) {
    const errorBody = await res.json().catch(() => null);
    console.error("[API] Update skill error:", errorBody);

    if (res.status === 403) {
      throw new Error("Admin access required");
    }
    throw new Error(errorBody?.message || "Failed to update skill");
  }

  const result = await res.json();
  console.log("[API] Skill updated:", result);
  console.log("========== [API] updateSkillAdmin COMPLETE ==========");
  return result;
}

/**
 * Approve a skill (Admin only)
 * Helper function for updateSkillAdmin with isApproved: true
 */
export async function approveSkillAdmin(
  skillId: number,
  skillName: string,
): Promise<Skill> {
  console.log("[API] approveSkillAdmin CALLED:", skillId, skillName);
  return updateSkillAdmin(skillId, { name: skillName, isApproved: true });
}

/**
 * Reject a skill (Admin only)
 * Helper function for updateSkillAdmin with isApproved: false
 */
export async function rejectSkillAdmin(
  skillId: number,
  skillName: string,
): Promise<Skill> {
  console.log("[API] rejectSkillAdmin CALLED:", skillId, skillName);
  return updateSkillAdmin(skillId, { name: skillName, isApproved: false });
}

/**
 * Delete a skill (Admin only)
 * DELETE /api/skills/{skillId}
 * Note: Different from user's deleteSkill - this is for admin moderation
 */
export async function deleteSkillAdmin(skillId: number): Promise<void> {
  console.log("========== [API] deleteSkillAdmin CALLED ==========");
  console.log("[API] skillId:", skillId);

  const token = localStorage.getItem("token");
  console.log("[API] Token exists:", !!token);

  const res = await fetch(`${API_BASE}/api/skills/${skillId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  console.log("[API] Delete skill response status:", res.status);

  if (!res.ok) {
    const errorText = await res.text().catch(() => "Unknown error");
    console.error("[API] Delete skill error:", errorText);

    if (res.status === 403) {
      throw new Error("Admin access required");
    }
    throw new Error("Failed to delete skill");
  }

  console.log("[API] Skill deleted successfully");
  console.log("========== [API] deleteSkillAdmin COMPLETE ==========");
}
