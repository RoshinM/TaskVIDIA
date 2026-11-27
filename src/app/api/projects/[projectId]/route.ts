import {
  deleteProject,
  getProject,
  updateProject,
} from "@/services/mock-service";
import type { Project } from "@/types";

type RouteContext = { params: Promise<{ projectId: string }> };

export async function GET(_request: Request, { params }: RouteContext) {
  const { projectId } = await params;
  const project = await getProject(projectId);

  if (!project)
    return Response.json({ error: "Project not found." }, { status: 404 });
  return Response.json(project);
}

export async function PATCH(request: Request, { params }: RouteContext) {
  const { projectId } = await params;
  const existing = await getProject(projectId);

  if (!existing)
    return Response.json({ error: "Project not found." }, { status: 404 });

  const body = (await request.json()) as Partial<Project>;
  const updated = {
    ...existing,
    ...body,
    id: projectId,
    name: body.name?.trim() || existing.name,
  };

  return Response.json(await updateProject(updated));
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const { projectId } = await params;
  const existing = await getProject(projectId);

  if (!existing)
    return Response.json({ error: "Project not found." }, { status: 404 });
  await deleteProject(projectId);
  return new Response(null, { status: 204 });
}
