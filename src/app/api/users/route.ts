import { apiRequestServer } from "@/lib/api-server";

export async function GET(request: Request) {
  return apiRequestServer("/users", { query: request });
}
