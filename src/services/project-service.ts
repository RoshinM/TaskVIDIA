import { apiRequestClient } from "@/lib/api-client";
import type { Project } from "@/types";

export type ProjectFormValues = Pick<Project, "name" | "description"> & {
  memberIds?: string[];
};

export function getProjects() {
  return apiRequestClient<Project[]>("/api/projects");
}

export function getProject(projectId: string) {
  return apiRequestClient<Project>(`/api/projects/${projectId}`);
}

export function createProject(project: ProjectFormValues) {
  return apiRequestClient<Project>("/api/projects", {
    method: "POST",
    body: JSON.stringify({
      name: project.name,
      description: project.description,
      ...(project.memberIds ? { memberIds: project.memberIds } : {}),
    }),
  });
}

export function updateProject(
  project: ProjectFormValues & Pick<Project, "id">,
) {
  return apiRequestClient<Project>(`/api/projects/${project.id}`, {
    method: "PATCH",
    body: JSON.stringify({
      name: project.name,
      description: project.description,
    }),
  });
}

export function deleteProject(projectId: string) {
  return apiRequestClient<void>(`/api/projects/${projectId}`, { method: "DELETE" });
}

export function setProjectMembers(projectId: string, userIds: string[]) {
  return apiRequestClient<Project>(`/api/projects/${projectId}/members`, {
    method: "PUT",
    body: JSON.stringify({ userIds }),
  });
}

export function addProjectMembers(projectId: string, userIds: string[]) {
  return apiRequestClient<Project>(`/api/projects/${projectId}/members`, {
    method: "POST",
    body: JSON.stringify({ userIds }),
  });
}

export function removeProjectMember(projectId: string, userId: string) {
  return apiRequestClient<Project>(
    `/api/projects/${projectId}/members/${userId}`,
    { method: "DELETE" },
  );
}
