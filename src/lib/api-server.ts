import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { BACKEND_URL, SESSION_COOKIE } from "@/lib/auth-constants";

const PAGINATION_HEADERS = [
  "X-Total-Count",
  "X-Page",
  "X-Limit",
  "X-Total-Pages",
];

type RequestOptions = {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  body?: unknown;
  query?: Request;
};

export async function apiRequestServer(path: string, options: RequestOptions = {}) {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (!token) {
    return NextResponse.json(
      { error: "Authentication required." },
      { status: 401 },
    );
  }

  const url = new URL(`${BACKEND_URL}${path}`);
  if (options.query) {
    new URL(options.query.url).searchParams.forEach((value, key) => {
      url.searchParams.append(key, value);
    });
  }

  let backendResponse: Response;
  try {
    backendResponse = await fetch(url, {
      method: options.method ?? "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        ...(options.body === undefined
          ? {}
          : { "Content-Type": "application/json" }),
      },
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
      cache: "no-store",
    });
  } catch {
    return NextResponse.json(
      { error: "Could not reach the backend service." },
      { status: 503 },
    );
  }

  if (backendResponse.status === 204) {
    return new Response(null, { status: 204 });
  }

  const headers = new Headers();
  headers.set(
    "Content-Type",
    backendResponse.headers.get("Content-Type") ?? "application/json",
  );
  for (const name of PAGINATION_HEADERS) {
    const value = backendResponse.headers.get(name);
    if (value) headers.set(name, value);
  }

  return new Response(await backendResponse.text(), {
    status: backendResponse.status,
    headers,
  });
}

export async function readJsonBody(request: Request): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    return null;
  }
}
