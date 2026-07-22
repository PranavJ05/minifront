export type MentorshipMode = "ONLINE" | "OFFLINE" | "HYBRID";

export type CanonicalApplicationStatus =
  | "APPLIED"
  | "PROVISIONAL_SELECTED"
  | "DROPPED_OUT"
  | "FINAL_SELECTED"
  | "NOT_SELECTED"
  | "CONFIRMED"
  | "DECLINED_BY_MENTOR"
  | "COMPLETED";

export type LegacyApplicationStatus =
  "PENDING" | "SHORTLISTED" | "ACCEPTED" | "REJECTED";

export type MentorshipApplicationStatus =
  CanonicalApplicationStatus | LegacyApplicationStatus;

export type ReviewableMentorshipApplicationStatus =
  "PROVISIONAL_SELECTED" | "DROPPED_OUT";

export const DOMAINS = [
  "Software Engineering",
  "Data Science, AI & ML",
  "Cloud, DevOps & Infrastructure",
  "Cybersecurity",
  "VLSI & Chip Design",
  "Embedded Systems & IoT",
  "Telecommunications & Signal Processing",
  "Power, Energy & Electrical Systems",
  "Mechanical Engineering & Robotics",
  "Biomedical & Healthcare Technology",
  "Product Management",
  "Design (UI/UX & Product Design)",
  "Business, Finance & Consulting",
  "Marketing & Growth",
  "Entrepreneurship & Startups",
  "Government & Public Sector",
  "Academia & Research",
  "Other",
] as const;

export interface Mentorship {
  id: number;
  title: string;
  description: string;
  domain: string;
  mode: MentorshipMode;
  duration: string;
  durationDays: number;
  yearsOfExperience: number;
  expertise: string;
  maxMentees: number;
  applicationDeadline: string;
  applicationOpen: boolean;
  finalListVisibleToMentor?: boolean;
}

export interface CreateMentorshipRequest {
  title: string;
  description: string;
  domain: string;
  mode: MentorshipMode;
  duration: string;
  durationDays: number;
  yearsOfExperience: number;
  expertise: string;
  maxMentees: number;
  applicationDeadline: string;
}

export interface UpdateMentorshipRequest extends CreateMentorshipRequest {}

export interface ApplyMentorshipRequest {
  motivation: string;
  cgpaAtApplication: number;
}

export interface ApplicationStatusResponse {
  applied: boolean;
  status: MentorshipApplicationStatus | null;
  finalPublished: boolean;
  selected: boolean | null;
  message: string | null;
}

export interface CanEditResponse {
  canEdit: boolean;
}

export interface MentorshipApplication {
  applicationId: number;
  studentId: number;
  fullName: string;
  rollNumber: string;
  email: string;
  branch: string;
  batchYear: number;
  motivation: string;
  resumeUrl: string;
  cgpaAtApplication: number;
  status: MentorshipApplicationStatus;
  appliedAt: string;
  confirmedAt?: string | null;
  completedAt?: string | null;
}

export interface UpdateApplicationStatusRequest {
  status: ReviewableMentorshipApplicationStatus;
}

export interface MentorshipUpdate {
  id: number;
  applicationId: number;
  content: string;
  isMilestone: boolean;
  createdAt: string;
}

export interface PostUpdateRequest {
  content: string;
  isMilestone?: boolean;
}

export interface SubmitFeedbackRequest {
  rating: number;
  comment?: string;
}

export interface MentorshipFeedback {
  id: number;
  applicationId: number;
  rating: number;
  comment: string | null;
  submittedBy: "MENTOR" | "MENTEE";
  createdAt: string;
}

export interface MyApplication {
  applicationId: number;
  mentorshipId: number;
  mentorshipTitle: string;
  mentorName: string;
  status: MentorshipApplicationStatus;
  appliedAt: string;
  confirmedAt: string | null;
  completedAt: string | null;
}
