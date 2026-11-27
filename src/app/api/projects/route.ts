import { createProject, getProjects } from "@/services/mock-service";
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

  const project: Project = {
    id: body.id ?? crypto.randomUUID(),
    name: body.name.trim(),
    description: body.description?.trim() ?? "",
    color: body.color ?? "violet",
  };

  return Response.json(await createProject(project), { status: 201 });
}
