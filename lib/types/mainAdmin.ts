export interface UserSummary {
  id: number;

  name: string;

  email: string;

  role: string;

  accountStatus: string;

  clubManager: boolean;
}
export interface UserClubAssignment {
  userClubId: number;

  clubId: number;

  clubName: string;
}
export interface Club {
  id: number;

  name: string;

  description: string;

  logoUrl: string;
}

export interface BatchAdminSummary {
  id: number;
  userId: number;
  alumniId: number;
  name: string;
  email: string;
  batchYear: number | null;
  alumniBatchYear: number | null;
  department: string | null;
  profession: string | null;
}

export interface BatchAdminCreateRequest {
  alumniId: number;
  batchYear?: number;
}

export interface BatchAdminUpdateRequest {
  batchYear: number;
}

export interface AlumniPromotionCandidate {
  alumniId: number;
  name: string;
  email: string;
  batchYear: number | null;
  department: string | null;
  profession: string | null;
}
