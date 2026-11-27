import { projects, tasks, users } from "@/data/mock-data";
import type { Project, Task, User } from "@/types";

// Swap these local implementations for API requests when the backend is ready.
export async function getProjects(): Promise<Project[]> {
  return [...projects];
}
export async function getProject(
  projectId: string,
): Promise<Project | undefined> {
  return projects.find((project) => project.id === projectId);
}
export async function getTasks(): Promise<Task[]> {
  return [...tasks];
}
export async function getTask(taskId: string): Promise<Task | undefined> {
  return tasks.find((task) => task.id === taskId);
}
export async function getMyTasks(userId: string): Promise<Task[]> {
  return tasks.filter((task) => task.assigneeId === userId);
}
export async function getUsers(): Promise<User[]> {
  return [...users];
}
export async function searchUsers(query: string): Promise<User[]> {
  const term = query.trim().toLowerCase();
  if (!term) return [...users];
  return users.filter(
    (user) =>
      user.name.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term),
  );
}
export async function createProject(project: Project): Promise<Project> {
  projects.unshift(project);
  return project;
}
export async function updateProject(project: Project): Promise<Project> {
  const index = projects.findIndex((item) => item.id === project.id);
  if (index >= 0) projects[index] = project;
  return project;
}
export async function deleteProject(projectId: string): Promise<void> {
  const index = projects.findIndex((item) => item.id === projectId);
  if (index >= 0) projects.splice(index, 1);
  for (let taskIndex = tasks.length - 1; taskIndex >= 0; taskIndex -= 1) {
    if (tasks[taskIndex].projectId === projectId) tasks.splice(taskIndex, 1);
  }
}
export async function createTask(task: Task): Promise<Task> {
  tasks.unshift(task);
  return task;
}
export async function updateTask(task: Task): Promise<Task> {
  const index = tasks.findIndex((item) => item.id === task.id);
  if (index >= 0) tasks[index] = task;
  return task;
}
export async function deleteTask(taskId: string): Promise<void> {
  const index = tasks.findIndex((item) => item.id === taskId);
  if (index >= 0) tasks.splice(index, 1);
}
