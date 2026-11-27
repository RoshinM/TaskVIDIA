import { CURRENT_USER_ID } from "@/lib/current-user";
import { createProject, getProjects, getUsers } from "@/services/mock-service";
import type { Project } from "@/types";

export async function GET() {
  return Response.json(await getProjects());
}

export async function POST(request: Request) {
  const body = (await request.json()) as Partial<Project>;

  if (!body.name?.trim()) {
    return Response.json(
      { error: "Project name is required." },
      { status: 400 },
    );
  }

  const availableIds = new Set((await getUsers()).map((user) => user.id));
  const requestedCreator = body.createdById;
  const createdById =
    requestedCreator && availableIds.has(requestedCreator)
      ? requestedCreator
      : CURRENT_USER_ID;
  const requestedMembers = Array.isArray(body.memberIds) ? body.memberIds : [];
  const memberIds = [...new Set([...requestedMembers, createdById])].filter(
    (id) => availableIds.has(id),
  );

  const project: Project = {
    id: body.id ?? crypto.randomUUID(),
    name: body.name.trim(),
    description: body.description?.trim() ?? "",
    color: body.color ?? "violet",
    createdById,
    memberIds,
  };

  return Response.json(await createProject(project), { status: 201 });
}
