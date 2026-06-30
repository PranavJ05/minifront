export type MentorshipMode = "ONLINE" | "OFFLINE" | "HYBRID";

export type CanonicalApplicationStatus =
  | "APPLIED"
  | "PROVISIONAL_SELECTED"
  | "DROPPED_OUT"
  | "FINAL_SELECTED"
  | "NOT_SELECTED";

export type LegacyApplicationStatus =
  "PENDING" | "SHORTLISTED" | "ACCEPTED" | "REJECTED";

export type MentorshipApplicationStatus =
  CanonicalApplicationStatus | LegacyApplicationStatus;

export type ReviewableMentorshipApplicationStatus =
  "PROVISIONAL_SELECTED" | "DROPPED_OUT";

export interface Mentorship {
  id: number;
  title: string;
  description: string;
  domain: string;
  mode: MentorshipMode;
  duration: string;
  yearsOfExperience: number;
  industry: string;
  expertise: string;
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
  yearsOfExperience: number;
  industry: string;
  expertise: string;
  applicationDeadline: string;
}

export interface UpdateMentorshipRequest extends CreateMentorshipRequest {}

export interface ApplyMentorshipRequest {
  motivation: string;
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
  status: MentorshipApplicationStatus;
  appliedAt: string;
}

export interface UpdateApplicationStatusRequest {
  status: ReviewableMentorshipApplicationStatus;
}
