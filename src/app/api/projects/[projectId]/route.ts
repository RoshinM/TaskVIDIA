import { apiRequestServer, readJsonBody } from "@/lib/api-server";

type RouteContext = { params: Promise<{ projectId: string }> };

export async function GET(_request: Request, { params }: RouteContext) {
  const { projectId } = await params;
  return apiRequestServer(`/projects/${projectId}`);
}

export async function PATCH(request: Request, { params }: RouteContext) {
  const { projectId } = await params;
  return apiRequestServer(`/projects/${projectId}`, {
    method: "PATCH",
    body: await readJsonBody(request),
  });
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const { projectId } = await params;
  return apiRequestServer(`/projects/${projectId}`, { method: "DELETE" });
}
