// lib/roleUtils.ts
// Utility functions for handling multiple user roles

/**
 * Check if user has ANY of the required roles
 * Supports both string and array of roles from backend
 *
 * @param userRoles - Single role string or array of roles
 * @param requiredRoles - One or more roles to check for
 * @returns true if user has at least one of the required roles
 *
 * @example
 * hasRole('admin', 'admin') // true
 * hasRole(['alumni', 'admin'], 'admin') // true
 * hasRole(['alumni', 'admin'], ['admin', 'batch_admin']) // true
 * hasRole('alumni', 'admin') // false
 */
export function hasRole(
  userRoles: string | string[] | null | undefined,
  requiredRoles: string | string[]
): boolean {
  if (!userRoles) return false;

  // Normalize user roles to array
  const rolesArray = Array.isArray(userRoles)
    ? userRoles.map(r => r.toLowerCase())
    : [userRoles.toLowerCase()];

  // Normalize required roles to array
  const requiredArray = Array.isArray(requiredRoles)
    ? requiredRoles.map(r => r.toLowerCase())
    : [requiredRoles.toLowerCase()];

  // Check if ANY required role matches
  return requiredArray.some(required => rolesArray.includes(required));
}

/**
 * Check if user has admin access (admin OR batch_admin)
 */
/**
 * Main Admin only
 */
export function isMainAdmin(
  userRoles: string | string[] | null | undefined
): boolean {

  return hasRole(userRoles, "admin");

}

/**
 * Batch Admin only
 */
export function isBatchAdmin(
  userRoles: string | string[] | null | undefined
): boolean {

  return hasRole(userRoles, "batch_admin");

}

/**
 * Any administrative role
 */
export function isAnyAdmin(
  userRoles: string | string[] | null | undefined
): boolean {

  return hasRole(userRoles, ["admin", "batch_admin"]);

}

export function isAlumni(
  userRoles: string | string[] | null | undefined
): boolean {

  return hasRole(userRoles, "alumni");

}

export function isStudent(
  userRoles: string | string[] | null | undefined
): boolean {

  return hasRole(userRoles, "student");

}

export function isFaculty(
  userRoles: string | string[] | null | undefined
): boolean {

  return hasRole(userRoles, "faculty");

}

/**
 * Get the primary role (first non-alumni admin role if exists, otherwise first role)
 * Useful for display purposes
 */
export function getPrimaryRole(userRoles: string | string[] | null | undefined): string | null {
  if (!userRoles) return null;

  const rolesArray = Array.isArray(userRoles)
    ? userRoles.map(r => r.toLowerCase())
    : [userRoles.toLowerCase()];

  // Priority: admin > batch_admin > faculty > student > alumni
  const priority = ['admin', 'batch_admin', 'faculty', 'student', 'alumni'];

  for (const role of priority) {
    if (rolesArray.includes(role)) {
      return role;
    }
  }

  return rolesArray[0] || null;
}

/**
 * Normalize role for display (batch_admin -> alumni for UI purposes)
 */
export function normalizeRoleForDisplay(role: string): "faculty" | "student" | "alumni" | "admin" {
  const normalized = role.toLowerCase();
  if (normalized === "faculty") return "faculty";
  if (normalized === "student") return "student";
  if (normalized === "admin" || normalized === "batch_admin") return "admin";
  return "alumni";
}
