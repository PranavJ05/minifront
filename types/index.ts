// types/index.ts

export type UserRole =
  | "faculty"
  | "student"
  | "alumni"
  | "admin"
  | "Batch_admin";
export type AccountStatus = "pending" | "approved" | "rejected";

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  department: string;
  graduationYear: string;
  phone?: string;
  linkedin?: string;
  profilePicture?: string;
  place?: string;
  profession?: string;
  status?: AccountStatus;
}

export interface Alumni {
  id: string;
  fullName: string;
  email: string;
  department: string;
  graduationYear: string;
  currentCompany: string;
  currentRole: string;
  location: string;
  profilePicture: string;
  linkedin?: string;
  website?: string;
  skills: string[];
  bio: string;
  experience: WorkExperience[];
  education: Education[];
  isOnline?: boolean;
}

export interface WorkExperience {
  id: string;
  company: string;
  role: string;
  location: string;
  startYear: string;
  endYear: string | "Present";
  description?: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startYear: string;
  endYear: string;
  activities?: string;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  type: "reunion" | "webinar" | "networking" | "workshop" | "other";
  description: string;
  image?: string;
  attendees: number;
  isFeatured?: boolean;
  isOnline?: boolean;
  RegisterLink?: string;
}

export interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  category: string;
  image?: string;
  author: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: "full-time" | "part-time" | "internship" | "contract";
  salary?: string;
  postedBy?: string;
  isAlumniOwned?: boolean;
  experience?: string;
  duration?: string;
  referrals?: number;
  postedAt: string;
}

export interface AlumniFilters {
  search: string;
  batch: string;
  department: string;
  company: string;
  location: string;
}

export interface AuthFormData {
  email: string;
  password: string;
  confirmPassword?: string;
  fullName?: string;
  role: UserRole;
  department?: string;
  graduationYear?: string;
  phone?: string;
  linkedin?: string;
  rememberMe?: boolean;
  place?: string;
  profession?: string;
}
