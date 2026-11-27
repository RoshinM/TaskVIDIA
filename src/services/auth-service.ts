import { apiRequest } from "@/lib/api-client";
import type { AuthResponse, AuthUser } from "@/types/auth";

export function login(email: string, password: string) {
  return apiRequest<AuthResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function register(name: string, email: string, password: string) {
  return apiRequest<AuthResponse>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
}

export function getCurrentUser() {
  return apiRequest<AuthUser>("/api/auth/me");
}

export function logout() {
  return apiRequest<{ ok: boolean }>("/api/session", { method: "DELETE" });
}
