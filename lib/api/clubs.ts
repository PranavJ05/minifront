import { api } from "@/lib/fetcher";

export async function getMyClubs() {
  return api("/api/clubs/my-clubs");
}
