import { apiRequestClient } from "@/lib/api-client";
import type { User } from "@/types";

export function getUsers() {
  return apiRequestClient<User[]>("/api/users");
}

export function searchUsers(query: string) {
  const term = query.trim();
  return term ? apiRequestClient<User[]>(`/api/users?q=${encodeURIComponent(term)}`) : getUsers();
}
