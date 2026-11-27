import { apiRequest } from "@/lib/api-client";
import type { Task } from "@/types";

export function getTasks() {
  return apiRequest<Task[]>("/api/tasks");
}

export function getMyTasks(userId: string) {
  return apiRequest<Task[]>(
    `/api/tasks?assigneeId=${encodeURIComponent(userId)}`,
  );
}

export function getProjectTasks(projectId: string) {
  return apiRequest<Task[]>(
    `/api/tasks?projectId=${encodeURIComponent(projectId)}`,
  );
}

export function createTask(task: Omit<Task, "id">) {
  return apiRequest<Task>("/api/tasks", {
    method: "POST",
    body: JSON.stringify(task),
  });
}

export function updateTask(task: Task) {
  return apiRequest<Task>(`/api/tasks/${task.id}`, {
    method: "PATCH",
    body: JSON.stringify(task),
  });
}

export function deleteTask(taskId: string) {
  return apiRequest<void>(`/api/tasks/${taskId}`, { method: "DELETE" });
}
