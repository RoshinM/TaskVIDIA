import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { BACKEND_URL, SESSION_COOKIE } from "@/lib/auth-constants";

export async function GET() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;

  if (!token) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  let backendResponse: Response;

  try {
    backendResponse = await fetch(`${BACKEND_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
  } catch {
    return NextResponse.json(
      { error: "Could not reach the auth service." },
      { status: 503 },
    );
  }

  const result = (await backendResponse.json().catch(() => null)) as unknown;
  return NextResponse.json(result, { status: backendResponse.status });
}
