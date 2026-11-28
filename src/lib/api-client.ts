export type ApiResult<T> = {
  data: T;
  headers: Headers;
};

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function apiRequestWithHeaders<T>(
  path: string,
  init?: RequestInit,
): Promise<ApiResult<T>> {
  const response = await fetch(path, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  if (!response.ok) {
    const result = (await response.json().catch(() => null)) as {
      error?: string;
    } | null;
    throw new ApiError(
      result?.error ?? "The request could not be completed.",
      response.status,
    );
  }

  const data =
    response.status === 204
      ? (undefined as T)
      : ((await response.json()) as T);

  return { data, headers: response.headers };
}

export async function apiRequestClient<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const { data } = await apiRequestWithHeaders<T>(path, init);
  return data;
}
