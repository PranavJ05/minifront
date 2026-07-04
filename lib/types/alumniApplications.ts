export interface AlumniApplication {
  id: number;
  userId: number;
  name: string;
  email: string;
  department: string | null;
  batchYear: number | null;
  profession: string | null;
  linkedin: string | null;
  phone: string | null;
  location: string | null;
  bio: string | null;
  profilePicture: string | null;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  updatedAt: string;
}

export interface ApplicationActionResponse {
  success: boolean;
  message: string;
}
