import { apiRequestServer, readJsonBody } from "@/lib/api-server";

export async function GET(request: Request) {
  return apiRequestServer("/projects", { query: request });
}

export async function POST(request: Request) {
  return apiRequestServer("/projects", {
    method: "POST",
    body: await readJsonBody(request),
  });
}
