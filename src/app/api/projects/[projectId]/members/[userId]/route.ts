import { apiRequestServer } from "@/lib/api-server";

type RouteContext = {
  params: Promise<{ projectId: string; userId: string }>;
};

export async function DELETE(_request: Request, { params }: RouteContext) {
  const { projectId, userId } = await params;
  return apiRequestServer(`/projects/${projectId}/members/${userId}`, {
    method: "DELETE",
  });
}
