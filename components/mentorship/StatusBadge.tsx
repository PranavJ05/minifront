import { Badge } from "@/components/ui/badge";
import type { MentorshipApplicationStatus } from "@/lib/types/mentorship";

const variantMap: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  APPLIED: "secondary",
  PROVISIONAL_SELECTED: "secondary",
  DROPPED_OUT: "destructive",
  FINAL_SELECTED: "default",
  NOT_SELECTED: "outline",
  CONFIRMED: "default",
  DECLINED_BY_MENTOR: "destructive",
  COMPLETED: "default",
  PENDING: "secondary",
  SHORTLISTED: "secondary",
  ACCEPTED: "default",
  REJECTED: "destructive",
};

const labelMap: Record<string, string> = {
  APPLIED: "Applied",
  PROVISIONAL_SELECTED: "Shortlisted",
  DROPPED_OUT: "Dropped",
  FINAL_SELECTED: "Selected",
  NOT_SELECTED: "Not Selected",
  CONFIRMED: "Active",
  DECLINED_BY_MENTOR: "Declined",
  COMPLETED: "Completed",
  PENDING: "Pending",
  SHORTLISTED: "Shortlisted",
  ACCEPTED: "Accepted",
  REJECTED: "Rejected",
};

export function StatusBadge({ status }: { status: MentorshipApplicationStatus }) {
  return (
    <Badge variant={variantMap[status] ?? "outline"}>
      {labelMap[status] ?? status}
    </Badge>
  );
}
