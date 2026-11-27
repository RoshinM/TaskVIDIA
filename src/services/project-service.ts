import { apiRequest } from "@/lib/api-client";
import type { Project } from "@/types";

export function getProjects() {
  return apiRequest<Project[]>("/api/projects");
}

export function getProject(projectId: string) {
  return apiRequest<Project>(`/api/projects/${projectId}`);
}

export function createProject(project: Omit<Project, "id">) {
  return apiRequest<Project>("/api/projects", {
    method: "POST",
    body: JSON.stringify(project),
  });
}

export function updateProject(project: Project) {
  return apiRequest<Project>(`/api/projects/${project.id}`, {
    method: "PATCH",
    body: JSON.stringify(project),
  });
}

export function deleteProject(projectId: string) {
  return apiRequest<void>(`/api/projects/${projectId}`, { method: "DELETE" });
}
