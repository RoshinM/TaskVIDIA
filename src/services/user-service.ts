import { apiRequest } from "@/lib/api-client";
import type { User } from "@/types";

export function searchUsers(query: string) {
  return apiRequest<User[]>(`/api/users?q=${encodeURIComponent(query)}`);
}
