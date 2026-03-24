// lib/utils.ts
import { type ClassValue, clsx } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function getInitials(name?: string): string {
  if (!name || typeof name !== "string") return "NA";

  return name
    .trim()
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// Simulates an auth check - in production this would verify JWT tokens
export function getCurrentUser() {
  if (typeof window === 'undefined') return null;
  const user = localStorage.getItem('alumni_user');
  return user ? JSON.parse(user) : null;
}

export function setCurrentUser(user: object) {
  localStorage.setItem('alumni_user', JSON.stringify(user));
}

export function clearCurrentUser() {
  localStorage.removeItem('alumni_user');
}

export function getDashboardPath(role: string): string {
  switch (role) {
    case 'faculty': return '/dashboard/faculty';
    case 'student': return '/dashboard/student';
    case 'alumni': return '/dashboard/alumni';
    default: return '/';
  }
}
