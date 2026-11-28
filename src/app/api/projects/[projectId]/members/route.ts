import { apiRequestServer, readJsonBody } from "@/lib/api-server";

type RouteContext = { params: Promise<{ projectId: string }> };

export async function PUT(request: Request, { params }: RouteContext) {
  const { projectId } = await params;
  return apiRequestServer(`/projects/${projectId}/members`, {
    method: "PUT",
    body: await readJsonBody(request),
  });
}

export async function POST(request: Request, { params }: RouteContext) {
  const { projectId } = await params;
  return apiRequestServer(`/projects/${projectId}/members`, {
    method: "POST",
    body: await readJsonBody(request),
  });
}
