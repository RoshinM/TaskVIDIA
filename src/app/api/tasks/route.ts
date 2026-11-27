import { createTask, getMyTasks, getTasks } from "@/services/mock-service";
import type { Task } from "@/types";

export async function GET(request: Request) {
  const searchParams = new URL(request.url).searchParams;
  const assigneeId = searchParams.get("assigneeId");
  const projectId = searchParams.get("projectId");
  const taskList = assigneeId ? await getMyTasks(assigneeId) : await getTasks();
  return Response.json(
    projectId
      ? taskList.filter((task) => task.projectId === projectId)
      : taskList,
  );
}

export async function POST(request: Request) {
  const body = (await request.json()) as Partial<Task>;

  if (!body.title?.trim() || !body.projectId || !body.assigneeId) {
    return Response.json(
      { error: "Task name, project, and assignee are required." },
      { status: 400 },
    );
  }

  const task: Task = {
    id: body.id ?? crypto.randomUUID(),
    title: body.title.trim(),
    description: body.description?.trim() ?? "",
    type: body.type ?? "TASK",
    status: body.status ?? "TODO",
    priority: body.priority ?? "MEDIUM",
    assigneeId: body.assigneeId,
    projectId: body.projectId,
    dueDate: body.dueDate ?? "",
  };

  return Response.json(await createTask(task), { status: 201 });
}
