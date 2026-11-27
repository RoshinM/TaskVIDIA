import { NextResponse } from "next/server";
import { BACKEND_URL, SESSION_COOKIE } from "@/lib/auth-constants";
import type { AuthPayload } from "@/types/auth";

// for proper responses in login and registration
export async function forwardAuthRequest(
  path: "login" | "register",
  body: unknown,
) {
  if (!body || typeof body !== "object") {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 },
    );
  }

  let backendResponse: Response;

  try {
    backendResponse = await fetch(`${BACKEND_URL}/auth/${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    });
  } catch {
    return NextResponse.json(
      { error: "Could not reach the auth service." },
      { status: 503 },
    );
  }

  const result = (await backendResponse.json().catch(() => null)) as
    | (Partial<AuthPayload> & { error?: string })
    | null;

  if (!backendResponse.ok) {
    return NextResponse.json(
      { error: result?.error ?? "The request could not be completed." },
      { status: backendResponse.status },
    );
  }

  if (!result?.accessToken || !result.user) {
    return NextResponse.json(
      { error: "Invalid response from the auth service." },
      { status: 502 },
    );
  }

  const response = NextResponse.json(
    { user: result.user },
    { status: backendResponse.status },
  );

  if (path === "login") {
    setSessionCookie(response, result.accessToken);
  }

  return response;
}

export function setSessionCookie(response: NextResponse, token: string) {
  const configuredMaxAge = Number(process.env.JWT_EXPIRES_IN ?? 3600);
  const maxAge =
    Number.isInteger(configuredMaxAge) && configuredMaxAge > 0
      ? configuredMaxAge
      : 3600;

  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge,
  });
}

export function clearSessionCookie(response: NextResponse) {
  response.cookies.set(SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}
