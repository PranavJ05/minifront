export interface AlumniSession {
  id: number;
  title: string;
  description: string;
  topicDomain: string;
  mode: string;
  venue: string;
  startTime: string;
  endTime: string;
  maxParticipants: number;
  registrationCount: number;

  createdBy?: {
    id: number;
    name: string;
    email: string;
  };
}
export interface SessionRegistration {
  id: number;

  student: {
    studentId: number;
    fullName: string;
    rollNumber: string;
    email: string;
    batchYear: number;
    
    branch?: {
      name: string;
    };
  };

  registeredAt: string;
}