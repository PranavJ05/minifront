export type MentorshipMode =
  | "ONLINE"
  | "OFFLINE"
  | "HYBRID";

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

export interface UpdateMentorshipRequest
  extends CreateMentorshipRequest {}

export interface ApplyMentorshipRequest {

  motivation: string;

}

export interface ApplicationStatusResponse {

  applied: boolean;

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

  status:
    | "PENDING"
    | "SHORTLISTED"
    | "ACCEPTED"
    | "REJECTED";

  appliedAt: string;

}