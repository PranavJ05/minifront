// lib/utils/dateUtils.ts

/**
 * Returns short month string e.g. "OCT"
 */
export function formatMonth(iso: string): string {
  return new Date(iso)
    .toLocaleString("en-IN", { month: "short" })
    .toUpperCase();
}

/**
 * Returns zero-padded day e.g. "05"
 */
export function formatDay(iso: string): string {
  return new Date(iso).getDate().toString().padStart(2, "0");
}

/**
 * Returns full readable date e.g. "15 Oct 2024, 10:00 AM"
 */
export function formatEventDate(iso: string): string {
  return new Date(iso).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Returns "MMMM YYYY" for section headers e.g. "October 2024"
 */
export function formatMonthYear(iso: string): string {
  return new Date(iso).toLocaleString("en-IN", {
    month: "long",
    year: "numeric",
  });
}

/**
 * True if the event is in the future
 */
export function isUpcoming(iso: string): boolean {
  return new Date(iso) > new Date();
}

/**
 * True if the event is in the past
 */
export function isPast(iso: string): boolean {
  return new Date(iso) < new Date();
}
