import { apiRequestServer, readJsonBody } from "@/lib/api-server";

type RouteContext = { params: Promise<{ taskId: string }> };

export async function GET(_request: Request, { params }: RouteContext) {
  const { taskId } = await params;
  return apiRequestServer(`/tasks/${taskId}`);
}

export async function PATCH(request: Request, { params }: RouteContext) {
  const { taskId } = await params;
  return apiRequestServer(`/tasks/${taskId}`, {
    method: "PATCH",
    body: await readJsonBody(request),
  });
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const { taskId } = await params;
  return apiRequestServer(`/tasks/${taskId}`, { method: "DELETE" });
}
