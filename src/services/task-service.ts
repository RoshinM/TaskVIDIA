import { apiRequestClient, apiRequestWithHeaders } from "@/lib/api-client";
import type { PaginationMeta, Task, TaskPriority, TaskStatus } from "@/types";

export type TaskFilters = {
  projectId?: string;
  assigneeId?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  search?: string;
  page?: number;
  limit?: number;
};

export type TaskList = {
  tasks: Task[];
  pagination: PaginationMeta;
};

function buildQuery(filters: TaskFilters): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== "") params.set(key, String(value));
  }
  const query = params.toString();
  return query ? `?${query}` : "";
}

function readPagination(headers: Headers, taskCount: number): PaginationMeta {
  const readNumber = (name: string, fallback: number) => {
    const value = Number(headers.get(name));
    return headers.get(name) && Number.isFinite(value) ? value : fallback;
  };

  return {
    total: readNumber("X-Total-Count", taskCount),
    page: readNumber("X-Page", 1),
    limit: readNumber("X-Limit", taskCount),
    totalPages: readNumber("X-Total-Pages", taskCount > 0 ? 1 : 0),
  };
}

export async function getTasksPage(filters: TaskFilters = {}): Promise<TaskList> {
  const { data, headers } = await apiRequestWithHeaders<Task[]>(
    `/api/tasks${buildQuery(filters)}`,
  );
  return { tasks: data, pagination: readPagination(headers, data.length) };
}

export async function getTasks(filters: TaskFilters = {}): Promise<Task[]> {
  return (await getTasksPage(filters)).tasks;
}

export function getMyTasks(userId: string, filters: TaskFilters = {}) {
  return getTasks({ ...filters, assigneeId: userId });
}

export function getProjectTasks(projectId: string, filters: TaskFilters = {}) {
  return getTasks({ ...filters, projectId });
}

export function createTask(task: Omit<Task, "id">) {
  return apiRequestClient<Task>("/api/tasks", {
    method: "POST",
    body: JSON.stringify(task),
  });
}

export function updateTask(task: Task) {
  const { id, assigneeId, ...values } = task;
  return apiRequestClient<Task>(`/api/tasks/${id}`, {
    method: "PATCH",
    body: JSON.stringify({
      ...values,
      ...(assigneeId ? { assigneeId } : {}),
    }),
  });
}

export function deleteTask(taskId: string) {
  return apiRequestClient<void>(`/api/tasks/${taskId}`, { method: "DELETE" });
}
