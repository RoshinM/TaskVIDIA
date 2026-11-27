import { forwardAuthRequest } from "@/lib/auth-server";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  return forwardAuthRequest("register", body);
}
