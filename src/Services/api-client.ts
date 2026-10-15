/**
 * SIMONIUM API Client
 *
 * Provides a shared way for frontend modules to communicate
 * with the SIMONIUM backend.
 *
 * IMPORTANT:
 * This client does not create a backend or database.
 * Authentication, authorization, validation, and data
 * protection must be implemented and enforced by the server.
 */

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code?: string,
  ) {
    super(message);

    this.name = "ApiError";
  }
}

type ApiRequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  headers?: HeadersInit;
  signal?: AbortSignal;
};

/**
 * Read the API base URL from the Vite environment.
 *
 * If no URL is configured, use the relative /api path.
 */
function getApiBaseUrl(): string {
  const configuredUrl = import.meta.env.VITE_API_BASE_URL;

  return configuredUrl
    ? configuredUrl.replace(/\/+$/, "")
    : "/api";
}

/**
 * Convert an API path into a complete request URL.
 */
function buildApiUrl(path: string): string {
  const baseUrl = getApiBaseUrl();
  const normalizedPath = path.startsWith("/")
    ? path
    : `/${path}`;

  return `${baseUrl}${normalizedPath}`;
}

/**
 * Make a request to the SIMONIUM backend.
 *
 * Supports JSON requests and responses.
 * Also supports requests without a response body.
 */
export async function apiRequest<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const {
    method = "GET",
    body,
    headers,
    signal,
  } = options;

  const requestHeaders = new Headers(headers);

  let requestBody: BodyInit | undefined;

  if (body !== undefined) {
    if (body instanceof FormData) {
      requestBody = body;
    } else {
      requestHeaders.set(
        "Content-Type",
        "application/json",
      );

      requestBody = JSON.stringify(body);
    }
  }

  requestHeaders.set("Accept", "application/json");

  let response: Response;

  try {
    response = await fetch(buildApiUrl(path), {
      method,
      headers: requestHeaders,
      body: requestBody,
      credentials: "include",
      signal,
    });
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw error;
    }

    throw new ApiError(
      "Unable to connect to the SIMONIUM server.",
      0,
      "NETWORK_ERROR",
    );
  }

  const responseText = await response.text();

  let responseData: unknown = undefined;

  if (responseText) {
    try {
      responseData = JSON.parse(responseText);
    } catch {
      responseData = responseText;
    }
  }

  if (!response.ok) {
    const errorData =
      typeof responseData === "object" &&
      responseData !== null
        ? (responseData as Record<string, unknown>)
        : undefined;

    const message =
      typeof errorData?.message === "string"
        ? errorData.message
        : `Request failed with status ${response.status}.`;

    const code =
      typeof errorData?.code === "string"
        ? errorData.code
        : undefined;

    throw new ApiError(
      message,
      response.status,
      code,
    );
  }

  return responseData as T;
}

/**
 * Convenient methods for common HTTP operations.
 */
export const apiClient = {
  get<T>(path: string, signal?: AbortSignal): Promise<T> {
    return apiRequest<T>(path, {
      method: "GET",
      signal,
    });
  },

  post<T>(path: string, body?: unknown): Promise<T> {
    return apiRequest<T>(path, {
      method: "POST",
      body,
    });
  },

  put<T>(path: string, body?: unknown): Promise<T> {
    return apiRequest<T>(path, {
      method: "PUT",
      body,
    });
  },

  patch<T>(path: string, body?: unknown): Promise<T> {
    return apiRequest<T>(path, {
      method: "PATCH",
      body,
    });
  },

  delete<T>(path: string): Promise<T> {
    return apiRequest<T>(path, {
      method: "DELETE",
    });
  },
};
