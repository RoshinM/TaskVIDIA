import {
  deleteProject,
  getProject,
  getUsers,
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
  const availableIds = new Set((await getUsers()).map((user) => user.id));
  const requestedMembers = Array.isArray(body.memberIds)
    ? body.memberIds
    : existing.memberIds;
  const memberIds = [
    ...new Set([...requestedMembers, existing.createdById]),
  ].filter((id) => availableIds.has(id));
  const updated: Project = {
    ...existing,
    id: projectId,
    name: body.name?.trim() || existing.name,
    description: body.description?.trim() ?? existing.description,
    color: body.color ?? existing.color,
    createdById: existing.createdById,
    memberIds,
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
