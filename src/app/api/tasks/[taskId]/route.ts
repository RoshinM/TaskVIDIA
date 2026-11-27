import { deleteTask, getTask, updateTask } from "@/services/mock-service";
import type { Task } from "@/types";

type RouteContext = { params: Promise<{ taskId: string }> };

export async function GET(_request: Request, { params }: RouteContext) {
  const { taskId } = await params;
  const task = await getTask(taskId);

  if (!task)
    return Response.json({ error: "Task not found." }, { status: 404 });
  return Response.json(task);
}

export async function PATCH(request: Request, { params }: RouteContext) {
  const { taskId } = await params;
  const existing = await getTask(taskId);

  if (!existing)
    return Response.json({ error: "Task not found." }, { status: 404 });

  const body = (await request.json()) as Partial<Task>;
  const updated = {
    ...existing,
    ...body,
    id: taskId,
    title: body.title?.trim() || existing.title,
  };

  return Response.json(await updateTask(updated));
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const { taskId } = await params;
  const existing = await getTask(taskId);

  if (!existing)
    return Response.json({ error: "Task not found." }, { status: 404 });
  await deleteTask(taskId);
  return new Response(null, { status: 204 });
}
