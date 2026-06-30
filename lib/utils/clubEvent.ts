import { ClubEvent } from "@/lib/types/clubEvent";

export function getStatus(event: ClubEvent): string {

    const now = new Date();

    const start = new Date(event.startTime);

    const end = new Date(event.endTime);

    if (now < start) {
        return "Upcoming";
    }

    if (now > end) {
        return "Completed";
    }

    return "Ongoing";
}