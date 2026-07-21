export interface ProfileSkillSummary {
  skillId: number;
  skillName: string;
  normalizedName: string;
}

export interface ProfileEventSummary {
  id: number;
  title: string;
  eventDate: string;
  location: string;
}

export interface ProfileOpportunitySummary {
  id: number;
  title: string;
  company: string;
  location: string;
  type: string;
  postedAt: string;
}

export interface AlumniProfileData {
  alumniId: number | null;
  batchYear: number | null;
  courseCode: string | null;
  courseName: string | null;
  branchName: string | null;
  profession: string | null;
  location: string | null;
  linkedinUrl: string | null;
  bio: string | null;
}

export interface StudentProfileData {
  studentId: number | null;
  rollNumber: string | null;
  fullName: string | null;
  batchYear: number | null;
  courseCode: string | null;
  courseName: string | null;
  branchCode: string | null;
  branchName: string | null;
  currentSemester: number | null;
  cgpa: number | null;
  linkedinUrl: string | null;
  githubUrl: string | null;
  portfolioUrl: string | null;
  profileUrl: string | null;
  bio: string | null;
  verified: boolean;
}

export interface FacultyProfileData {
  fullName: string | null;
  designation: string | null;
  departmentCode: string | null;
  departmentName: string | null;
  officeLocation: string | null;
  qualifications: string | null;
  subjectsTaught: string | null;
  linkedinUrl: string | null;
  googleScholarUrl: string | null;
  totalExperienceYears: number | null;
  joinDate: string | null;
  bio: string | null;
}

export interface MyProfileResponse {
  userId: number;
  name: string;
  email: string;
  profileImageUrl: string | null;
  roles: string[];
  primaryRole: "ALUMNI" | "STUDENT" | "FACULTY";
  phone: string | null;
  hasSeenWelcomeModal: boolean;
  profileCompletion: number;
  missingFields: string[];
  alumniProfile: AlumniProfileData | null;
  studentProfile: StudentProfileData | null;
  facultyProfile: FacultyProfileData | null;
  skills: ProfileSkillSummary[];
  events: ProfileEventSummary[];
  opportunities: ProfileOpportunitySummary[];
}
